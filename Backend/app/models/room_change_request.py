from sqlalchemy import Column, Integer, String, ForeignKey, Date,Enum
from app.database import Base

class RoomChangeRequest(Base):
    __tablename__ = "room_change_requests"

    request_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_details.student_id"))
    
    current_room_number = Column(Integer, ForeignKey("rooms.room_number"))
    requested_room_type = Column(String(50), nullable=True)
    requested_room_number = Column(Integer, ForeignKey("rooms.room_number"), nullable=True)

    reason = Column(String(255), nullable=True)

    status = Column(Enum(
        "Pending", "Approved", "Rejected",
        name="room_change_status_enum"
    ), default="Pending")

    request_date = Column(Date)
    decision_date = Column(Date, nullable=True)
