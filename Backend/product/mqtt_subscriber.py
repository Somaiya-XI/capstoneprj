import threading
import paho.mqtt.client as paho
from paho import mqtt
import os
import sys
from .utils import SupermarketProductManager

manager = SupermarketProductManager()


class MqttTasks:
    def __init__(self):
        # MQTT broker configuration
        self.mqtt_broker = os.getenv("MQTT_BROKER")
        self.mqtt_port = int(os.getenv("MQTT_PORT"))
        self.mqtt_username = os.getenv("MQTT_USERNAME")
        self.mqtt_password = os.getenv("MQTT_PASSWORD")
        self.mqtt_topics = ['gateway_0001/#']
        self.connected = 0

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
            client.subscribe(topic, qos=2)

    # whenever a message arrives, this method is executed
    def on_message(self, client, userdata, message):
        topic = message.topic
        payload = message.payload.decode("utf-8")
        # print("Received message:", payload, 'from:', topic)
        state = manager.products_reciever(payload, topic)

    # connect to the MQTT broker, subscribe to the topic, and wait for any message
    def mqtt_subscribe(self):
        client = paho.Client(
            paho.CallbackAPIVersion.VERSION2, client_id="", userdata=None, protocol=paho.MQTTv5
        )
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
    @staticmethod
    def run_mqtt_subscriber():
        if 'runserver' in sys.argv:
            mqttObj = MqttTasks()
            mqtt_thread = threading.Thread(target=mqttObj.mqtt_subscribe)
            mqtt_thread.daemon = True
            mqtt_thread.start()


MqttTasks.run_mqtt_subscriber()
