from app.models.invoice_item import InvoiceItem
from app.models.notifications import Notification
from sqlalchemy.orm import Session
import smtplib
from fastapi import HTTPException,Depends
from email.message import EmailMessage
from dotenv import load_dotenv
import os
from app.helpers.auth_dependencies import get_db,get_current_user    

def add_invoice_item(db, invoice_id, type, description, amount):
    item = InvoiceItem(
        invoice_id=invoice_id,
        type=type,
        description=description,
        amount=amount
    )
    db.add(item)
def create_notification(db: Session, student_id: str, title: str, message: str, type: str):
    notification = Notification(
        student_id=student_id,
        title=title,
        message=message,
        type=type
    )
    db.add(notification)
    db.commit()
    
def send_reset_email(target_email: str, reset_link: str):
    # 1. Console Print (Keep your current feature)
    print(f"\n[CONSOLE DEBUG] Reset Link for {target_email}: {reset_link}\n")

    # 2. Email Sending Logic
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password = os.getenv("EMAIL_PASSWORD") # Not your login password!

    msg = EmailMessage()
    msg.set_content(f"You requested a password reset. Click the link below to reset your password:\n\n{reset_link}\n\nIf you did not request this, ignore this email.")
    msg['Subject'] = "Password Reset Request"
    msg['From'] = sender_email
    msg['To'] = target_email

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")
        
def send_general_email(to_email, subject, content):
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password = os.getenv("EMAIL_PASSWORD")

    msg = EmailMessage()
    msg.set_content(content)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = to_email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(sender_email, sender_password)
        smtp.send_message(msg)
    
    # Also log to console for debugging
    print(f"📧 Email sent to {to_email}: {subject}")
    
def require_management(current_user = Depends(get_current_user)):
    if current_user.role not in ["Warden", "Admin"]:
        raise HTTPException(status_code=403, detail="Access denied. Management only.")
    return current_user

