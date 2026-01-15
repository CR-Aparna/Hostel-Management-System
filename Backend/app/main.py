from fastapi import FastAPI
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware


from app.models.users import User
from app.models.student_details import Student

from app.routers import auth
from app.routers import student_management

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(student_management.router) 