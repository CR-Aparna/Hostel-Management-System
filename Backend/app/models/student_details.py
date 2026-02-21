from sqlalchemy import Column, Integer, String, Enum, Date
from app.database import Base
from sqlalchemy.orm import relationship


class Student(Base):
    __tablename__ = "student_details"

    student_id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)

    department = Column(String(50), nullable=False)
    semester = Column(Integer, nullable=False)

    date_of_joining = Column(Date, nullable=True)

    status = Column(
        Enum("Active", "Inactive", name="student_status_enum"),
        default="Inactive",
        nullable=False
    )
    
    admission_number = Column(String(20), nullable=False)
    gender = Column(String(50), nullable=True)
    course = Column(String(50), nullable=True)
    guardian_name = Column(String(100), nullable=True)
    guardian_phone = Column(String(15), nullable=True)
    guardian_relation = Column(String(50), nullable=True)  
    preferred_room_type = Column(String(50), nullable=True)
    
    addresses = relationship("StudentAddress", back_populates="student")
    room_allocations = relationship("RoomAllocation", back_populates="student")

