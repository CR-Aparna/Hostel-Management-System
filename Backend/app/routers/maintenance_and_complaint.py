from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from app.database import SessionLocal
from app.models.maintenance_requests import Maintenance
from app.helpers.validation_schemas import MaintenanceCreate, MaintenanceUpdate,ComplaintCreate, ComplaintResolve
from app.models.users import User
from app.models.complaints import Complaint
from app.models.staff import Staff
from app.models.notifications import Notification
from app.models.student_details import Student
from app.models.room_allocations import RoomAllocation
from app.models.rooms import Room
 
from app.helpers.auth_dependencies import get_db, get_current_user
from app.helpers.helper_functions import require_management
from app.helpers.helper_functions import create_notification # Import the utility


router = APIRouter(prefix="/maintenance_and_complaint", tags=["Maintenance and Complaint Management"])

@router.post("/submit")
def submit_maintenance(req: MaintenanceCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Fast-track: Warden logs a repair they already finished
    status = "Resolved" if (current_user.role == "Warden" and req.is_emergency) else "Pending"
    
    new_task = Maintenance(
        **req.dict(),
        student_id=current_user.linked_id if current_user.role == "Student" else None,
        status=status,
        warden_approved=(current_user.role == "Warden"),
        admin_approved=(current_user.role == "Warden" and req.is_emergency),
        created_at=datetime.now() 
    )
    db.add(new_task)
    db.commit()
    return {"message": "Maintenance task logged"}

@router.patch("/{task_id}/process")
def process_maintenance(
    task_id: int, 
    action: MaintenanceUpdate, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    task = db.query(Maintenance).filter(Maintenance.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if current_user.role == "Warden":
        if action.decision == "Reject":
            task.status = "Rejected"
            task.warden_remarks = action.remarks
        elif action.decision == "Assign":
            task.status = "Assigned"
            task.assigned_staff = action.assigned_staff
            task.warden_approved = True
            task.admin_approved = True
        else:
            task.status = "Escalated to Admin"
            task.warden_approved = True

    elif current_user.role == "Admin" and task.admin_approved==False:
        task.warden_approved = True
        if action.decision == "Reject":
            task.status = "Rejected"
            task.admin_remarks = action.remarks
        else:
            task.admin_approved = True
            task.status = "Assigned"
            task.assigned_staff = action.assigned_staff
    task.updated_at = datetime.now()

    db.commit()
    # Trigger notification logic here later
    return {"status": task.status}

@router.post("/file")
def file_complaint(req: ComplaintCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    new_complaint = Complaint(
        **req.dict(),
        student_id=current_user.linked_id,
        status="Pending",
    )
    db.add(new_complaint)
    db.commit()
    return {"message": "Complaint filed successfully"}

@router.patch("/{complaint_id}/resolve")
def resolve_complaint(complaint_id: int, data: ComplaintResolve, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role not in ["Warden", "Admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    
    complaint.status=data.status
    complaint.updated_at=datetime.now()
    
    if data.status == "Resolved":
        complaint.action_taken = data.action_taken
        complaint.resolved_by = current_user.username
    
    
    db.commit()
    return {"message": "Grievance addressed"}

@router.get("/my-maintenance")
def get_my_maintenance(
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    # Fetch only maintenance tasks created by this student
    return db.query(Maintenance).filter(
        Maintenance.student_id == current_user.linked_id
    ).all()

@router.get("/my-complaints")
def get_my_complaints(
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    # Fetch only complaints created by this student
    return db.query(Complaint).filter(
        Complaint.student_id == current_user.linked_id
        
    ).all()
    
@router.get("/all-maintenances")
def get_all_maintenance(
    status: Optional[str] = None, 
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user) # Ensure you have a check here for Role == "Warden" or "Admin"
):
    # # Base query: Get everything
    # query = db.query(Maintenance)

    # # Apply filters if they are provided in the URL
    # if status:
    #     query = query.filter(Maintenance.status == status)
    
    # if category:
    #     query = query.filter(Maintenance.category == category)

    # student_admission_number = db.query(Student.admission_number).filter(Student.student_id==Maintenance.student_id).first()
    # student_name = db.query(Student.name).filter(Student.student_id==Maintenance.student_id).first()
    # # Order by newest first and return
    # return {query.order_by(Maintenance.created_at.desc()).all(),
    #         "admission_number":student_admission_number,
    #         }
    
    query = db.query(Maintenance, Student,Staff).join(
        Student, Maintenance.student_id == Student.student_id).join(Staff,Maintenance.assigned_staff==Staff.staff_id
    )

    if status:
        query = query.filter(Maintenance.status == status)
    
    if category:
        query = query.filter(Maintenance.category == category)

    results = query.order_by(Maintenance.created_at.desc()).all()

    # Format response
    response = []
    for maintenance, student ,staff in results:
        response.append({
            "id": maintenance.id,
            "category": maintenance.category,
            "status": maintenance.status,
            "description": maintenance.description,
            "room_number":maintenance.room_number,
            "created_at": maintenance.created_at,
            "updated_at": maintenance.updated_at if maintenance.updated_at else None,
            "student_name": student.name,
            "admission_number": student.admission_number,
            "assigned_staff" : maintenance.assigned_staff,
            "staff_name" :staff.name
        })

    return response

@router.get("/all-complaints")
def get_all_complaints(
    status: Optional[str] = None, 
    db: Session = Depends(get_db), 
    user = Depends(require_management)
):
    query = db.query(Complaint,Student,RoomAllocation).join(
        Student,Complaint.student_id==Student.student_id).join(
            RoomAllocation,Complaint.student_id == RoomAllocation.student_id).filter(RoomAllocation.status=="Active")
    if status:
        query = query.filter(Complaint.status == status)
    results = query.order_by(Complaint.created_at.desc()).all()
    response = []
    for complaint, student ,room in results:
        response.append({
            "id": complaint.id,
            "admission_number":student.admission_number,
            "student_name":student.name,
            "issue_type":complaint.issue_type,
            "subject":complaint.subject,
            "description":complaint.description,
            "status":complaint.status,
            "action_taken":complaint.action_taken,
            "resolved_by":complaint.resolved_by,
            "created_at":complaint.created_at,
            "updated_at":complaint.updated_at,
            "room_number":room.room_number
        })

    return response    

@router.get("/warden_approved/maintenances")
def get_warden_approved_maintenances(db: Session = Depends(get_db)):
    return db.query(Maintenance).filter(Maintenance.status == "Escalated to Admin").all()

@router.get("/escalated/complaints")
def get_escalated_complaints(db: Session = Depends(get_db)):
    return db.query(Complaint).filter(Complaint.status == "Escalated to Admin").all()

@router.get("/staff")
def get_staff(db: Session = Depends(get_db)):
    try:
        # 1. Check if your table name is actually 'Staff'
        # 2. Check if you have imported the Staff model
        staff = db.query(Staff).filter(Staff.status=="Active").all() 
        return staff
    except Exception as e:
        print(f"ERROR: {e}") # This will show the real error in your terminal
        raise HTTPException(status_code=500, detail="Database error")
    
# Get tasks assigned to the logged-in staff
@router.get("/staff/tasks")
def get_staff_tasks(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Security: Ensure only Staff/Warden/Admin can access
    if current_user.role not in ["Maintenance Staff", "Warden", "Admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Filter maintenance table by the staff's unique ID
    # current_user.id assumes your User model/token contains the staff's ID
    tasks = db.query(Maintenance).filter(Maintenance.assigned_staff == current_user.linked_id).all()
    return tasks

# Update the status of an assigned task
@router.patch("/staff/tasks/{task_id}/update-status")
def update_task_status(
    task_id: int, 
    new_status: str, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    task = db.query(Maintenance).filter(
        Maintenance.id == task_id, 
        Maintenance.assigned_staff == current_user.linked_id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned to you")

    task.status = new_status
    task.updated_at = datetime.now()
    
    
    # Logic: If completed, you might want to record completion time
    if new_status == "Resolved":
        room = db.query(Room).filter(Room.room_number == task.room_number).first()
        if room.status == "Under Maintenance":
            room.status = "Available"
        pass

    db.commit()
    return {"message": f"Task marked as {new_status}"}



@router.patch("/rooms/{room_number}/maintenance")
async def set_room_maintenance(
    room_number: int,  
    db: Session = Depends(get_db)
):
    # 1. Update Room Status
    room = db.query(Room).filter(Room.room_number == room_number).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    room.status = "Under Maintenance"
    
    # 2. Find all active occupants
    occupants = db.query(Student).join(RoomAllocation).filter(
        RoomAllocation.room_number == room_number,
        RoomAllocation.status == "Active"
    ).all()

    # 3. Queue Notifications
    for student in occupants:
        title = "Room Maintenance Alert"
        content = f"Hi {student.name}, Room {room_number} is scheduled for maintenance. Please submit a room change request."
        
        # Use background tasks to keep the API fast
        create_notification(
            db=db,
            student_id=student.student_id,
            title=title,
            message=content,
            type="Room Maintenance"
        )

    db.commit()
    return {"message": f"Maintenance mode active. {len(occupants)} students notified via Dashboard."}