from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship

class Guardian(Base):
    __tablename__ = "guardians"

    guardian_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("student_details.student_id"))

    name = Column(String(100))
    phone = Column(String(15))
    address = Column(String(255))
    relation = Column(String(50))
    type = Column(String(20))  # Primary / Local

    student = relationship("Student", back_populates="guardians")