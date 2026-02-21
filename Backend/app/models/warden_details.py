from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class Warden(Base):
    __tablename__ = "warden_details"
    
    warden_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    date_of_joining = Column(Date, nullable=True)
    status = Column(
        Enum("Active", "Inactive", name="warden_status_enum"),
        default="Active",
        nullable=False
    )
    gender = Column(String(50), nullable=True)
    
    