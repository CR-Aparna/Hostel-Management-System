from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime,date
from app.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_details.student_id"), nullable=False)
    date = Column(Date, default=date.today(), index=True)
    # Statuses: "Present", "Absent", "On Leave", "Pending"
    status = Column(String(25), default="Pending")
    updated_at = Column(DateTime, auto_now=True)

    # Ensure one record per student per day
    __table_args__ = (UniqueConstraint('student_id', 'date', name='_student_date_uc'),)

    student = relationship("Student", back_populates="attendance_records")