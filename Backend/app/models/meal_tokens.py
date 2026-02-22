from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.sql.sqltypes import Date
from sqlalchemy.orm import relationship
from app.database import Base

class MealToken(Base):
    __tablename__ = "meal_tokens"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("student_details.student_id"))
    date = Column(Date)

    meal_type = Column(String(20))  # breakfast / lunch / dinner
    token_code = Column(String(100), unique=True)

    is_used = Column(Boolean, default=False)
