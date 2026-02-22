from fastapi import FastAPI
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.scheduler import start_scheduler


from app.models.users import User
from app.models.student_details import Student
from app.models.student_address import StudentAddress

from app.routers import auth, room_management, student_management, user_management, meal_management



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.on_event("startup")
def startup_event():
    start_scheduler()



Base.metadata.create_all(bind=engine)
app.include_router(user_management.router)
app.include_router(auth.router)
app.include_router(student_management.router) 
app.include_router(room_management.router)
app.include_router(meal_management.router)
