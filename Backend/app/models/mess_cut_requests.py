from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class MessCutRequest(Base):
    __tablename__ = "mess_cut_requests"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("student_details.student_id"))

    from_date = Column(DateTime)
    to_date = Column(DateTime)

    reason = Column(String(200))

    status = Column(String(25), default="pending")  
    # pending / approved / rejected

    created_at = Column(DateTime, server_default=func.now())