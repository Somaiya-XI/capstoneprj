import os
from celery import Celery
from celery.schedules import crontab


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'WiseR.settings')

app = Celery('WiseR')

app.config_from_object('django.conf:settings', namespace='CELERY')


@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    from product.tasks import reduce_days_to_expiry

    sender.add_periodic_task(
        crontab(hour=0, minute=0), reduce_days_to_expiry.s(), name='reduce_days_to_expiry_every_day'
    )


app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
