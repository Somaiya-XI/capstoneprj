from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


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
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json["message"]
        except Exception as e:
            message = text_data
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


class SimulationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.channel_layer.group_add('simulation', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('simulation', self.channel_name)

    async def receive(self, text_data):
        await self.channel_layer.group_send(
            "simulation",
            {
                "type": "notify_user",
                "message": text_data + ', Success!',
            },
        )

    async def update_user(self, event):
        await self.send(text_data=json.dumps({'message': event['message']}))


def push_updates(message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("simulation", {"type": 'update_user', "message": message})
