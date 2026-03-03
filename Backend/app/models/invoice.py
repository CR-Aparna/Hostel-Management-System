from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_details.student_id"))

    month = Column(Integer)
    year = Column(Integer)
    due_date = Column(DateTime)

    total_amount = Column(Float)
    status = Column(String(15), default="unpaid")  # unpaid / paid

    created_at = Column(DateTime, server_default=func.now())