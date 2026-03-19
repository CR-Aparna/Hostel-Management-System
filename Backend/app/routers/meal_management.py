from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func,Integer
from app.database import SessionLocal
from datetime import date, time,datetime,timedelta
from app.models.weekly_meal_plans import WeeklyMealPlan
from app.models.student_meals import StudentMeal
from app.models.meal_tokens import MealToken
from app.models.users import User
from app.models.student_details import Student
from app.models.mess_cut_requests import MessCutRequest
from app.helpers.validation_schemas import WeeklyMealPlanCreate, MealPreferenceCreate,MessCutRequestCreate
from app.helpers.auth_dependencies import get_db,get_current_user
import uuid
import random
import string


router = APIRouter(prefix="/meal-management", tags=["Meal Management"])


@router.post("/weekly-meal-plan")
def create_or_update_plan(data: WeeklyMealPlanCreate, db: Session = Depends(get_db)):

    existing_veg = db.query(WeeklyMealPlan).filter(
        WeeklyMealPlan.day_of_the_week == data.day_of_the_week,
        WeeklyMealPlan.meal_type == data.meal_type
    ).first()
    
    existing_non_veg = db.query(WeeklyMealPlan).filter(
        WeeklyMealPlan.day_of_the_week == data.day_of_the_week,
        WeeklyMealPlan.meal_type == data.meal_type
    ).first()

    if existing_veg:
        existing_veg.breakfast = data.breakfast
        existing_veg.lunch = data.lunch
        existing_veg.dinner = data.dinner
    elif existing_non_veg:
        existing_non_veg.breakfast = data.breakfast
        existing_non_veg.lunch = data.lunch
        existing_non_veg.dinner = data.dinner
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
            "dinner": plan.dinner,
            "meal_type":plan.meal_type
        }
        for plan in plans
    ]

'''@router.get("/meal/count/{date}")
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
    }'''
    
from sqlalchemy import func, Integer, case

@router.get("/meal/count/{date}")
def get_daily_meal_count(date: date, db: Session = Depends(get_db)):
    # We join StudentMeal with Student to access the preferred_food_type column
    results = db.query(
        # Breakfast Counts
        func.sum(case((Student.preferred_food_type == 'vegetarian', StudentMeal.breakfast.cast(Integer)), else_=0)).label("veg_breakfast"),
        func.sum(case((Student.preferred_food_type == 'non-vegetarian', StudentMeal.breakfast.cast(Integer)), else_=0)).label("nonveg_breakfast"),
        
        # Lunch Counts
        func.sum(case((Student.preferred_food_type == 'vegetarian', StudentMeal.lunch.cast(Integer)), else_=0)).label("veg_lunch"),
        func.sum(case((Student.preferred_food_type == 'non-vegetarian', StudentMeal.lunch.cast(Integer)), else_=0)).label("nonveg_lunch"),
        
        # Dinner Counts
        func.sum(case((Student.preferred_food_type == 'vegetarian', StudentMeal.dinner.cast(Integer)), else_=0)).label("veg_dinner"),
        func.sum(case((Student.preferred_food_type == 'non-vegetarian', StudentMeal.dinner.cast(Integer)), else_=0)).label("nonveg_dinner")
        
    ).join(Student, Student.student_id == StudentMeal.student_id)\
     .filter(StudentMeal.date == date).first()

    return {
        "date": date,
        "breakfast": {"veg": results[0] or 0, "non_veg": results[1] or 0, "total": (results[0] or 0) + (results[1] or 0)},
        "lunch": {"veg": results[2] or 0, "non_veg": results[3] or 0, "total": (results[2] or 0) + (results[3] or 0)},
        "dinner": {"veg": results[4] or 0, "non_veg": results[5] or 0, "total": (results[4] or 0) + (results[5] or 0)}
    }


@router.get("/meal-plan")
def get_meal_plan_for_tomorrow( db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    tomorrow = datetime.now().date() + timedelta(days=1)
    tomorrow_day = tomorrow.strftime("%A")
    
    student = db.query(Student).filter(
        Student.student_id==current_user.linked_id
    ).first()

    plan = db.query(WeeklyMealPlan).filter(
        WeeklyMealPlan.day_of_the_week == tomorrow_day,
        WeeklyMealPlan.meal_type == student.preferred_food_type    
    ).first()

    if not plan:
        raise HTTPException(404, "Meal plan not found")

    return plan

'''@router.post("/meal-preference")
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
            new_pref = StudentMeal(
                student_id = current_user.linked_id,
                date = data.date,
                breakfast = data.breakfast,
                lunch = data.lunch,
                dinner = data.dinner
                )
            db.add(new_pref)

        db.commit()

        return {"message": "Preference saved"}'''
        
@router.post("/meal-preference")
def set_meal_preference(
    data: MealPreferenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_time = datetime.now().time()

    # ⛔ Block after 9 PM
    if current_time > time(21, 0):
        raise HTTPException(status_code=400, detail="Time exceeded. Set preference before 9 PM.")

    # ✅ Always set for TOMORROW
    tomorrow = datetime.now().date() + timedelta(days=1)

    existing = db.query(StudentMeal).filter(
        StudentMeal.student_id == current_user.linked_id,
        StudentMeal.date == tomorrow
    ).first()

    if existing:
        existing.breakfast = data.breakfast
        existing.lunch = data.lunch
        existing.dinner = data.dinner
    else:
        new_pref = StudentMeal(
            student_id=current_user.linked_id,
            date=tomorrow,
            breakfast=data.breakfast,
            lunch=data.lunch,
            dinner=data.dinner
        )
        db.add(new_pref)

    db.commit()

    return {
        "message": "Preference saved for tomorrow",
        "date": tomorrow
    }

@router.get("/get/meal-preferences/today")
def get_meal_preferences( db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    # Query all preferences matching the provided date
    today=datetime.now().date()
    preferences = db.query(StudentMeal).filter(
        StudentMeal.student_id == current_user.linked_id,
        StudentMeal.date == today
    ).all()

    # If no data is found, you can return an empty list or an error
    if not preferences:
        return []

    return preferences

@router.get("/get/meal-preferences/tomorrow")
def get_meal_preferences(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    # Query all preferences matching the provided date
    tomorrow = datetime.now().date() + timedelta(days=1)
    preferences = db.query(StudentMeal).filter(
        StudentMeal.student_id == current_user.linked_id,
        StudentMeal.date == tomorrow
    ).all()

    # If no data is found, you can return an empty list or an error
    if not preferences:
        return []

    return preferences

def process_generate_tokens(date, db):
    existing_tokens = db.query(MealToken.student_id, MealToken.meal_time).filter(
        MealToken.date == date
    ).all()
    
    existing_set = set(existing_tokens)
    
    # 1. Get all active students
    students = db.query(Student).filter(Student.status == "Active").all()
    new_tokens_count=0
    
    for student in students:
        # 2. Check if preference exists, if not, create default (All True)
        preference = db.query(StudentMeal).filter(
            StudentMeal.student_id == student.student_id,
            StudentMeal.date == date
        ).first()

        if not preference:
            preference = StudentMeal(
                student_id=student.student_id,
                date=date,
                breakfast=True, lunch=True, dinner=True
            )
            db.add(preference)
            db.flush() # Push to DB so we can query it immediately in the next step

        # 3. Define the meals to check
        meals = ["breakfast", "lunch", "dinner"]
        
        for meal in meals:
            # Check if student opted-in for this specific meal
            is_opted_in = getattr(preference, meal)
            
            if is_opted_in:
                # Check if token already exists
                #existing = db.query(MealToken).filter(
                #    MealToken.student_id == student.student_id,
                #    MealToken.date == date,
                #    MealToken.meal_type == meal
                #).first()
                
                if (student.student_id, meal) not in existing_set:
                    # GENERATE 6-DIGIT PIN INSTEAD OF UUID
                    pin = generate_6_digit_pin()
                    
                    # Optional: Ensure PIN is unique for that date if necessary
                    # While 1 million combinations exist, a quick check is safer
                    db.add(MealToken(
                        student_id=student.student_id,
                        date=date,
                        meal_time=meal,
                        meal_type=student.preferred_food_type,
                        short_pin=pin, # Now a 6-digit string
                        is_consumed=False
                        
                    ))
                    new_tokens_count += 1
                    #tokens_created = True

    if new_tokens_count > 0:
        db.commit()
        return {"message": f"Generated {new_tokens_count} new tokens successfully."}
    return {"message": "All tokens already exist for this day. No new tokens generated."}
        

def generate_6_digit_pin():
    # Generates a random 6-digit string like "482931"
    return ''.join(random.choices(string.digits, k=6))

@router.post("/generate-tokens/{date}")
def generate_tokens(date: date, db: Session = Depends(get_db)):
    return process_generate_tokens(date, db)
        

@router.get("/my-tokens/{date}")
def get_tokens( date: date, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    tokens = db.query(MealToken).filter(
        MealToken.student_id == current_user.linked_id,
        MealToken.date == date
    ).all()

    return tokens
'''@router.post("/verify-token/{token_code}")
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
        }'''

@router.post("/warden/verify/{pin}")
def verify_meal(pin: str, db: Session = Depends(get_db)):
    # Find token for today by PIN
    token = db.query(MealToken).filter(
        MealToken.short_pin == pin,
        MealToken.date == date.today()
    ).first()

    if not token:
        raise HTTPException(404, "Invalid PIN")
    
    if token.is_consumed:
        raise HTTPException(400, "Meal already taken!")
    
    student=db.query(Student).filter(
        Student.student_id==token.student_id
    ).first()
    if not student:
        raise HTTPException(404, "Invalid student")

    token.is_consumed = True
    token.consumed_at = datetime.now()
    db.commit()
    return {"status": "success", 
            "message": f"Verified for {token.meal_time},",
            "student_name": student.name,
            "meal_time": token.meal_time,
            "date": token.date
            }

from datetime import date, timedelta
from sqlalchemy import func, extract

@router.get("/monthly-summary")
def get_monthly_summary(db: Session = Depends(get_db)):
    today = date.today()
    first_day_of_month = today.replace(day=1)

    # 1. TOTAL ACTIVE STUDENTS ONLY
    # We filter by status (assuming 'Active' is your keyword for enrolled students)
    active_students_query = db.query(Student).filter(Student.status == "Active")
    
    total_active = active_students_query.count()
    veg_active = active_students_query.filter(Student.preferred_food_type == 'vegetarian').count()
    nonveg_active = active_students_query.filter(Student.preferred_food_type == 'non-vegetarian').count()

    # 2. TOTAL BOOKINGS (Based on Generated Tokens)
    # If a token exists, it means they didn't opt out. 
    # We count all tokens generated for this month.
    total_tokens_generated = db.query(func.count(MealToken.id)).filter(
        MealToken.date >= first_day_of_month
    ).scalar() or 0

    # Meal Breakdown from Tokens
    b_count = db.query(func.count(MealToken.id)).filter(
        MealToken.date >= first_day_of_month, MealToken.meal_time == "breakfast"
    ).scalar() or 0
    l_count = db.query(func.count(MealToken.id)).filter(
        MealToken.date >= first_day_of_month, MealToken.meal_time == "lunch"
    ).scalar() or 0
    d_count = db.query(func.count(MealToken.id)).filter(
        MealToken.date >= first_day_of_month, MealToken.meal_time == "dinner"
    ).scalar() or 0

    # 3. ACTUAL CONSUMPTION
    # Count only tokens where is_consumed is True
    total_consumed = db.query(func.count(MealToken.id)).filter(
        MealToken.date >= first_day_of_month,
        MealToken.is_consumed == True
    ).scalar() or 0

    # 4. CALCULATION
    wastage = total_tokens_generated - total_consumed
    efficiency = (total_consumed / total_tokens_generated * 100) if total_tokens_generated > 0 else 0

    return {
        "summary_period": today.strftime("%B %Y"),
        "students": {
            "total": total_active,
            "vegetarian": veg_active,
            "non_vegetarian": nonveg_active
        },
        "usage_metrics": {
            "total_meals_opted": total_tokens_generated,
            "total_meals_consumed": total_consumed,
            "wastage_count": wastage,
            "efficiency_rate": f"{efficiency:.2f}%"
        },
        "meal_breakdown": {
            "breakfast": b_count,
            "lunch": l_count,
            "dinner": d_count
        }
    }
    
@router.post("/apply-mess-cut")
def apply_mess_cut(data: MessCutRequestCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    existing = db.query(MessCutRequest).filter(
    MessCutRequest.student_id == current_user.linked_id,
    MessCutRequest.status == "Approved"
    ).all()
    
    if existing:
        raise HTTPException(400, "You already have an approved mess cut request")
    
    if data.from_date > data.to_date:
        raise HTTPException(400, "Invalid date range")

    request = MessCutRequest(
        student_id=current_user.linked_id,
        from_date=data.from_date,
        to_date=data.to_date,
        reason=data.reason
    )

    db.add(request)
    db.commit()

    return {"message": "Mess cut request submitted"}

@router.get("/mess-cut-requests")
def get_all_requests(db: Session = Depends(get_db)):
    return db.query(MessCutRequest).all()


@router.put("/{request_id}/approve")
def approve_mess_cut_request(request_id: int, db: Session = Depends(get_db)):
    req = db.query(MessCutRequest).filter(MessCutRequest.id == request_id).first()

    if not req:
        raise HTTPException(404, "Request not found")

    req.status = "Approved"
    db.commit()

    return {"message": "Approved"}

@router.put("/{request_id}/reject")
def reject_mess_cut_request(request_id: int, db: Session = Depends(get_db)):
    req = db.query(MessCutRequest).filter(MessCutRequest.id == request_id).first()

    if not req:
        raise HTTPException(404, "Request not found")

    req.status = "Rejected"
    db.commit()

    return {"message": "Rejected"}
    
