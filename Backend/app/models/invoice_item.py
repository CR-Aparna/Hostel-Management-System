from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))

    type = Column(String(15))  # rent / mess / discount / fine
    description = Column(String(250))
    amount = Column(Float)  # can be negative (for mess cut)