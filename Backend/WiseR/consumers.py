from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from celery import shared_task
from user.models import User


class NotificationConsumer(WebsocketConsumer):

    def connect(self):
        self.user_connected = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_channel = "user_%s" % self.user_connected
        print(self.user_channel)
        async_to_sync(self.channel_layer.group_add)(self.user_channel, self.channel_name)

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.user_channel, self.channel_name)

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        async_to_sync(self.channel_layer.group_send)(
            self.user_channel, {"type": "notify_user", "message": message}
        )

    def notify_user(self, event):
        message = event["message"]

        self.send(text_data=json.dumps({"message": message}))


class NotificationManager:
    @staticmethod
    def send_notification(message, user_id):
        user_channel = "user_%s" % str(user_id)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(user_channel, {"type": "notify_user", "message": message})
