from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, timedelta
from app.database import SessionLocal
from app.routers.meal_management import generate_tokens_for_date

def start_scheduler():

    scheduler = BackgroundScheduler()

    def job():
        db = SessionLocal()

        try:
            tomorrow = date.today() + timedelta(days=1)
            generate_tokens_for_date(tomorrow, db)
            print("✅ Tokens generated for", tomorrow)
        finally:
            db.close()

    # Runs every day at 9:00 PM
    scheduler.add_job(job, "cron", hour=21, minute=0)

    scheduler.start()
