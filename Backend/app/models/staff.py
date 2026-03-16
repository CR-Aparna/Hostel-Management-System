from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Staff(Base):
    __tablename__ = "staff"
    staff_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    category = Column(String(50), nullable=False) #Plumber,Electrician, Maintenance Technician
    status = Column(String(15), default="Active", nullable=False)
