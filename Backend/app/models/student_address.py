from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base  # your Base import


class StudentAddress(Base):
    __tablename__ = "student_address"

    address_id = Column(Integer, primary_key=True, index=True)
    
    student_id = Column(
        Integer,
        ForeignKey("student_details.student_id"),
        nullable=False
    )

    address = Column(String(250), nullable=False)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(Integer)

    # Relationship (optional but recommended)
    student = relationship("Student", back_populates="addresses")
