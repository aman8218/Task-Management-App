from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime # type: ignore
from sqlalchemy.orm import  sessionmaker, session # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#cors setup
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# SQLALCHEMY 
DATABASE_URL = "postgres://default:aJqxpS47evzi@ep-plain-glitter-a4og6cvs.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    status = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.now)

Base.metadata.create_all(bind=engine)


#pydantic
class TaskCreate(BaseModel):
    title: str
    description: str
    status: str

class TaskUpdate(BaseModel):
    title: str
    description: str
    status: str

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally: 
        db.close()



@app.get("/api/get-tasks")
def read_tasks(skip: int = 0, limit: int = 10):
    db = SessionLocal()
    tasks = db.query(Task).offset(skip).limit(limit).all()
    return tasks

@app.post("/api/add-task")
def create_task(task: TaskCreate):
    db = SessionLocal()
    db_task = Task(title=task.title, description=task.description, status=task.status)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    print(db_task.created_at, db_task.description, db_task.title)
    return db_task

@app.put("/api/update-task/{task_id}")
def update_task(task_id: int, task: TaskUpdate):
    db = SessionLocal()
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.title = task.title
    db_task.description = task.description
    db_task.status = task.status
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/api/delete-task/{task_id}")
def delete_task(task_id: int):
    db = SessionLocal()
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted",}
