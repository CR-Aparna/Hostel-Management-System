from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, DateTime
from app.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship

class Maintenance(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("student_details.student_id"))
    category = Column(String(50)) # Plumbing, Electrical, etc.
    room_number = Column(String(10))
    description = Column(Text)
    
    # Workflow fields
    status = Column(String(20), default="Pending") 
    assigned_staff = Column(Integer, ForeignKey("staff.staff_id"), nullable=True)
    is_emergency = Column(Boolean, default=False)
    
    warden_approved = Column(Boolean, default=False)
    admin_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now())
    warden_remarks = Column(String(250), nullable=True)
    admin_remarks = Column(String(250), nullable=True)
    
    student = relationship("Student", back_populates="maintenance_requests")