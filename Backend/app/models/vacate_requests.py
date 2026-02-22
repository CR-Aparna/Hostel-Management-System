from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum
from app.database import Base

class VacateRequest(Base):
    __tablename__ = "vacate_requests"

    request_id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("student_details.student_id"))
    room_number = Column(Integer, ForeignKey("rooms.room_number"))

    reason = Column(String(255), nullable=True)

    status = Column(
        Enum("Pending", "Approved", "Rejected", name="vacate_status_enum"),
        default="Pending"
    )

    request_date = Column(Date)
    decision_date = Column(Date, nullable=True)
