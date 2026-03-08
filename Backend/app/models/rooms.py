from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Numeric
from sqlalchemy.orm import relationship
from app.database import Base  # your Base import   

class Room(Base):
    __tablename__ = "rooms"
    room_number = Column(Integer, primary_key=True, index=True)
    floor = Column(Integer, nullable=False)
    capacity = Column(Integer, nullable=False)
    room_type = Column(String(25),nullable=False)
    status = Column(String(15), nullable=False)
    rent = Column(Numeric(6,2), nullable=True)
    
    room_allocations = relationship("RoomAllocation",back_populates="room")
