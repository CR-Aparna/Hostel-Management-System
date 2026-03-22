from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models.users import User
from app.models.notifications import Notification
from app.helpers.auth_dependencies import get_db, get_current_user
from app.models.student_details import Student
from app.models.vacate_requests import VacateRequest
from app.models.room_allocations import RoomAllocation
from app.models.mess_cut_requests import MessCutRequest
from app.models.room_change_request import RoomChangeRequest
from app.models.maintenance_requests import Maintenance
# Import your models and database dependency

router = APIRouter(prefix="/notifications", tags=["Notifications"])

# 1. GET ALL UNREAD (For the notification bell count)
@router.get("/unread")
def get_unread_notifications(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return db.query(Notification).filter(
        Notification.student_id == current_user.linked_id,
        Notification.is_read == False
    ).order_by(Notification.created_at.desc()).all()

# 2. GET ALL NOTIFICATIONS (For the "View All" page)
@router.get("/all")
def get_all_notifications(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return db.query(Notification).filter(
        Notification.student_id == current_user.linked_id
    ).order_by(Notification.created_at.desc()).all()

# 3. MARK AS READ (Triggered when student clicks a notification)
@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.student_id == current_user.linked_id
    ).first()
    
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notif.is_read = True
    db.commit()
    return {"message": "Marked as read"}

@router.get("/dashboard/counters")
def get_dashboard_counters(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    counters = {}
    
    if current_user.role == "Admin":
        counters["pending_registrations"] = db.query(Student).filter(Student.status == "Warden Approved").count()
        counters["pending_deallocations"] = db.query(VacateRequest).filter(VacateRequest.status == "Approved").count()
        counters["escalated_maintenances"] = db.query(Maintenance).filter(Maintenance.status == "Escalated to Admin").count()
    
    elif current_user.role == "Warden":
        counters["pending_mess_cuts"] = db.query(MessCutRequest).filter(MessCutRequest.status == "Pending").count()
        counters["room_change_requests"] = db.query(RoomChangeRequest).filter(RoomChangeRequest.status == "Pending").count()
        counters["pending_verifications"] = db.query(Student).join(VacateRequest, Student.student_id == VacateRequest.student_id).filter(Student.status == "Inactive", VacateRequest.status != "Completed").count()
        counters["pending_maintenances"] = db.query(Maintenance).filter(Maintenance.status == "Pending").count()
        counters["pending_vacates"] = db.query(VacateRequest).filter(VacateRequest.status == "Pending").count()
        counters["pending_allocations"]= db.query(Student).filter(Student.status=="Active",Student.student_id.notin_(db.query(RoomAllocation.student_id).filter(RoomAllocation.status == "Active").subquery())).count()
        
    return counters