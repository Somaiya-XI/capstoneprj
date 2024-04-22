from django.apps import AppConfig


class ProductConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'product'

    # running the threads whenever the apps are ready
    def ready(self):
        from .tasks import MqttTasks, ExpDateTasks

        MqttTasks.run_mqtt_subscriber()
        # will be replaced with celery worker!
        ExpDateTasks.run_reduce_remaining_days()
