from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean,Text
from app.database import Base
from datetime import datetime


# models.py
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_details.student_id"))
    title = Column(String(100)) # e.g., "Room Change Approved"
    message = Column(Text)       # e.g., "Move to Room 302 by Friday."
    type = Column(String(20))    # e.g., "room_change", "vacate", "payment"
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now())