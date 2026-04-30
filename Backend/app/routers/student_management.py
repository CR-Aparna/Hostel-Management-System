from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy import func, extract
from typing import Optional
from fastapi.responses import Response
from fpdf import FPDF
import calendar

from app.database import SessionLocal
from app.models.users import User
from app.models.student_details import Student
from app.models.student_address import StudentAddress
from app.helpers.validation_schemas import StudentRegister, StudentUpdate, StudentProfileResponse
from datetime import datetime,date
from app.models.vacate_requests import VacateRequest
from app.helpers.auth_dependencies import get_current_user,get_db
from app.models.attendance import Attendance
from app.models.mess_cut_requests import MessCutRequest
from app.models.room_allocations import RoomAllocation 
from app.models.rooms import Room
from app.models.guardians import Guardian
from app.helpers.helper_functions import send_general_email

router = APIRouter(prefix="/student-management", tags=["Student Management"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
def register_student(data: StudentRegister, db: Session = Depends(get_db)):

    # 1. Check if username already exists
    if db.query(User).filter(User.username == data.username.strip()).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(Student).filter(Student.email == data.email).first():
        raise HTTPException(status_code=400,detail="Email Id already registered")

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
        # guardian_name = data.guardian_name,
        # guardian_phone = data.guardian_phone,
        # guardian_relation = data.guardian_relation,
        
        preferred_room_type = data.preferred_room_type,
        preferred_food_type = data.preferred_food_type,
        caution_deposit = data.caution_deposit
    )
    
    db.add(student)
    db.commit()
    
    for guardian_data in data.guardians:
        guardian = Guardian(
            student_id=student.student_id,
            name=guardian_data.name,
            phone=guardian_data.phone,
            address=guardian_data.address,
            relation=guardian_data.relation,
            type=guardian_data.type
        )
        db.add(guardian)
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
    
    try:
        subject = "Registration Successfull"
        body = f"""
        Hello {data.name},

        Congratulations!! Your Registration to the HostelHub has been successfull.
        You will get the access to your profile after the authority's verification.
        Then you can Login to the system using the username and password you have given at the time of registration.
        We will notify you when the verification is complete. 

        Thank you for registering with us!
        
        Best regards,
        Hostel Management Team
        """
        
        # Call your email utility
        send_general_email(data.email, subject, body)
        
    except Exception as e:
        print(f"Failed to send deallocation email: {e}")

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
        User.linked_id == student_id
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
    
    try:
        subject = "Profile verification Completed"
        body = f"""
        Hello {student.name},

        Congratulations!! Your profile verification is complete. Now you can Login using the username and password given at the time of registration.

        Thank you !
        
        Best regards,
        Hostel Management Team
        """
        
        # Call your email utility
        send_general_email(student.email, subject, body)
        
    except Exception as e:
        print(f"Failed to send deallocation email: {e}")

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
    if student.caution_deposit == "paid":
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
    
    # address = db.query(StudentAddress).filter(
    #     StudentAddress.student_id == current_user.linked_id
    # ).first()
    
    

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
    
    primary_guardian= db.query(Guardian).filter(
        Guardian.student_id == current_user.linked_id,
        Guardian.type=="Primary"       
    ).first()
    
    local_guardian = db.query(Guardian).filter(
        Guardian.student_id == current_user.linked_id,
        Guardian.type=="Local"
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
    if not address:
        raise HTTPException(status_code=404, detail="Address record not found")

    student.phone = payload.phone
    student.email = payload.email
    primary_guardian.phone = payload.primary_guardian_phone
    local_guardian.phone = payload.local_guardian_phone
    address.address = payload.address
    address.city = payload.city
    address.state = payload.state
    address.pincode = payload.pincode

    db.commit()

    return {"message": "Profile updated successfully"}

@router.get("/get/active-students")
def get_active_students(db: Session = Depends(get_db)):
    return db.query(Student).filter(Student.status=="Active").all()


@router.get(
    "/search/{student_admission_number}",
    response_model=StudentProfileResponse
)
def get_student_profile(
    student_admission_number: str,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.admission_number == student_admission_number
    ).first()
    
    address=db.query(StudentAddress).filter(
        StudentAddress.student_id == student.student_id
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if not address:
        raise HTTPException(status_code=404, detail="Address record not found")

    return student
@router.get("/get-students-list-by-department")
def get_students_list_by_department(department: str, db: Session = Depends(get_db)):
    department = department.strip()
    return db.query(Student).filter(Student.department == department, Student.status == "Active").all()

@router.get("/get_student_by_id/{student_id}",
            response_model=StudentProfileResponse)
def get_student_by_id(student_id: int, db: Session = Depends(get_db)):
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
    

@router.get("/attendance/daily-list")
def get_daily_list(target_date:date, db: Session = Depends(get_db)):
    # 1. Get all students
    students = db.query(Student.student_id,
                        Student.name,
                        Student.admission_number, 
                        Student.department,
                        RoomAllocation.room_number,
                        Room.floor
                        ).join(RoomAllocation,RoomAllocation.student_id==Student.student_id
                               ).join(Room,Room.room_number==RoomAllocation.room_number
                                      ).filter(Student.status == "Active" , RoomAllocation.status=="Active",Student.date_of_joining<=target_date).all()

    # 2. Get approved Mess Cuts for this specific date
    approved_cuts = db.query(MessCutRequest.student_id).filter(
        MessCutRequest.from_date <= target_date,
        MessCutRequest.to_date >= target_date,
        MessCutRequest.status == "Approved"
    ).all()
    mess_cut_ids = {c.student_id for c in approved_cuts}

    # 3. Get existing attendance logs for this date
    existing_logs = db.query(Attendance).filter(Attendance.date == target_date).all()
    logs_map = {log.student_id: log.status for log in existing_logs}

    attendance_list = []
    for s in students:
        # Priority: 1. Manual Mark, 2. Auto Mess Cut, 3. Pending
        current_status = logs_map.get(s.student_id)
        is_locked = False

        if not current_status:
            if s.student_id in mess_cut_ids:
                current_status = "On Leave"
                is_locked = True # Warden can't change official mess cuts
            else:
                current_status = "Pending"

        attendance_list.append({
            "student_id": s.student_id,
            "admission_number": s.admission_number,
            "name": s.name,
            "floor": s.floor,
            "room_number": s.room_number,
            "status": current_status,
            "is_locked": is_locked
        })
    
    return attendance_list

@router.post("/attendance/mark")
def mark_attendance(data: dict, db: Session = Depends(get_db)):
    # Data expected: { "student_id": 1, "status": "Present", "date": "2026-03-22" }
    student_id = data.get("student_id")
    status = data.get("status")
    log_date = data.get("date")

    record = db.query(Attendance).filter(
        Attendance.student_id == student_id, 
        Attendance.date == log_date
    ).first()

    if record:
        record.status = status
        record.updated_at = datetime.now()
    else:
        new_record = Attendance(student_id=student_id, status=status, date=log_date, updated_at=datetime.now())
        db.add(new_record)
    
    db.commit()
    return {"message": "Attendance updated"}


@router.get("/attendance/monthly-report")
def get_monthly_report(month: int, year: int, department: Optional[str] = None ,db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Base Query: Join Attendance with Student
    student_id = None
    query = db.query(
        Student.student_id,
        Student.name,
        Student.admission_number,
        Attendance.status,
        func.count(Attendance.id).label("status_count")
    ).join(Student, Attendance.student_id == Student.student_id) \
     .filter(extract('month', Attendance.date) == month) \
     .filter(extract('year', Attendance.date) == year)

    # 2. Filter for specific student if ID is provided (Student View)
    if current_user.role == "Student":
        student_id = current_user.linked_id
        query = query.filter(Attendance.student_id == student_id)
        
    if department:
        query = query.filter(Student.department == department)

    results = query.group_by(Student.student_id, Attendance.status).all()

    # 3. Format into a structured JSON
    report = {}
    for s_id, name, adm, status, count in results:
        if s_id not in report:
            report[s_id] = {
                "student_id": s_id, "name": name, "admission_no": adm,
                "Present": 0, "Absent": 0, "On Leave": 0, "Total": 0
            }
        report[s_id][status] = count
        report[s_id]["Total"] += count

    return list(report.values())

@router.get("/attendance/monthly-report/pdf")
def download_monthly_report_pdf(
    month: int,
    year: int,
    department: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 🔹 SAME QUERY LOGIC
    query = db.query(
        Student.student_id,
        Student.name,
        Student.admission_number,
        Attendance.status,
        func.count(Attendance.id).label("status_count")
    ).join(Student, Attendance.student_id == Student.student_id) \
     .filter(extract('month', Attendance.date) == month) \
     .filter(extract('year', Attendance.date) == year)

    if current_user.role == "Student":
        query = query.filter(Attendance.student_id == current_user.linked_id)

    if department:
        query = query.filter(Student.department == department)

    results = query.group_by(Student.student_id, Attendance.status).all()
    
    month_name = calendar.month_name[month]

    # 🔹 FORMAT DATA
    report = {}
    for s_id, name, adm, status, count in results:
        if s_id not in report:
            report[s_id] = {
                "student_id": s_id,
                "name": name,
                "admission_no": adm,
                "Present": 0,
                "Absent": 0,
                "On Leave": 0,
                "Total": 0
            }
        report[s_id][status] = count
        report[s_id]["Total"] += count

    report_list = list(report.values())

    # 🔹 GENERATE PDF
    pdf = FPDF()
    pdf.add_page()

    # Title
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, f"Attendance Report - {month_name}/{year}/{department if department else "All Departments"}", ln=True, align="C")
    pdf.ln(5)

    # Table Header
    pdf.set_font("Arial", "B", 10)
    pdf.cell(40, 10, "Name", border=1)
    pdf.cell(40, 10, "Admission No", border=1)
    pdf.cell(20, 10, "Present", border=1)
    pdf.cell(20, 10, "Leave", border=1)
    pdf.cell(20, 10, "Absent", border=1)
    pdf.cell(20, 10, "%", border=1, ln=True)

    # Table Data
    pdf.set_font("Arial", size=10)

    for row in report_list:
        total = row["Total"] if row["Total"] > 0 else 1
        percentage = round((row["Present"] / total) * 100, 1)

        pdf.cell(40, 10, row["name"], border=1)
        pdf.cell(40, 10, row["admission_no"], border=1)
        pdf.cell(20, 10, str(row["Present"]), border=1)
        pdf.cell(20, 10, str(row["On Leave"]), border=1)
        pdf.cell(20, 10, str(row["Absent"]), border=1)
        pdf.cell(20, 10, f"{percentage}%", border=1, ln=True)

    # 🔹 RETURN PDF
    pdf_output = bytes(pdf.output(dest="S"))

    return Response(
        content=pdf_output,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=attendance_{month}_{year}.pdf"
        }
    )

    

