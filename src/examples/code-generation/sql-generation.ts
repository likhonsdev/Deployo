/**
 * SQL Query Generation Example
 * 
 * This example demonstrates how to prompt LLMs to generate valid SQL queries
 * based on database schema information and natural language requirements.
 */
export const sqlGeneration = {
  title: "Generate MySQL Query",
  description: "Generate SQL queries by describing database tables and requirements",
  category: "code-generation/database",
  difficulty: "beginner",
  prompt: `Table departments, columns = [DepartmentId, DepartmentName]
Table students, columns = [DepartmentId, StudentId, StudentName]
Create a MySQL query for all students in the Computer Science Department`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": "Table departments, columns = [DepartmentId, DepartmentName]\\nTable students, columns = [DepartmentId, StudentId, StudentName]\\nCreate a MySQL query for all students in the Computer Science Department"
    }
  ],
  temperature=0,
  max_tokens=150
)`,
  expectedOutput: `SELECT students.StudentId, students.StudentName
FROM students
INNER JOIN departments
ON students.DepartmentId = departments.DepartmentId
WHERE departments.DepartmentName = 'Computer Science';`,
  papers: [],
  tags: ["sql", "database", "query-generation", "mysql"]
};

// Multiple table query example
export const advancedSQLExample = {
  title: "Complex SQL Query Generation",
  description: "Generate a more complex SQL query involving multiple tables and aggregations",
  category: "code-generation/database",
  difficulty: "advanced",
  prompt: `Database Schema:
Table courses (CourseId, CourseName, Credits)
Table students (StudentId, StudentName, GraduationYear)
Table enrollments (EnrollmentId, StudentId, CourseId, Grade)

Write a SQL query to find the average grade for each course, but only for courses with more than 5 students enrolled, ordered by the average grade in descending order. Include the course name and the number of students enrolled.`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": "Database Schema:\\nTable courses (CourseId, CourseName, Credits)\\nTable students (StudentId, StudentName, GraduationYear)\\nTable enrollments (EnrollmentId, StudentId, CourseId, Grade)\\n\\nWrite a SQL query to find the average grade for each course, but only for courses with more than 5 students enrolled, ordered by the average grade in descending order. Include the course name and the number of students enrolled."
    }
  ],
  temperature=0,
  max_tokens=250
)`,
  expectedOutput: `SELECT 
    c.CourseName,
    COUNT(e.StudentId) AS NumStudents,
    AVG(e.Grade) AS AverageGrade
FROM 
    courses c
JOIN 
    enrollments e ON c.CourseId = e.CourseId
GROUP BY 
    c.CourseId, c.CourseName
HAVING 
    COUNT(e.StudentId) > 5
ORDER BY 
    AverageGrade DESC;`,
  papers: [],
  tags: ["sql", "database", "advanced-query", "aggregation", "join", "mysql"]
};

// Python-specific SQL example with SQLAlchemy
export const pythonSQLAlchemyExample = {
  title: "Python SQLAlchemy Query Generation",
  description: "Generate Python code using SQLAlchemy ORM for database queries",
  category: "code-generation/python-database",
  difficulty: "intermediate",
  prompt: `Create a Python function using SQLAlchemy ORM to find all students in the Computer Science department. 

Use these model definitions:

class Department(Base):
    __tablename__ = 'departments'
    department_id = Column(Integer, primary_key=True)
    department_name = Column(String)
    
class Student(Base):
    __tablename__ = 'students'
    student_id = Column(Integer, primary_key=True)
    student_name = Column(String)
    department_id = Column(Integer, ForeignKey('departments.department_id'))
    department = relationship("Department", back_populates="students")`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": "Create a Python function using SQLAlchemy ORM to find all students in the Computer Science department. \\n\\nUse these model definitions:\\n\\nclass Department(Base):\\n    __tablename__ = 'departments'\\n    department_id = Column(Integer, primary_key=True)\\n    department_name = Column(String)\\n    \\nclass Student(Base):\\n    __tablename__ = 'students'\\n    student_id = Column(Integer, primary_key=True)\\n    student_name = Column(String)\\n    department_id = Column(Integer, ForeignKey('departments.department_id'))\\n    department = relationship(\\"Department\\", back_populates=\\"students\\")"
    }
  ],
  temperature=0,
  max_tokens=300
)`,
  expectedOutput: `def get_cs_students(session):
    """
    Retrieve all students in the Computer Science department.
    
    Args:
        session: SQLAlchemy database session
        
    Returns:
        List of Student objects in Computer Science department
    """
    cs_students = session.query(Student).join(
        Department
    ).filter(
        Department.department_name == 'Computer Science'
    ).all()
    
    return cs_students`,
  papers: [],
  tags: ["python", "sqlalchemy", "orm", "database-query", "python-database"]
};
