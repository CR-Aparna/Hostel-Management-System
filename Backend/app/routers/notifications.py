from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models.users import User
from app.models.notifications import Notification
from app.helpers.auth_dependencies import get_db, get_current_user
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