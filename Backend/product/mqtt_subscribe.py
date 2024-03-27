import paho.mqtt.client as mqtt
from django.http import HttpResponse
import json


# MQTT broker configuration
mqtt_broker = "192.168.8.162"
mqtt_port = 1883
mqtt_username = "mqttbroker"
mqtt_password = "mqtt_pass"
mqtt_topic = "hub/products"

combined_objects = []


# whenever a message arrive this method is executed
def on_message(client, userdata, message):
    topic = message.topic
    payload = message.payload.decode("utf-8")
    print("Received message:", payload, 'from:', topic)


# connect to the mqtt broker
# and subscribe to the topic
# then wait for any message
def mqtt_subscribe(request):
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
    client.username_pw_set(mqtt_username, mqtt_password)
    client.on_message = on_message
    client.connect(mqtt_broker, mqtt_port)
    client.subscribe(mqtt_topic)
    client.loop_start()

    return HttpResponse("MQTT subscription started.")
