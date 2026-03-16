from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "fact_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.workers.tasks.reports", "app.workers.tasks.connectors", "app.workers.tasks.alerts"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Seoul",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_routes={
        "app.workers.tasks.reports.*":    {"queue": "reports"},
        "app.workers.tasks.connectors.*": {"queue": "connectors"},
        "app.workers.tasks.alerts.*":     {"queue": "default"},
    },
    beat_schedule={
        # 매일 오전 6시 — 커넥터 풀 동기화
        "sync-erp-daily": {
            "task":     "app.workers.tasks.connectors.sync_erp",
            "schedule": crontab(hour=6, minute=0),
        },
        # 매주 월요일 오전 7시 — 주간 보고서 자동 초안
        "generate-weekly-reports": {
            "task":     "app.workers.tasks.reports.generate_weekly_drafts",
            "schedule": crontab(day_of_week=1, hour=7, minute=0),
        },
        # 매 15분 — 알림 체크
        "check-alerts": {
            "task":     "app.workers.tasks.alerts.check_kpi_thresholds",
            "schedule": crontab(minute="*/15"),
        },
    },
)
