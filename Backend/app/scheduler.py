from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, timedelta,datetime
from app.database import SessionLocal
from app.routers.meal_management import process_generate_tokens
from app.routers.payment_management import generate_invoice_for_student,apply_percentage_late_fee
from app.models.student_details import Student 
from app.models.invoice import Invoice

import logging

# Configure the format: Time - Name of Logger - Severity - Message
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.StreamHandler(), # This prints to your terminal
        logging.FileHandler("hostel_app.log", encoding="utf-8") # This saves errors to a file
    ]
)

# Create a specific logger for your application
logger = logging.getLogger("HostelHub")
logging.getLogger('apscheduler').setLevel(logging.DEBUG)


def start_scheduler():
    logger.info("Scheduler started")

    scheduler = BackgroundScheduler()

    def job():
        db = SessionLocal()

        try:
            tomorrow = date.today() + timedelta(days=1)
            process_generate_tokens(tomorrow, db)
            logger.info("✅ Tokens generated for", tomorrow)
            
        except Exception as e:
            logger.exception("Error generating tokens:", e)
        finally:
            db.close()
    
    def generate_all_invoices():
        db = SessionLocal()
        try:

            students = db.query(Student).filter(
                Student.status=="Active"
                ).all()

            for student in students:
                generate_invoice_for_student(student.student_id, db)
            logger.info("✅ Monthly Invoices generated")
        except Exception as e:
            logger.exception(f"Error generating invoice: {e}")
        finally:
            db.close()
    
    def mark_overdue_invoices():
        logger.info("Marking overdue invoices...")
        db = SessionLocal()
        try:
            today = datetime.now()

            invoices = db.query(Invoice).filter(
                Invoice.status == "unpaid"
            ).all()

            for invoice in invoices:
                logger.info(f"Checking invoice {invoice.id}, due_date={invoice.due_date}, status={invoice.status}")
                if invoice.due_date and today.date() >= invoice.due_date.date():
                    invoice.status = "overdue"
                    logger.info(f"➡️ Marked invoice {invoice.id} as overdue")
                    apply_percentage_late_fee(invoice.id, db)

            db.commit()
        except Exception as e:
            logger.exception(f"Error marking overdue invoices: {e}")
            db.rollback()
        finally:
            db.close()
    # Runs every day at 9:00 PM
    scheduler.add_job(job, "cron", hour=21, minute=0, second=0)
    scheduler.add_job(generate_all_invoices, "cron", day=1 , hour=0, minute=5)
    scheduler.add_job(mark_overdue_invoices, "interval", hours=12)

    scheduler.start()

