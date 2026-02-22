from sqlalchemy import Column, String, Integer
from app.database import Base

class WeeklyMealPlan(Base):
    __tablename__ = "weekly_meal_plans"

    meal_id = Column(Integer, primary_key=True)

    day_of_the_week = Column(String(10))  # Monday, Tuesday, etc.

    breakfast = Column(String(255))
    lunch = Column(String(255))
    dinner = Column(String(255))
