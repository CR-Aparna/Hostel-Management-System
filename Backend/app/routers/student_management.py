from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database import SessionLocal
from app.models.users import User
from app.models.student_details import Student
from app.models.student_address import StudentAddress
from app.helpers.validation_schemas import StudentRegister, StudentUpdate, StudentProfileResponse
from datetime import date
from app.models.vacate_requests import VacateRequest
from app.helpers.auth_dependencies import get_current_user,get_db

router = APIRouter(prefix="/student-management", tags=["Student Management"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
def register_student(data: StudentRegister, db: Session = Depends(get_db)):

    # 1. Check if username already exists
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    # 2. Create student profile
    student = Student(
        name=data.name,
        email=data.email,
        phone=data.phone,
        department=data.department,
        semester=data.semester,
        status="Inactive",# approval pending
        admission_number = data.admission_number,
        gender = data.gender,
        course = data.course,
        guardian_name = data.guardian_name,
        guardian_phone = data.guardian_phone,
        guardian_relation = data.guardian_relation,
        preferred_room_type = data.preferred_room_type,
        preferred_food_type = data.preferred_food_type,
        caution_deposit = data.caution_deposit
    )
    
    db.add(student)
    db.commit()
    
    address = StudentAddress(
        student_id=student.student_id,
        address=data.address,
        city=data.city,
        state=data.state,
        pincode=data.pincode
    )
    
    db.add(address)
    db.commit()
    db.refresh(student)
    db.refresh(address)

    # 3. Hash password
    hashed_password = pwd_context.hash(data.password)

    # 4. Create user login (disabled)
    user = User(
        username=data.username,
        password=hashed_password,
        role="Student",
        linked_id=student.student_id,
        account_status="Disabled"
    )
    db.add(user)
    db.commit()

    return {
        "message": "Student registered successfully. Awaiting admin approval"
    }
    
@router.get("/admin/pending")
def get_pending_students_admin(db: Session = Depends(get_db)):
    result = []
    pending_students = (
        db.query(Student) 
        .filter(Student.status == "Warden Approved")).all()
    for s in pending_students:
        vacated = db.query(VacateRequest).filter(
            VacateRequest.student_id == s.student_id,
            VacateRequest.status == "Completed"
        ).first()
        if not vacated:
            result.append({
            "student_admission_number": s.admission_number,
            "student_id": s.student_id,
            "name": s.name,
            "email": s.email,
            "department": s.department,
            "semester": s.semester
        })
        

    return result

@router.get("/warden/pending")
def get_pending_students_warden(db: Session = Depends(get_db)):
    '''result = []
    pending_students = db.query(Student).filter(Student.status == "Inactive").all()
    for s in pending_students:
        vacated = db.query(VacateRequest).filter(
            VacateRequest.student_id == s.student_id,
            VacateRequest.status == "Completed"
        ).first()
        if vacated:
            continue
        result.append({
        "student_admission_number": s.admission_number,
        "student_id": s.student_id,
        "name": s.name,
        "email": s.email,
        "department": s.department,
        "semester": s.semester
        })
    return result'''
    vacated_students = db.query(VacateRequest.student_id).filter(
        VacateRequest.status == "Completed"
    )

    pending_students = db.query(Student).filter(
        Student.status == "Inactive",
        ~Student.student_id.in_(vacated_students)
    ).all()

    result = [
        {
            "student_admission_number": s.admission_number,
            "student_id": s.student_id,
            "name": s.name,
            "email": s.email,
            "department": s.department,
            "semester": s.semester
        }
        for s in pending_students
    ]

    return result

@router.put("/admin/{student_id}/approve")
def approve_student_admin(student_id: int, db: Session = Depends(get_db)):
    # 1. Get student
    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 2. Get user (linked via username or user_id)
    user = db.query(User).filter(
        User.linked_id == student.student_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=500,
            detail="User record missing for student"
        )

    # 3. Update statuses
    student.status = "Active"
    student.date_of_joining = date.today()
    user.account_status = "Active"

    # 4. Commit
    db.commit()

    return {
        "message": "Student approved successfully",
        "student_id": student_id,
        "date_of_joining": student.date_of_joining
    }
    
@router.put("/warden/{student_id}/approve")
def approve_student_warden(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 2. Get user (linked via username or user_id)
    user = db.query(User).filter(
        User.linked_id == student.student_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=500,
            detail="User record missing for student"
        )

    # 3. Update statuses
    if student.caution_deposit == "paid" or student.caution_deposit == "partially paid":
        student.status = "Warden Approved"
        student.date_of_joining = date.today()
        user.account_status = "Warden Approved"

    # 4. Commit
        db.commit()

        return {
            "message": "Student approved successfully",
            "student_id": student_id,
            "date_of_joining": student.date_of_joining
        }
    else:
        raise HTTPException(status_code=400, detail="Caution deposit not paid")
    
    

@router.get(
    "/me",
    response_model=StudentProfileResponse
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "Student":
        raise HTTPException(status_code=403, detail="Not authorized")

    student = db.query(Student).filter(
        Student.student_id == current_user.linked_id
    ).first()
    
    address = db.query(StudentAddress).filter(
        StudentAddress.student_id == current_user.linked_id
    ).first()
    
    

    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    return student


@router.put("/me")
def update_my_profile(
    payload: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "Student":
        raise HTTPException(status_code=403, detail="Not authorized")

    student = db.query(Student).filter(
        Student.student_id == current_user.linked_id
    ).first()
    
    address = db.query(StudentAddress).filter(
        StudentAddress.student_id == current_user.linked_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
    if not address:
        raise HTTPException(status_code=404, detail="Address record not found")

    student.phone = payload.phone
    student.email = payload.email
    student.guardian_phone = payload.guardian_phone
    address.address = payload.address
    address.city = payload.city
    address.state = payload.state
    address.pincode = payload.pincode

    db.commit()

    return {"message": "Profile updated successfully"}


@router.get(
    "/{student_id}",
    response_model=StudentProfileResponse
)
def get_student_profile(
    student_id: int,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()
    
    address=db.query(StudentAddress).filter(
        StudentAddress.student_id == student_id
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if not address:
        raise HTTPException(status_code=404, detail="Address record not found")

    return student


