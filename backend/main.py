from fastapi import FastAPI,Depends
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal,engine
from database import Base
from models import Student
from schemas import StudentCreate

Base.metadata.create_all(bind=engine)
app=FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@app.get("/")
def home():
    return {
        "message": "Student Management API"
    }

@app.post("/students")
def create_student(     
    student: StudentCreate, 
    db: Session = Depends(get_db)
):
    new_student = Student(
        name=student.name,
        department=student.department,
        semester=student.semester
    )
    db.add(new_student) 
    db.commit()
    db.refresh(new_student)
    return new_student

@app.get("/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    return students

@app.put("/students/{student_id}")
def update_student(student_id: int, student_data: StudentCreate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not Found"
        )
    student.name = student_data.name
    student.department = student_data.department
    student.semester = student_data.semester

    db.commit()
    db.refresh(student)
    return student

@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(
            status_code=404,
            details="Student not Found"
        )
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}