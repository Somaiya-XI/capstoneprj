from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class NotificationConsumer(WebsocketConsumer):

    def connect(self):
        # get the connected user id
        self.user_connected = self.scope["url_route"]["kwargs"]["user_id"]

        # validate incoming id
        if self.user_connected in ['null', 'undefined']:
            self.close()
            return

        try:
            self.connection_type = self.scope["url_route"]["kwargs"]["type"]
            print('type', self.connection_type)
            if self.connection_type in ['confirm_auto_order']:
                self.user_channel = "user_%s_%s" % (self.user_connected, self.connection_type)
            else:
                # create user channel based on id
                self.user_channel = "user_%s" % self.user_connected
        except:
            # create user channel based on id
            self.user_channel = "user_%s" % self.user_connected

        print('channel', self.user_channel)

        # add user to his channel group
        async_to_sync(self.channel_layer.group_add)(self.user_channel, self.channel_name)

        # accept connection
        self.accept()

    def disconnect(self, close_code):
        if hasattr(self, 'user_channel'):
            async_to_sync(self.channel_layer.group_discard)(self.user_channel, self.channel_name)

    def receive(self, text_data):
        # access sent data based on format
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json["message"]
        except Exception as e:
            message = text_data

        # send back the message for validation
        async_to_sync(self.channel_layer.group_send)(
            self.user_channel, {"type": "notify_user", "message": text_data}
        )

    def notify_user(self, event):
        message = event["message"]

        # send notification to the user
        self.send(text_data=json.dumps({"message": message}))


class NotificationManager:
    # A method that takes the user, message and calls the notify user function
    @staticmethod
    def send_notification(message, user_id):
        user_channel = "user_%s" % str(user_id)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(user_channel, {"type": "notify_user", "message": message})


def send_confirmation(message, user_id, type):
    user_channel = "user_%s_%s" % (str(user_id), type)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(user_channel, {"type": "notify_user", "message": message})


class SimulationConsumer(AsyncWebsocketConsumer):
    # A class to manage callbacks of the simulation

    async def connect(self):
        await self.channel_layer.group_add('simulation', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('simulation', self.channel_name)

    async def receive(self, text_data):
        # await self.channel_layer.group_send(
        #     "simulation",
        #     {
        #         "type": "notify_user",
        #         "message": text_data + ', Success!',
        #     },
        # )
        pass

    async def update_user(self, event):
        await self.send(text_data=json.dumps({'message': event['message']}))


def push_updates(message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("simulation", {"type": 'update_user', "message": message})
