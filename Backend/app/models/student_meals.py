from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Date, Boolean
from app.database import Base

class StudentMeal(Base):
    __tablename__ = "student_meals"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("student_details.student_id"))
    date = Column(Date, nullable=False)

    breakfast = Column(Boolean, default=True)
    lunch = Column(Boolean, default=True)
    dinner = Column(Boolean, default=True)

    __table_args__ = (
        UniqueConstraint("student_id", "date"),
    )
