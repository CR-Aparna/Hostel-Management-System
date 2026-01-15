from dotenv import load_dotenv
import os 
from sqlalchemy import create_engine    
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASS")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = (f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
                f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
            )

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False,autoflush= False, bind=engine)
Base = declarative_base()

