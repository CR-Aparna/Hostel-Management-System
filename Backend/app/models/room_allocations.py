from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum  
from sqlalchemy.orm import relationship 
from app.database import Base

class RoomAllocation(Base):
    __tablename__ = "room_allocations"
    allocation_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_details.student_id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.room_id"), nullable=False)
    allocated_date = Column(Date, nullable=False)
    vacated_date = Column(Date, nullable=True)
    status = Column(Enum(
        "Active","Inactive",name="room_allocation_status_enum"), default="Active", nullable=False
    )
    
    student = relationship("Student", back_populates="room_allocations")
    room = relationship("Room", back_populates="room_allocations")
    