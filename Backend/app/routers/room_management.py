from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database import SessionLocal
from app.models.users import User
from app.models.student_details import Student
from app.models.rooms import Room
from app.models.room_allocations import RoomAllocation
from app.models.room_change_request import RoomChangeRequest
from app.models.vacate_requests import VacateRequest
from app.helpers.validation_schemas import RoomCreate,AllocateRoom,RoomChangeRequestCreate,RoomChangeRequestResponse,VacateRequestCreate
from datetime import date
from app.helpers.auth_dependencies import get_current_user,get_db,require_warden

router = APIRouter(prefix="/room-management", tags=["Room Management"])

#pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/rooms")
def create_room(room: RoomCreate, db: Session = Depends(get_db)):

    # Check if room already exists
    '''existing_room = db.query(Room).filter(
        Room.room_number == room.room_number
    ).first()

    if existing_room:
        raise HTTPException(status_code=400, detail="Room already exists")'''

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
        "room_id": new_room.room_number
    }
    

@router.get("/rooms/details")
def get_rooms_with_occupants(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()

    result = []

    for room in rooms:
        # Get active allocations
        allocations = db.query(RoomAllocation).filter(
            RoomAllocation.room_number== room.room_number,
            RoomAllocation.status == "Active"
        ).all()

        # Get student details
        occupants = []
        for alloc in allocations:
            student = db.query(Student).filter(
                Student.student_id == alloc.student_id
            ).first()

            if student:
                occupants.append({
                    "student_id": student.student_id,
                    "name": student.name,
                    "department": student.department,
                    "course": student.course
                })

        current_occupancy = len(occupants)

        # Dynamic status
        status = "Occupied" if current_occupancy >= room.capacity else "Available"

        result.append({
            "room_number": room.room_number,
            "floor": room.floor,
            "room_type": room.room_type,
            "rent": room.rent,
            "capacity": room.capacity,
            "current_occupancy": current_occupancy,
            "available_slots": room.capacity - current_occupancy,
            "status": status,
            "occupants": occupants
        })

    return result



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
            RoomAllocation.room_number == room.room_number,
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
            RoomAllocation.room_number == room.room_number,
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
    room = db.query(Room).filter(Room.room_number == data.room_number).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # Check capacity
    active_count = db.query(RoomAllocation).filter(
        RoomAllocation.room_number == data.room_number,
        RoomAllocation.status == "Active"
    ).count()

    if active_count >= room.capacity:
        raise HTTPException(status_code=400, detail="Room is full")       

    # Create allocation
    allocation = RoomAllocation(
        student_id=data.student_id,
        room_number=data.room_number,
        allocated_date=date.today(),
        status="Active"
    )

    db.add(allocation)
    
    new_count = active_count + 1

    if new_count >= room.capacity:
        room.status = "Occupied"
    else:
        room.status = "Available"
        
    db.commit()
    db.refresh(allocation)
    

    return {"message": "Room allocated successfully"}


@router.post("/change-request")
def create_change_request(
    data: RoomChangeRequestCreate,
    student_id: int,   # from token later
    db: Session = Depends(get_db)
):
    # Check active allocation
    allocation = db.query(RoomAllocation).filter(
        RoomAllocation.student_id == student_id,
        RoomAllocation.status == "Active"
    ).first()

    if not allocation:
        raise HTTPException(400, "No active room to change")

    # Prevent duplicate request
    existing = db.query(RoomChangeRequest).filter(
        RoomChangeRequest.student_id == student_id,
        RoomChangeRequest.status == "Pending"
    ).first()

    if existing:
        raise HTTPException(400, "Already have pending request")

    request = RoomChangeRequest(
        student_id=student_id,
        current_room_number=allocation.room_number,
        requested_room_type=data.requested_room_type,
        requested_room_number=data.requested_room_number,
        reason=data.reason,
        status="Pending",
        request_date=date.today()
    )

    db.add(request)
    db.commit()

    return {"message": "Request submitted"}

@router.get("/my-change-requests")
def get_my_requests(student_id: int, db: Session = Depends(get_db)):
    return db.query(RoomChangeRequest).filter(
        RoomChangeRequest.student_id == student_id
    ).all()
    
@router.get("/change-requests")
def get_pending_requests(db: Session = Depends(get_db)):
    return db.query(RoomChangeRequest).filter(
        RoomChangeRequest.status == "Pending"
    ).all()


@router.post("/change-request/{request_id}/approve")
def approve_request(request_id: int, db: Session = Depends(get_db)):

    request = db.query(RoomChangeRequest).filter(
        RoomChangeRequest.request_id == request_id
    ).first()

    if not request or request.status != "Pending":
        raise HTTPException(404, "Invalid request")

    # Find available rooms
    rooms = db.query(Room).all()

    selected_room = None
    
    for room in rooms:
        if room.room_number == request.requested_room_number and room.status == "Available":
            selected_room = room
            break
        else:
            if request.requested_room_type and room.room_type != request.requested_room_type:
                continue

            active_count = db.query(RoomAllocation).filter(
                RoomAllocation.room_number == room.room_number,
                RoomAllocation.status == "Active"
            ).count()

            if active_count < room.capacity:
                selected_room = room
                break

        if not selected_room:
            raise HTTPException(400, "No suitable room available")

        # 🔴 Step 1: Deallocate old room
    old_alloc = db.query(RoomAllocation).filter(
        RoomAllocation.student_id == request.student_id,
        RoomAllocation.status == "Active"
    ).first()

    old_alloc.status = "Inactive"
    old_alloc.vacated_date = date.today()

    # 🔴 Step 2: Allocate new room
    new_alloc = RoomAllocation(
        student_id=request.student_id,
        room_number=selected_room.room_number,
        allocated_date=date.today(),
        status="Active"
    )

    db.add(new_alloc)

    # 🔴 Step 3: Update request
    request.status = "Approved"
    request.decision_date = date.today()

    db.commit()

    return {"message": "Room changed successfully"}

@router.post("/change-request/{request_id}/reject")
def reject_request(request_id: int, db: Session = Depends(get_db)):

    request = db.query(RoomChangeRequest).filter(
        RoomChangeRequest.request_id == request_id
    ).first()

    if not request or request.status != "Pending":
        raise HTTPException(404, "Invalid request")

    request.status = "Rejected"
    request.decision_date = date.today()

    db.commit()

    return {"message": "Request rejected"}

@router.post("/vacate-request")
def request_vacate(data: VacateRequestCreate, db: Session = Depends(get_db)):

    allocation = db.query(RoomAllocation).filter(
        RoomAllocation.student_id == data.student_id,
        RoomAllocation.status == "Active"
    ).first()

    if not allocation:
        raise HTTPException(400, "No active room")

    # prevent duplicate
    existing = db.query(VacateRequest).filter(
        VacateRequest.student_id == data.student_id,
        VacateRequest.status == "Pending"
    ).first()

    if existing:
        raise HTTPException(400, "Already requested")

    request = VacateRequest(
        student_id=data.student_id,
        room_number=allocation.room_number,
        reason=data.reason,
        status="Pending",
        request_date=date.today()
    )

    db.add(request)
    db.commit()

    return {"message": "Vacate request sent"}

@router.get("/admin/vacate-requests")
def get_vacate_requests(db: Session = Depends(get_db)):
    return db.query(VacateRequest).filter(
        VacateRequest.status == "Pending"
    ).all()
    
@router.get("/warden/vacate-requests")
def get_vacate_requests(db: Session = Depends(get_db)):
    return db.query(VacateRequest).filter(
        VacateRequest.status == "Approved"
    ).all()
    
    
@router.put("/vacate-request/{request_id}/approve")
def approve_request(request_id: int, db: Session = Depends(get_db)):

    request = db.query(VacateRequest).filter(
        VacateRequest.request_id == request_id
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    request.status = "Approved"

    db.commit()

    return {"message": "Request approved"}


@router.post("/vacate-request/{request_id}/reject")
def reject_vacate(request_id: int, db: Session = Depends(get_db)):

    request = db.query(VacateRequest).filter(
        VacateRequest.request_id == request_id
    ).first()

    if not request:
        raise HTTPException(404, "Not found")

    request.status = "Rejected"
    request.decision_date = date.today()

    db.commit()

    return {"message": "Rejected"}

@router.post("/rooms/deallocate/{student_id}")
def deallocate_room(student_id: int, db: Session = Depends(get_db)):

    # 1️⃣ Check approved vacate request
    request = db.query(VacateRequest).filter(
        VacateRequest.student_id == student_id,
        VacateRequest.status == "Approved"
    ).first()

    if not request:
        raise HTTPException(status_code=400, detail="No approved vacate request")

    # 2️⃣ Find active allocation
    allocation = db.query(RoomAllocation).filter(
        RoomAllocation.student_id == student_id,
        RoomAllocation.status == "Active"
    ).first()

    if not allocation:
        raise HTTPException(status_code=404, detail="No active allocation found")

    room_number = allocation.room_number

    # 3️⃣ Update allocation
    allocation.status = "Inactive"
    allocation.vacated_date = date.today()

    # 4️⃣ Update room occupancy count AFTER deallocation
    active_count = db.query(RoomAllocation).filter(
        RoomAllocation.room_number == room_number,
        RoomAllocation.status == "Active"
    ).count()

    # 5️⃣ Get room
    room = db.query(Room).filter(Room.room_number == room_number).first()

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # 6️⃣ Update room status
    if active_count < room.capacity:
        room.status = "Available"

    # 7️⃣ Mark request as completed
    request.status = "Completed"

    db.commit()

    return {"message": "Room vacated successfully"}




