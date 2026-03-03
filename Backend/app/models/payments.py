from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    
    invoice_id = Column(Integer, ForeignKey("invoices.id"))

    amount = Column(Float)

    order_id = Column(String(250),unique=True,index=True)
    transaction_id = Column(String(250),nullable=True)
    payment_method = Column(String(50),nullable=True)

    status = Column(String(25), default="created")  # created /success / failed

    created_at = Column(DateTime, server_default=func.now())