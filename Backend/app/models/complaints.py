from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from app.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("student_details.student_id"), nullable=True)
    
    # Specific categories for social issues
    issue_type = Column(String(50)) # Mess, Ragging, Noise, Security
    subject = Column(String(100))
    description = Column(Text)
    
    # Resolution fields
    status = Column(String(20), default="Open") # Open, Under Investigation, Resolved
    action_taken = Column(Text) # What the Warden did to fix it
    resolved_by = Column(String(50)) # Name of Warden/Admin
    created_at = Column(DateTime, default=datetime.now())
    
    student=relationship("Student", back_populates="complaints")