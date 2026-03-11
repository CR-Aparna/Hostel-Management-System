from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.sql.sqltypes import Date
from sqlalchemy.orm import relationship
from app.database import Base

'''class MealToken(Base):
    __tablename__ = "meal_tokens"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("student_details.student_id"))
    date = Column(Date)

    meal_type = Column(String(20))  # breakfast / lunch / dinner
    token_code = Column(String(100), unique=True)

    is_used = Column(Boolean, default=False)'''
    
# models.py
import random
import string
from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime
from datetime import datetime

class MealToken(Base):
    __tablename__ = "meal_tokens"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, index=True)
    date = Column(Date, nullable=False)
    meal_time = Column(String(20)) # 'Breakfast', 'Lunch', 'Dinner'
    meal_type = Column(String(10)) # 'Veg', 'Non-Veg'
    short_pin = Column(String(6), unique=True, index=True) # 6-digit PIN
    is_consumed = Column(Boolean, default=False)
    consumed_at = Column(DateTime, nullable=True)

    @staticmethod
    def generate_pin():
        return ''.join(random.choices(string.digits, k=6))
