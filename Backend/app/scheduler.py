from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, timedelta,datetime
from app.database import SessionLocal
from app.routers.meal_management import generate_tokens_for_date
from app.routers.payment_management import generate_invoice_for_student
from app.models.student_details import Student 
from app.models.invoice import Invoice

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
    
    def generate_all_invoices():
        db = SessionLocal()

        students = db.query(Student).filter(
            Student.status=="Active"
            ).all()

        for student in students:
            generate_invoice_for_student(student.student_id, db)

        db.close()
    
    def mark_overdue_invoices():
        db = SessionLocal()
        today = datetime.date.today()

        invoices = db.query(Invoice).filter(
            Invoice.status == "unpaid"
        ).all()

        for invoice in invoices:
            if invoice.due_date and today > invoice.due_date:
                invoice.status = "overdue"

        db.commit()
        db.close()
    # Runs every day at 9:00 PM
    scheduler.add_job(job, "cron", hour=21, minute=0)
    scheduler.add_job(generate_all_invoices, "interval", days=1)
    scheduler.add_job(mark_overdue_invoices, "interval", hours=12)

    scheduler.start()
    
