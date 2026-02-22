from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func,Integer
from app.database import SessionLocal
from datetime import date, time,datetime,timedelta
from app.models.weekly_meal_plans import WeeklyMealPlan
from app.models.student_meals import StudentMeal
from app.models.meal_tokens import MealToken
from app.models.users import User
from app.helpers.validation_schemas import WeeklyMealPlanCreate, MealPreferenceCreate
from app.helpers.auth_dependencies import get_db,get_current_user
import uuid

router = APIRouter(prefix="/meal-management", tags=["Meal Management"])


@router.post("/weekly-meal-plan")
def create_or_update_plan(data: WeeklyMealPlanCreate, db: Session = Depends(get_db)):

    existing = db.query(WeeklyMealPlan).filter(
        WeeklyMealPlan.day_of_the_week == data.day_of_the_week
    ).first()

    if existing:
        existing.breakfast = data.breakfast
        existing.lunch = data.lunch
        existing.dinner = data.dinner
    else:
        new_plan = WeeklyMealPlan(**data.dict())
        db.add(new_plan)

    db.commit()

    return {"message": "Weekly meal plan updated"}

@router.get("/meal-plan/week")
def get_weekly_meal_plan(db: Session = Depends(get_db)):

    plans = db.query(WeeklyMealPlan).order_by(WeeklyMealPlan.day_of_the_week).all()

    return [
        {
            "id": plan.meal_id,
            "day": plan.day_of_the_week,
            "breakfast": plan.breakfast,
            "lunch": plan.lunch,
            "dinner": plan.dinner
        }
        for plan in plans
    ]

@router.get("/meal/count/{date}")
def get_daily_meal_count(date: date, db: Session = Depends(get_db)):

    results = db.query(
        func.sum(StudentMeal.breakfast.cast(Integer)),
        func.sum(StudentMeal.lunch.cast(Integer)),
        func.sum(StudentMeal.dinner.cast(Integer))
    ).filter(
        StudentMeal.date == date
    ).first()

    return {
        "date": date,
        "breakfast": results[0] or 0,
        "lunch": results[1] or 0,
        "dinner": results[2] or 0
    }


@router.get("/meal-plan/{date}")
def get_meal_plan(date: date, db: Session = Depends(get_db)):

    day = date.strftime("%A")

    plan = db.query(WeeklyMealPlan).filter(
        WeeklyMealPlan.day_of_the_week == day
    ).first()

    if not plan:
        raise HTTPException(404, "Meal plan not found")

    return plan

@router.post("/meal-preference")
def set_meal_preference(data: MealPreferenceCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    if datetime.now().time() > time(21, 0):
        raise HTTPException(400, "Time exceeded")
    
    else:
        existing = db.query(StudentMeal).filter(
            StudentMeal.student_id == current_user.linked_id,
            StudentMeal.date == data.date
        ).first()

        if existing:
            existing.breakfast = data.breakfast
            existing.lunch = data.lunch
            existing.dinner = data.dinner
        else:
            new_pref = StudentMeal(**data.dict())
            db.add(new_pref)

        db.commit()

        return {"message": "Preference saved"}

@router.get("/meal-preferences/{target_date}")
def get_meal_preferences(target_date: date, db: Session = Depends(get_db)):
    # Query all preferences matching the provided date
    preferences = db.query(StudentMeal).filter(
        StudentMeal.date == target_date
    ).all()

    # If no data is found, you can return an empty list or an error
    if not preferences:
        return []

    return preferences

@router.post("/generate-tokens/{date}")
def generate_tokens(date: date, db: Session = Depends(get_db)):
    
    tokens_created=False

    preferences = db.query(StudentMeal).filter(StudentMeal.date == date).all()
    
    for pref in preferences:

        if pref.breakfast:
            existing = db.query(MealToken).filter(
                MealToken.student_id == pref.student_id,
                MealToken.date == date,
                MealToken.meal_type == "breakfast"
                ).first()
            if not existing:
                db.add(MealToken(
                    student_id=pref.student_id,
                    date=date,
                    meal_type="breakfast",
                    token_code=str(uuid.uuid4())
                ))
                tokens_created=True

        if pref.lunch:
            existing = db.query(MealToken).filter(
                MealToken.student_id == pref.student_id,
                MealToken.date == date,
                MealToken.meal_type == "lunch"
                ).first()
            if not existing:
                db.add(MealToken(
                    student_id=pref.student_id,
                    date=date,
                    meal_type="lunch",
                    token_code=str(uuid.uuid4())
                ))
                tokens_created=True

        if pref.dinner:
            existing = db.query(MealToken).filter(
                MealToken.student_id == pref.student_id,
                MealToken.date == date,
                MealToken.meal_type == "dinner"
                ).first()
            if not existing:
                db.add(MealToken(
                    student_id=pref.student_id,
                    date=date,
                    meal_type="dinner",
                    token_code=str(uuid.uuid4())
                ))
                tokens_created=True
    
    if tokens_created:
        db.commit()
        return {"message": "Tokens generated"}
    
    else:
        return {"message": "Tokens already exists for this day"}

@router.get("/my-tokens/{date}")
def get_tokens( date: date, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    tokens = db.query(MealToken).filter(
        MealToken.student_id == current_user.linked_id,
        MealToken.date == date
    ).all()

    return tokens
@router.post("/verify-token/{token_code}")
def verify_token(token_code: str, db: Session = Depends(get_db)):
    token_unused = False
    token = db.query(MealToken).filter(
        MealToken.token_code == token_code
    ).first()

    if not token:
        raise HTTPException(404, "Invalid token")

    if token.is_used:
        raise HTTPException(400, "Token already used")
    else:
        token.is_used = True
        token_unused = True
    db.commit()

    return {
        "message": "Meal allowed",
        "student_id":token.student_id,
        "meal_type": token.meal_type,
        "date": token.date,
        "status":"unused" if token_unused else "Used"
        }

@router.get("/meal-summary")
def weekly_summary(db: Session = Depends(get_db)):

    start_date = date.today() - timedelta(days=7)   # ✅ ADD HERE

    results = db.query(
        StudentMeal.date,
        func.sum(StudentMeal.breakfast).label("breakfast_count"),
        func.sum(StudentMeal.lunch).label("lunch_count"),
        func.sum(StudentMeal.dinner).label("dinner_count")
    ).filter(
        StudentMeal.date >= start_date   # ✅ ADD HERE
    ).group_by(
        StudentMeal.date
    ).all()

    return [
        {
            "date": r.date,
            "breakfast": int(r.breakfast_count or 0),
            "lunch": int(r.lunch_count or 0),
            "dinner": int(r.dinner_count or 0)
        }
        for r in results
    ]
    
def generate_tokens_for_date(target_date, db):

    preferences = db.query(StudentMeal).filter(
        StudentMeal.date == target_date
    ).all()

    for pref in preferences:

        if pref.breakfast:
            existing = db.query(MealToken).filter(
                MealToken.student_id == pref.student_id,
                MealToken.date == target_date,
                MealToken.meal_type == "breakfast"
                ).first()
            if not existing:
                db.add(MealToken(
                    student_id=pref.student_id,
                    date=target_date,
                    meal_type="breakfast",
                    token_code=str(uuid.uuid4())
                ))

        if pref.lunch:
            existing = db.query(MealToken).filter(
                MealToken.student_id == pref.student_id,
                MealToken.date == target_date,
                MealToken.meal_type == "lunch"
                ).first()
            if not existing:
                db.add(MealToken(
                    student_id=pref.student_id,
                    date=target_date,
                    meal_type="lunch",
                    token_code=str(uuid.uuid4())
                ))

        if pref.dinner:
            existing = db.query(MealToken).filter(
                MealToken.student_id == pref.student_id,
                MealToken.date == target_date,
                MealToken.meal_type == "dinner"
                ).first()
            if not existing:
                db.add(MealToken(
                    student_id=pref.student_id,
                    date=target_date,
                    meal_type="dinner",
                    token_code=str(uuid.uuid4())
                ))

    db.commit()
