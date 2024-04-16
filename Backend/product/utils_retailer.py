import threading
import paho.mqtt.client as paho
from paho import mqtt
import json
import os
import re
import requests

from user.retailer.hardware_set.models import HardwareSet
from .models import SupermarketProduct, ProductBulk
from bs4 import BeautifulSoup


class MqttManager:
    def __init__(self):
        # MQTT broker configuration
        self.mqtt_broker = os.getenv("MQTT_BROKER")
        self.mqtt_port = int(os.getenv("MQTT_PORT"))
        self.mqtt_username = os.getenv("MQTT_USERNAME")
        self.mqtt_password = os.getenv("MQTT_PASSWORD")
        self.mqtt_topics = ['gateway_0001/#']

        self.connected = 0

        # run MQTT subscriber in a thread
        self.run_mqtt_subscriber()

    ## Processing of recieved msgs to create/add/remove:
    def message_manager(self, payload, topic):
        try:
            data = json.loads(payload)
            p = SupermarketProductManager()
            if isinstance(data, list) and len(data) > 0:
                for obj in data:
                    device_id = obj.get('device_id')
                    tag_id = obj.get('tag_id')
                    expiry_date = obj.get('expiry_date')
                    try:
                        device = HardwareSet.objects.get(id=device_id)
                        product = SupermarketProduct.objects.get(tag_id=tag_id)
                        bulk = ProductBulk.objects.filter(expiry_date=expiry_date).first()
                        print('bulk is: ', bulk)
                        if topic.lower().find('add') != -1:
                            p.add_to_shelf(product, bulk)
                            print('added')
                        if topic.lower().find('remove') != -1:
                            p.remove_from_shelf(product, bulk)
                            print('removed')
                        if not bulk:
                            bulk = ProductBulk()
                            bulk.product = product
                            bulk.bulk_qyt = 1
                            bulk.expiry_date = expiry_date
                            bulk.save()
                            print('new bulk for: ', bulk)
                    except HardwareSet.DoesNotExist:
                        return 'This device is not registered'
                    except SupermarketProduct.DoesNotExist:
                        product = p.create_new(device.retailer, tag_id, expiry_date)
                        print('created')
        except json.JSONDecodeError as e:
            return "Error decoding JSON payload:", e

    ## Managing The Communication Over MQTT Protocol:
    def on_connect(self, client, userdata, flags, rc, properties=None):
        self.connected = 1
        # client_subscribe(client)
        print("Connected to MQTT server with code %s." % rc)

    def on_disconnect(self, client, userdata, flags, rc, properties=None):
        self.connected = 0
        print("Disconnected from MQTT server")

    def on_publish(self, client, userdata, mid, rc, properties=None):
        print("Published, mid: " + str(mid))

    def on_subscribe(self, client, userdata, mid, granted_qos, properties=None):
        print("Subscribed: " + str(granted_qos))

    def client_subscribe(self, client):
        for topic in self.mqtt_topics:
            client.subscribe(topic, qos=1)

    # whenever a message arrives, this method is executed
    def on_message(self, client, userdata, message):
        topic = message.topic
        payload = message.payload.decode("utf-8")
        print("Received message:", payload, 'from:', topic)
        state = self.message_manager(payload, topic)
        print(state)


    # connect to the MQTT broker, subscribe to the topic, and wait for any message
    def mqtt_subscribe(self):
        client = paho.Client(paho.CallbackAPIVersion.VERSION2, client_id="", userdata=None, protocol=paho.MQTTv5)
        client.on_connect = self.on_connect
        client.on_disconnect = self.on_disconnect
        client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
        client.username_pw_set(self.mqtt_username, self.mqtt_password)

        # connecting to MQTT broker
        client.connect(self.mqtt_broker, self.mqtt_port)

        client.on_subscribe = self.on_subscribe

        # can be extended to have topic-specific functions, currently the registered topic is generic
        for topic in self.mqtt_topics:
            client.message_callback_add(topic, self.on_message)

        self.client_subscribe(client)
        client.loop_start()

    # run MQTT subscriber in a thread to avoid interference with running server
    def run_mqtt_subscriber(self):
        mqtt_thread = threading.Thread(target=self.mqtt_subscribe)
        mqtt_thread.start()


mqttObj = MqttManager()


class SupermarketProductManager:
    def __init__(self):
        pass

    ## extract data from the api
    def extract_API_data(self, data):
        english_data = {}
        arabic_data = {}

        for product in data["products"]:
            title = product["title"]
            brand = product["brand"]
            size = product["size"]

            english_title_matches = re.findall(r'[a-zA-Z]+', title)
            english_brand_matches = re.findall(r'[a-zA-Z]+', brand)

            if english_title_matches:
                english_title = ' '.join(english_title_matches)
                english_data["product_name"] = english_title
                arabic_data["product_name"] = re.sub(r'[a-zA-Z]+', '', title)
            else:
                english_data["product_name"] = None
                arabic_data["product_name"] = title

            if english_brand_matches:
                english_brand = ' '.join(english_brand_matches)
                english_data["brand"] = english_brand
                arabic_data["brand"] = re.sub(r'[a-zA-Z]+', '', brand)
            else:
                english_data["brand"] = None
                arabic_data["brand"] = brand
            
            size_matches = re.search(r'(\d+\.?\d*)\s*([a-zA-Z]+)', size)
            if size_matches:
                size_number = float(size_matches.group(1))
                size_unit = size_matches.group(2)
                english_data["size"] = f"{size_number}{size_unit}"
                english_data["product_name"] = f"{english_data['product_name']} - {english_data['size']}"
                arabic_data["product_name"] = f"{arabic_data['product_name']} - {english_data['size']}"
            else:
                english_data["size"] = None
        return english_data, arabic_data

    ## request to limited access database if not found on 1st##
    def get_details_API(self, tag_id):
        APIKEY = os.getenv("LOOKUP_KEY")

        url = f"https://api.barcodelookup.com/v3/products?barcode={tag_id}&key={APIKEY}"

        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            print('data: ', data)
            english_data, arabic_data = self.extract_API_data(data=data)
            return english_data, arabic_data
        else:
            return "Error:", response.status_code

    ## request to external database to get product details ##
    def get_product_details(self, tag_id):
        
        brand_name = None
        english_name = None
        arabic_name = None
        english_data ={}
        arabic_data = {}

        url = f"https://barcode-list.com/barcode/EN/Search.htm?barcode={tag_id}"

        response = requests.get(url)

        html_content = response.content

        soup = BeautifulSoup(html_content, 'html.parser')

        meta_tag = soup.find('meta', attrs={'name': 'description'})

        content = meta_tag['content']

        if (content):
            items_list = content.split('following products:')[1].strip().split(';')

            items_list = [item.strip() for item in items_list]

            for item in items_list:
                if item.isascii() and english_name is None:
                    brand_name = item.split()[0]
                    english_name = item
                elif not item.isascii() and arabic_name is None:
                    arabic_name = item
                if english_name and arabic_name:
                    break

        if english_name:
            english_data = {"product_name": english_name, "brand": brand_name}
        elif arabic_name:
            arabic_data = {"product_name": arabic_name, "brand": '--'}
        else:
            english_data, arabic_data = self.get_details_API(tag_id)
        print(english_data, arabic_data)
        return english_data, arabic_data

    ## create the product  
    def create_new(self, retailer_id, tag_id, exp_date):
        product = SupermarketProduct()
        bulk = ProductBulk()
        eng_product_data, ara_product_data = self.get_product_details(tag_id)
            
        product.tag_id = tag_id
        product.expiry_date = exp_date
        product.retailer = retailer_id
        product.price = 00
        product.quantity = 1

        if "product_name" in eng_product_data and eng_product_data["product_name"]:
            product.product_name = eng_product_data.get('product_name')
        else:
            product.product_name = ara_product_data.get('product_name')
        if "brand" in eng_product_data and eng_product_data["brand"]:
            product.brand = eng_product_data.get('brand')
        else:
            product.brand = ara_product_data.get('brand')
        
        product.save()
        bulk.product = product
        bulk.expiry_date = exp_date
        bulk.bulk_qyt = 1
        bulk.save()
        return product
    
    def add_to_shelf(self, product, bulk):
        product.quantity = product.quantity + 1
        product.save()
        if bulk:
            self.add_to_bulk(bulk)

    def remove_from_shelf(self, product, bulk):
        if product.quantity == 0:
            return
        product.quantity = product.quantity - 1
        product.save()
        if bulk:
            self.remove_from_bulk(bulk)
    
    def add_to_bulk(self, bulk):
        bulk.bulk_qyt = bulk.bulk_qyt + 1
        bulk.save()
        
    def remove_from_bulk(self, bulk):
        bulk.bulk_qyt = bulk.bulk_qyt - 1
        bulk.save()









