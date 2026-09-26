from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os

# PostgreSQL connection string
# Uses environment variable in production, fallbacks to localhost for development
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:2005%40Mayur@localhost:5432/grain_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
