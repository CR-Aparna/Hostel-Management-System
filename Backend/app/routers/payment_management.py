from fastapi import APIRouter, Depends, HTTPException
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

def generate_invoice_for_student(student_id: int, db: Session):
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

    return invoice

@router.post("/generate-invoice/{student_id}")
def generate_invoice(student_id: int, db: Session = Depends(get_db)):
    '''student=db.query(Student).filter(
        Student.student_id==student_id
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if student.status!="Active":
        raise HTTPException(status_code=400, detail="Student is not active")
    
    
    room = db.query(RoomAllocation).filter(
        RoomAllocation.student_id==student_id,
        RoomAllocation.status=="Active"
        ).first()
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.status!="Active":
        raise HTTPException(status_code=400, detail="Room is not active")
    
    room_rent = db.query(Room).filter(
        Room.room_number==room.room_number
    ).first()
    
    month=datetime.now().month
    
    food_type=student.preferred_food_type
    
    if food_type=="vegetarian":
        mess_fee=100
    else:
        mess_fee=150
    
    rent = room_rent.rent
    if month in [1,3,5,7,8,10,12]:
        monthly_rent = rent * 31
        monthly_mess_fee = mess_fee * 31
    elif month in [4,6,9,11]:
        monthly_rent = rent * 30
        monthly_mess_fee = mess_fee * 30
    else:
        monthly_rent = rent * 28
        monthly_mess_fee = mess_fee * 28
    # Example leave days (replace with actual logic)
    
    mess_cut_request = db.query(MessCutRequest).filter(
        MessCutRequest.student_id == student_id,
        MessCutRequest.status == "Approved"
    ).first() 

    mess_cut = 0
    if mess_cut_request:
        days_away = (mess_cut_request.to_date - mess_cut_request.from_date).days+1  
        if days_away > 4:
            if student.preferred_food_type == "vegetarian":
                mess_cut = days_away * 100  # per day cut
            else:
                mess_cut = days_away * 150

    total = monthly_mess_fee + monthly_rent - mess_cut

    invoice = Invoice(
        student_id=student_id,
        month=datetime.now().month,
        year=datetime.now().year,
        total_amount=total,
        status="unpaid",
        due_date=datetime.now() + timedelta(days=30)
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # Add items
    add_invoice_item(db, invoice.id, "rent", "Room Rent", monthly_rent)
    add_invoice_item(db, invoice.id, "mess", "Mess Fee", monthly_mess_fee)

    if mess_cut > 0:
        add_invoice_item(db, invoice.id, "discount", "Mess Cut", -mess_cut)

    db.commit()

    return {"message": "Invoice generated", "invoice_id": invoice.id}'''
    
    invoice = generate_invoice_for_student(student_id, db)

    if not invoice:
        raise HTTPException(status_code=400, detail="Invoice not generated")

    return {
        "message": "Invoice generated",
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
        Payment.invoice_id == invoice_id
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
    invoices = db.query(Invoice).filter(Invoice.student_id == current_user.linked_id).all()

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

@router.get("/invoice_items/{invoice_id}")
def get_invoice_description(invoice_id: int, db: Session = Depends(get_db)):
    return db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).all()

   
