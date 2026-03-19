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
 
from app.helpers.auth_dependencies import get_db, get_current_user
from app.helpers.helper_functions import require_management

router = APIRouter(prefix="/maintenance_and_complaint", tags=["Maintenance and Complaint Management"])

@router.post("/submit")
def submit_maintenance(req: MaintenanceCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Fast-track: Warden logs a repair they already finished
    status = "Closed" if (current_user.role == "Warden" and req.is_emergency) else "Pending"
    
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

    elif current_user.role == "Admin" and task.warden_approved==True and task.admin_approved==False:
        if action.decision == "Reject":
            task.status = "Rejected"
            task.admin_remarks = action.remarks
        else:
            task.admin_approved = True
            task.status = "Assigned"
            task.assigned_staff = action.assigned_staff

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
    
@router.get("/all")
def get_all_maintenance(
    status: Optional[str] = None, 
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user) # Ensure you have a check here for Role == "Warden" or "Admin"
):
    # Base query: Get everything
    query = db.query(Maintenance)

    # Apply filters if they are provided in the URL
    if status:
        query = query.filter(Maintenance.status == status)
    
    if category:
        query = query.filter(Maintenance.category == category)

    # Order by newest first and return
    return query.order_by(Maintenance.created_at.desc()).all()

@router.get("/all-complaints")
def get_all_complaints(
    status: Optional[str] = None, 
    db: Session = Depends(get_db), 
    user = Depends(require_management)
):
    query = db.query(Complaint)
    if status:
        query = query.filter(Complaint.status == status)
    return query.order_by(Complaint.created_at.desc()).all()    

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
    
    # Logic: If completed, you might want to record completion time
    if new_status == "Resolved":
        # task.completed_at = datetime.now()
        pass

    db.commit()
    return {"message": f"Task marked as {new_status}"}