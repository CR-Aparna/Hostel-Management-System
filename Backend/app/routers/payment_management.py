from fastapi import APIRouter, Depends, HTTPException,Response
from sqlalchemy.orm import Session
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem  
from app.models.student_details import Student
from app.models.rooms import Room 
from app.models.payments import Payment
from app.models.room_allocations import RoomAllocation 
from app.models.mess_cut_requests import MessCutRequest   
from datetime import datetime, timedelta,date
from app.helpers.auth_dependencies import get_db,get_current_user
from app.helpers.helper_functions import add_invoice_item
from app.models.users import User
import uuid
from app.helpers.validation_schemas import PaymentVerifyRequest
from calendar import monthrange
from fpdf import FPDF
from typing import Tuple



router = APIRouter(prefix="/payment-management", tags=["Payment Management"])

def create_order_for_invoice(invoice, db: Session):
    # Prevent duplicate order
    existing = db.query(Payment).filter(
        Payment.invoice_id == invoice.id
    ).first()

    if existing:
        return existing

    order_id = f"ORD_{uuid.uuid4().hex[:10]}"

    payment = Payment(
        invoice_id=invoice.id,
        order_id=order_id,
        amount=invoice.total_amount,
        status="created"
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment

'''def generate_invoice_for_student(student_id: int, db: Session):
    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()

    if not student or student.status != "Active":
        return None

    room = db.query(RoomAllocation).filter(
        RoomAllocation.student_id == student_id,
        RoomAllocation.status == "Active"
    ).first()

    if not room:
        return None

    room_rent = db.query(Room).filter(
        Room.room_number == room.room_number
    ).first()

    now = datetime.now()
    month = now.month

    # Mess fee
    mess_fee = 100 if student.preferred_food_type == "vegetarian" else 150

    # Days in month
    if month in [1,3,5,7,8,10,12]:
        days = 31
    elif month in [4,6,9,11]:
        days = 30
    else:
        days = 28

    monthly_rent = room_rent.rent * days
    monthly_mess_fee = mess_fee * days

    # Mess cut
    mess_cut_request = db.query(MessCutRequest).filter(
        MessCutRequest.student_id == student_id,
        MessCutRequest.status == "Approved"
    ).first()

    mess_cut = 0
    if mess_cut_request:
        days_away = (mess_cut_request.to_date - mess_cut_request.from_date).days + 1
        if days_away > 4:
            mess_cut = days_away * mess_fee

    total = monthly_rent + monthly_mess_fee - mess_cut

    # Prevent duplicate invoice
    existing = db.query(Invoice).filter(
        Invoice.student_id == student_id,
        Invoice.month == now.month,
        Invoice.year == now.year
    ).first()

    if existing:
        return existing

    invoice = Invoice(
        student_id=student_id,
        month=now.month,
        year=now.year,
        total_amount=total,
        status="unpaid",
        due_date=now + timedelta(days=30)
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    
    create_order_for_invoice(invoice, db)

    # Items
    add_invoice_item(db, invoice.id, "rent", "Room Rent", monthly_rent)
    add_invoice_item(db, invoice.id, "mess", "Mess Fee", monthly_mess_fee)

    if mess_cut > 0:
        add_invoice_item(db, invoice.id, "discount", "Mess Cut", -mess_cut)

    db.commit()

    return invoice'''
    

def generate_invoice_for_student(student_id: int, db: Session, is_vacating: bool = False) -> Tuple[Invoice, bool] | Tuple[None, bool]:
    student = db.query(Student).filter(Student.student_id == student_id).first()

    # If vacating, we ignore the "Active" status check because they are about to be 'Inactive'
    if not student or (not is_vacating and student.status != "Active"):
        return None, False

    # ... (Keep your Room and RoomAllocation queries here) ...

    now = datetime.now()
    
    # CALCULATE BILLABLE DAYS
    if is_vacating:
        # If vacating on the 12th, bill for 12 days
        billable_days = now.day
    else:
        # Get total days in the current month (e.g., 28, 30, or 31)
        billable_days = monthrange(now.year, now.month)[1]

    # Mess fee logic
    daily_mess_rate = 100 if student.preferred_food_type == "vegetarian" else 150
    
    # Pro-rated Rent (Assuming room_rent.rent is a DAILY rate based on your code)
    # If room_rent.rent is a MONTHLY rate, use: (room_rent.rent / total_days_in_month) * billable_days
    room = db.query(RoomAllocation).filter(
        RoomAllocation.student_id == student_id,
        RoomAllocation.status == "Active"
    ).first()

    if not room:
        return None, False
    
    room_rent = db.query(Room).filter(
        Room.room_number == room.room_number
    ).first()
    
    monthly_rent = room_rent.rent * billable_days
    monthly_mess_fee = daily_mess_rate * billable_days

    # ... (Keep your Mess Cut logic here) ...
    mess_cut_request = db.query(MessCutRequest).filter(
        MessCutRequest.student_id == student_id,
        MessCutRequest.status == "Approved"
    ).first()

    mess_cut = 0
    if mess_cut_request:
        days_away = (mess_cut_request.to_date - mess_cut_request.from_date).days + 1
        if days_away > 4:
            mess_cut = days_away * daily_mess_rate
    

    total = monthly_rent + monthly_mess_fee - mess_cut

    # Prevent duplicate check remains the same
    existing = db.query(Invoice).filter(
        Invoice.student_id == student_id,
        Invoice.month == now.month,
        Invoice.year == now.year
    ).first()

    if existing:
        if is_vacating and existing.status == "unpaid":
            # OPTION: Delete the old one so we can create a fresh pro-rated one
            # This ensures all InvoiceItems are also refreshed.
            db.query(InvoiceItem).filter(InvoiceItem.invoice_id == existing.id).delete()
            db.query(Payment).filter(Payment.invoice_id == existing.id).delete()
            db.delete(existing)
            db.commit()
        else:
            # If they already paid, or if it's a standard run, don't double bill
            return existing, True

    # Create Invoice and Items
    invoice = Invoice(
        student_id=student_id,
        month=now.month,
        year=now.year,
        total_amount=total,
        status="unpaid",
        due_date=now + timedelta(days=7) # Shorter due date for vacating students
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    
    create_order_for_invoice(invoice, db)

    # Items
    add_invoice_item(db, invoice.id, "rent", f"Room Rent ({billable_days} days)", monthly_rent)
    
    add_invoice_item(db, invoice.id, "mess", f"Mess Fee ({billable_days} days)", monthly_mess_fee)

    if mess_cut > 0:
        add_invoice_item(db, invoice.id, "discount", "Mess Cut", -mess_cut)
    # Add items with descriptions indicating the pro-rated days
    
    db.commit()
    return invoice, False

@router.post("/generate-invoice/{student_id}")
def generate_invoice(student_id: int, db: Session = Depends(get_db)):
    
    invoice, is_existing = generate_invoice_for_student(student_id, db)

    if not invoice:
        raise HTTPException(status_code=400, detail="Invoice not generated")
    
    return {
        "message": "Invoice generated" if not is_existing else "Invoice already exists",
        "invoice_status": is_existing,
        "invoice_id": invoice.id
    }


@router.post("/create-order/{invoice_id}")
def create_order(invoice_id: int, db: Session = Depends(get_db)):

    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()

    if not invoice:
        return {"error": "Invoice not found"}

    order_id = f"ORD_{uuid.uuid4().hex[:10]}"

    payment = Payment(
        invoice_id=invoice.id,
        order_id=order_id,
        amount=invoice.total_amount,
        status="created"
    )

    db.add(payment)
    db.commit()

    return {
        "order_id": order_id,
        "amount": invoice.total_amount
    }
    
@router.post("/verify")
def verify_payment(data: PaymentVerifyRequest, db: Session = Depends(get_db),current_user: User = Depends(get_current_user) ):
    
    student_invoice = db.query(Invoice).filter(
        Invoice.student_id == current_user.linked_id,
        Invoice.status.in_(["unpaid", "overdue"])
    ).first()
    
    if not student_invoice:
        return {"error": "Invoice not found"}
    
    payment_order = db.query(Payment).filter(
        Payment.invoice_id == student_invoice.id
    ).first()
    
    if not payment_order:
        return {"error": "Payment order not found"}

    order_id = payment_order.order_id
    status = data.status
    method = data.method

    payment = db.query(Payment).filter(Payment.order_id == order_id).first()

    if not payment:
        return {"error": "Payment not found"}

    if status == "success":
        payment.status = "success"
        payment.transaction_id = f"TXN_{uuid.uuid4().hex[:10]}"
        
        # ✅ mark invoice paid
        invoice = db.query(Invoice).filter(Invoice.id == payment.invoice_id).first()
        invoice.status = "paid"

    else:
        payment.status = "failed"

    payment.payment_method = method
    payment.payment_date = datetime.now().date()

    db.commit()

    return {"message": "Payment updated"}

@router.get("/current-payment/{invoice_id}")
def get_current_payment(
    invoice_id:int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
#    invoice = db.query(Invoice).filter(
#        Invoice.student_id == current_user.linked_id,
#        Invoice.id == invoice_id
#    ).first()
#
#    if not invoice:
#        return {"error": "No unpaid invoice"}

    payment = db.query(Payment).filter(
        Payment.invoice_id == invoice_id,
        
    ).first()

    if not payment:
        return {"error": "No payment found"}

    return {
        "order_id": payment.order_id,
        "amount": payment.amount,
        "status": payment.status
    }
    
@router.get("/payment-history")
def get_payment_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payments = db.query(Payment).join(Invoice).filter(
    Invoice.student_id == current_user.linked_id,
    Invoice.status=="paid"
    ).all()

    return payments

@router.get("/payment-history/{student_id}")
def get_payment_history_by_student_id(
    student_id: int,
    db: Session = Depends(get_db)
):
    payments = db.query(Payment).join(Invoice).filter(
    Invoice.student_id == student_id,
    ).all()

    return payments

@router.get("/all-pending-invoices")
def get_all_pending_invoices(db: Session = Depends(get_db)):
    invoices = db.query(Invoice).filter(Invoice.status.in_(["unpaid", "overdue"])).all()
    
    result=[]
    
    for invoice in invoices:
        student=db.query(Student).filter(Student.student_id == invoice.student_id).first()
        
        result.append({
         "id": invoice.id,
         "student_admission_number": student.admission_number,
         "student_name": student.name,
         "month": invoice.month,
         "year": invoice.year,
         "status": invoice.status,
         "created_at": invoice.created_at,
         "due_date": invoice.due_date,
         "total_amount": invoice.total_amount
     })
    return result

@router.get("/student/invoices")
def get_student_invoices(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    invoices = db.query(Invoice).filter(Invoice.student_id == current_user.linked_id,
                                        Invoice.status.in_(["unpaid","overdue"])
                                    ).all()

    result = []
    for inv in invoices:
#        fee_types={}
#        invoice_items=db.query(InvoiceItem).filter(InvoiceItem.invoice_id == inv.id).all()
#        fee_types.append({item.type: item.amount for item in invoice_items} )
        result.append({
            "id": inv.id,
            "created_date": inv.created_at,
            "amount": inv.total_amount,
            "due_date": inv.due_date,
            "status": inv.status,
            "is_overdue": inv.due_date < datetime.now() and inv.status == "overdue"
        })

    return result

@router.get("/invoice-items/{invoice_id}")
def get_invoice_description(invoice_id: int, db: Session = Depends(get_db)):
    return db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).all()


@router.get("/download-receipt/{invoice_id}")
def download_receipt(invoice_id: int, db: Session = Depends(get_db)):
    # 1. Fetch the main Invoice
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(404, "Invoice not found")
    
    # 2. Fetch the items from the "other" table (InvoiceItem)
    items = db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).all()

    # 3. Create PDF
    pdf = FPDF()
    pdf.add_page()
    
    # Header
    pdf.set_font("Arial", "B", 18)
    pdf.cell(0, 15, "HOSTEL FEE RECEIPT", ln=True, align="C")
    pdf.ln(5)

    # Student & Invoice Info
    pdf.set_font("Arial", size=11)
    pdf.cell(0, 8, f"Invoice ID: {invoice.id}", ln=True)
    pdf.cell(0, 8, f"Billing Period: {invoice.month}/{invoice.year}", ln=True)
    pdf.cell(0, 8, f"Payment Status: {invoice.status.upper()}", ln=True)
    pdf.ln(5)

    # Table Header for Items
    pdf.set_font("Arial", "B", 11)
    pdf.cell(130, 10, "Description", border=1)
    pdf.cell(60, 10, "Amount", border=1, ln=True)

    # Table Rows (The items from your other table)
    pdf.set_font("Arial", size=11)
    for item in items:
        # Using item.description and item.amount from the InvoiceItem table
        pdf.cell(130, 10, f" {item.description}", border=1)
        pdf.cell(60, 10, f" {item.amount}", border=1, ln=True)

    # Total Row
    pdf.ln(2)
    pdf.set_font("Arial", "B", 12)
    pdf.cell(130, 10, "GRAND TOTAL", align="R")
    pdf.cell(60, 10, f" {invoice.total_amount}", border=1, ln=True)

    # 4. Return the PDF as a stream
    pdf_output = bytes(pdf.output(dest='S'))
    
    return Response(
        content=pdf_output,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=receipt_{invoice_id}.pdf"
        }
    )   
