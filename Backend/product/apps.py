from django.apps import AppConfig


class ProductConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'product'

    def ready(self):
        pass
        # will be replaced with celery worker!
        # ExpDateTasks.run_reduce_remaining_days()
