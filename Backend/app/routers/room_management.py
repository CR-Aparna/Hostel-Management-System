from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database import SessionLocal
from app.models.users import User
from app.models.student_details import Student
from app.models.rooms import Room
from app.models.room_allocations import RoomAllocation
from app.helpers.validation_schemas import RoomCreate,AllocateRoom
from datetime import date
from app.helpers.auth_dependencies import get_current_user,get_db,require_warden

router = APIRouter(prefix="/room-management", tags=["Room Management"])

#pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/rooms")
def create_room(room: RoomCreate, db: Session = Depends(get_db)):

    # Check if room already exists
    existing_room = db.query(Room).filter(
        Room.room_number == room.room_number
    ).first()

    if existing_room:
        raise HTTPException(status_code=400, detail="Room already exists")

    new_room = Room(
        room_number=room.room_number,
        floor=room.floor,
        capacity=room.capacity,
        room_type=room.room_type,
        rent=room.rent,
        status="Available"
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return {
        "message": "Room created successfully",
        "room_id": new_room.room_id
    }


@router.get("/pending-allocations")
def get_students_waiting_for_room(
    db: Session = Depends(get_db),
    warden = Depends(require_warden)
):
    students = db.query(Student).filter(
        Student.status == "Active"
    ).all()

    result = []

    for student in students:
        active_allocation = db.query(RoomAllocation).filter(
            RoomAllocation.student_id == student.student_id,
            RoomAllocation.status == "Active"
        ).first()

        if not active_allocation:
            result.append(student)

    return result

@router.get("/available-rooms")
def available_rooms(
    db: Session = Depends(get_db),
    current_user = Depends(require_warden)
):
    rooms = db.query(Room).filter(
        Room.status == "Available"
    ).all()

    available = []

    for room in rooms:
        active_count = db.query(RoomAllocation).filter(
            RoomAllocation.room_id == room.room_id,
            RoomAllocation.status == "Active"
        ).count()

        if active_count < room.capacity:
            available.append(room)

    return available

@router.get("/rooms/suggested/{student_id}")
def get_suggested_rooms(student_id: int, db: Session = Depends(get_db)):
    
    student = db.query(Student).filter(Student.student_id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    rooms = db.query(Room).all()

    preferred = []
    others = []

    for room in rooms:
        active_count = db.query(RoomAllocation).filter(
            RoomAllocation.room_id == room.room_id,
            RoomAllocation.status == "Active"
        ).count()

        if active_count < room.capacity and room.status == "Available":
            
            if room.room_type == student.preferred_room_type:
                preferred.append(room)
            else:
                others.append(room)

    return {
        "preferred_rooms": preferred,
        "other_rooms": others
    }

@router.post("/rooms/allocate")
def allocate_room(
    data: AllocateRoom,
    db: Session = Depends(get_db)
):
    # Check student exists
    student = db.query(Student).filter(Student.student_id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Check already allocated
    existing = db.query(RoomAllocation).filter(
        RoomAllocation.student_id == data.student_id,
        RoomAllocation.status == "Active"
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Student already allocated")

    # Check room
    room = db.query(Room).filter(Room.room_id == data.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # Check capacity
    active_count = db.query(RoomAllocation).filter(
        RoomAllocation.room_id == data.room_id,
        RoomAllocation.status == "Active"
    ).count()

    if active_count >= room.capacity:
        raise HTTPException(status_code=400, detail="Room is full")

    # Create allocation
    allocation = RoomAllocation(
        student_id=data.student_id,
        room_id=data.room_id,
        allocated_date=date.today(),
        status="Active"
    )

    db.add(allocation)
    db.commit()
    db.refresh(allocation)

    return {"message": "Room allocated successfully"}


