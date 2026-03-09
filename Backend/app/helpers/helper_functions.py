from app.models.invoice_item import InvoiceItem
from app.models.notifications import Notification
from sqlalchemy.orm import Session
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