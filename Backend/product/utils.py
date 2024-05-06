import json
import re
import requests
from datetime import date, datetime

from user.retailer.hardware_set.models import HardwareSet
from .models import SupermarketProduct, ProductBulk
from .serializers import SupermarketProductSerializer
from configuration.serializers import AutoOrderConfigSerializer
from bs4 import BeautifulSoup
from django.dispatch import receiver
from django.db.models.signals import pre_save

from configuration.models import NotificationConfig
from configuration.utils_config import quantity_order_config_manager, quantity_notification_config_manager

from .signals import product_removed, date_updated

from celery import shared_task
from django.db.models import F
from WiseR.consumers import NotificationManager as notify


class SupermarketProductManager:
    def __init__(self):
        pass

    ## Processing of recieved msgs to create/add/remove:
    def products_reciever(self, payload, topic):
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
                        product = SupermarketProduct.objects.get(tag_id=tag_id, retailer=device.retailer)
                        bulk = ProductBulk.objects.filter(product=product, expiry_date=expiry_date).first()
                        print('bulk is: ', bulk)
                        if topic.lower().find('add') != -1:
                            self.add_to_shelf(product, bulk)
                            print('added')
                        if topic.lower().find('remove') != -1:
                            self.remove_from_shelf(product, bulk)
                            print('removed')
                        if not bulk:
                            self.create_new_bulk(product, expiry_date)
                            print('new bulk for: ', bulk)
                    except HardwareSet.DoesNotExist:
                        return 'This device is not registered'
                    except SupermarketProduct.DoesNotExist:
                        product = p.create_new_product(device.retailer, tag_id, expiry_date)
                        print('created')
        except json.JSONDecodeError as e:
            return "Error decoding JSON payload:", e

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

    ## request to external database to get product details ##
    def get_product_details(self, tag_id):

        brand_name = None
        english_name = None
        arabic_name = None
        english_data = {}
        arabic_data = {}

        url = f"https://barcode-list.com/barcode/EN/Search.htm?barcode={tag_id}"

        response = requests.get(url)

        html_content = response.content

        soup = BeautifulSoup(html_content, 'html.parser')

        meta_tag = soup.find('meta', attrs={'name': 'description'})

        content = meta_tag['content']

        if content:
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

        if english_data or arabic_data:
            print(english_data, arabic_data)
            return english_data, arabic_data
        else:
            return "Error: Data Retrieve Failed"

    ## request to limited access database if not found on 1st##
    def get_details_API(self, tag_id):
        # APIKEY = os.getenv("LOOKUP_KEY")
        APIKEY = "333"
        url = f"https://api.barcodelookup.com/v3/products?barcode={tag_id}&key={APIKEY}"

        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            print('data: ', data)
            english_data, arabic_data = self.extract_API_data(data=data)
            return english_data, arabic_data
        else:
            return "error:", response.status_code

    ## create the product
    def create_new_product(self, retailer_id, tag_id, exp_date, *args, **kwargs):
        product = SupermarketProduct()

        if 'product_name' not in kwargs or not kwargs['product_name']:
            eng_product_data, ara_product_data = self.get_product_details(tag_id)
            print('data extracted: ', ara_product_data, eng_product_data)
            if not (eng_product_data and not ara_product_data) or 'error' in eng_product_data:
                return {'error': 'Failed, It looks like you have to provide the product name'}
            else:
                if "product_name" in eng_product_data and eng_product_data["product_name"]:
                    name = eng_product_data.get('product_name')
                else:
                    name = ara_product_data.get('product_name')

                if "brand" in eng_product_data and eng_product_data["brand"]:
                    product.brand = eng_product_data.get('brand')
                else:
                    product.brand = ara_product_data.get('brand')
        else:
            name = kwargs['product_name']

        product.tag_id = tag_id
        product.retailer = retailer_id
        product.price = 00
        product.quantity = 1
        product.product_name = name

        product.save()

        self.create_new_bulk(product, exp_date)
        return product

    def add_to_shelf(self, product, bulk):
        product.quantity = product.quantity + 1
        product.save()
        if bulk:
            self.add_to_bulk(bulk)

    def remove_from_shelf(self, product, bulk):
        if product.quantity == 0:
            return
        current_q = product.quantity
        product.quantity = product.quantity - 1
        product.save()
        if bulk:
            self.remove_from_bulk(bulk)
        product_removed.send(sender=self.__class__, product=product, quantity=current_q)

    def add_to_bulk(self, bulk):
        bulk.bulk_qyt = bulk.bulk_qyt + 1
        bulk.save()

    def remove_from_bulk(self, bulk):
        bulk.bulk_qyt = bulk.bulk_qyt - 1
        bulk.save()

    def create_new_bulk(self, product, exp):
        bulk = ProductBulk()
        bulk.product = product
        bulk.bulk_qyt = 1
        bulk.expiry_date = exp
        bulk.save()

    @staticmethod
    @receiver(pre_save, sender=ProductBulk)
    def calculate_days_to_exp(sender, instance, *args, **kwargs):
        if isinstance(instance.expiry_date, str):
            expiry_date = datetime.strptime(instance.expiry_date, '%Y-%m-%d').date()
        else:
            expiry_date = instance.expiry_date

        if not instance.pk:
            instance.days_to_expiry = (expiry_date - date.today()).days
        if instance.pk:
            original_instance = sender.objects.get(pk=instance.pk)
            old_exp = original_instance.expiry_date
            if old_exp != instance.expiry_date:
                instance.days_to_expiry = (expiry_date - date.today()).days

    @staticmethod
    @receiver(product_removed)
    def track_product_quantity(sender, **kwargs):
        product = kwargs['product']
        old_quant = kwargs['quantity']
        quant = product.quantity
        if old_quant != quant:
            quantity_order_config_manager(product=product)
            quantity_notification_config_manager(product=product)

    @staticmethod
    @receiver(date_updated)
    def track_expiry_date(sender, **kwargs):
        bulks = kwargs['bulks']
        for bulk in bulks:
            try:
                config = NotificationConfig.objects.get(retailer=bulk.product.retailer)
                if bulk.days_to_expiry == config.near_expiry_days:
                    notify.send_notification(
                        f'Product {bulk.product.product_name} will expire within {bulk.days_to_expiry} days!',
                        user_id=bulk.product.retailer,
                    )
            except NotificationConfig.DoesNotExist:
                return None

    @staticmethod
    @shared_task
    def reduce_days_to_expiry(self):
        ProductBulk.objects.filter(days_to_expiry__gt=0).update(days_to_expiry=F('days_to_expiry') - 1)

        bulks = ProductBulk.objects.all()

        date_updated.send(sender=self.reduce_days_to_expiry, bulks=bulks)
