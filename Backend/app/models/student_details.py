from sqlalchemy import Column, Integer, String, Enum, Date
from app.database import Base

class Student(Base):
    __tablename__ = "student_details"

    student_id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)

    department = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)

    date_of_joining = Column(Date, nullable=True)

    status = Column(
        Enum("Active", "Inactive", name="student_status_enum"),
        default="Inactive",
        nullable=False
    )
