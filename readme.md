# 📚 Course Management System

A RESTful API backend for managing courses, users, and enrollments — built with **Node.js**, **Express**, and **MySQL**.  
The project demonstrates advanced database features including stored procedures, triggers, functions, and a many-to-many relationship model.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL (mysql2/promise) |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Validation | express-validator |
| Environment | dotenv |

---

## 🗃️ Database Design (ERD)

```
Users ──────────────────────── Enrollments ──────────────────── Courses
(user_ID, First_Name,          (EnrollID, UserID,               (Course_ID, Course_Title,
 Last_Name, Email,              CourseID, EnrollDate)             Course_Price, Course_Level,
 Password, Role, AVATAR)                                          Created_at)
```

**Many-to-Many** relationship between `Users` and `Courses` resolved via the `Enrollments` junction table.

### Advanced SQL Features

| Feature | Name | Description |
|---|---|---|
| 🔔 Trigger | `after_course_insert` | Logs every new course to `Course_Logs` automatically |
| ⚙️ Procedure | `Add_Course` | Inserts a course with a default level fallback |
| 🔢 Function | `get_course_count()` | Returns total number of courses |

---

## 📁 Project Structure

```
course-management-system/
├── DataBase/
│   └── db.js                        # MySQL connection pool
├── Routes/
│   ├── courses.route.js
│   ├── users.route.js
│   └── AdvancedDatabase.route.js
├── controllers/
│   ├── courses.controller.js
│   ├── users.controller.js
│   └── AdvancedDatabase.controller.js
├── middlewares/
│   ├── asyncWrapper.js              # Async error handler wrapper
│   ├── verifyToken.js               # JWT verification middleware
│   ├── allowedTo.js                 # RBAC middleware
│   └── validationSchema.js          # express-validator rules
├── utils/
│   ├── appError.js                  # Custom error class
│   ├── generateJWT.js               # JWT generator
│   ├── httpStatusText.js            # HTTP status constants
│   └── userRole.js                  # Role constants
├── SQL/
│   ├── Users_Table.sql
│   ├── Courses_Table.sql
│   ├── EnrollmentsTable.sql
│   ├── Course_Logs.sql
│   ├── AddCourseProcedure.sql
│   ├── after_course_insert Trigger.sql
│   └── get_course_count() Function.sql
├── uploads/                         # Avatar images (auto-created)
├── .env.example
├── index.js
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/hazzem-web/Course_Management_System.git
cd Course_Management_System
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=course_management
JWT_SECRET_KEY=your_secret_key
```

### 4. Set up the database

Run the SQL files in this order inside MySQL:

```sql
-- 1. Create tables
source SQL/Users_Table.sql
source SQL/Courses_Table.sql
source SQL/Course_Logs.sql
source SQL/EnrollmentsTable.sql

-- 2. Create advanced features
source SQL/AddCourseProcedure.sql
source SQL/after_course_insert Trigger.sql
source SQL/get_course_count() Function.sql

-- 3. (Optional) Seed data
source SQL/Courses.sql
```

### 5. Start the server

```bash
node index.js
# or with nodemon
npx nodemon index.js
```

---

## 🔐 Authentication & Authorization

The API uses **JWT-based authentication** with **Role-Based Access Control (RBAC)**.

### Roles

| Role | Permissions |
|---|---|
| `USER` | Browse courses |
| `MANAGER` | Delete courses |
| `ADMIN` | Full access (Create, Update, Delete courses + View all users) |

Include the token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

---

## 📡 API Endpoints

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users/register` | ❌ | Register a new user (with optional avatar upload) |
| `POST` | `/api/users/login` | ❌ | Login and receive JWT token |
| `GET` | `/api/users/` | ADMIN / MANAGER | Get all users (paginated) |

### Courses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/courses/` | ❌ | Get all courses (paginated) |
| `GET` | `/api/courses/:courseId` | ❌ | Get a single course |
| `POST` | `/api/courses/` | ADMIN | Create a new course |
| `PATCH` | `/api/courses/:courseId` | ADMIN | Update a course |
| `DELETE` | `/api/courses/:courseId` | ADMIN / MANAGER | Delete a course |

### Advanced Database

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/trigger` | ❌ | View course logs (via Trigger) |
| `GET` | `/api/function` | ❌ | Get total course count (via Function) |
| `POST` | `/api/procedure` | ❌ | Add a course via Stored Procedure |

#### POST `/api/procedure` — Request Body

```json
{
  "title": "Node.js Advanced",
  "price": 12000,
  "level": "Advanced"
}
```

---

## 📝 Request & Response Examples

### Register

```http
POST /api/users/register
Content-Type: multipart/form-data

{
  "firstName": "Hazzem",
  "lastName": "Mohamed",
  "email": "hazzem@example.com",
  "password": "secret123",
  "role": "USER"
}
```

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "firstName": "Hazzem",
      "email": "hazzem@example.com",
      "token": "eyJ..."
    }
  },
  "message": "User Created Successfully"
}
```

### Login

```http
POST /api/users/login
Content-Type: application/json

{ "email": "hazzem@example.com", "password": "secret123" }
```

---

## 🔧 Error Handling

All errors follow a unified format:

```json
{
  "status": "error",
  "message": "Course Not Found",
  "code": 404,
  "data": null
}
```

| Status | Meaning |
|---|---|
| `success` | Request completed successfully |
| `fail` | Client-side validation/logic error (4xx) |
| `error` | Server-side or auth error (4xx/5xx) |

---

## 🛠️ Known Limitations / Future Improvements

- [ ] Add enrollment endpoints (enroll/unenroll users from courses)
- [ ] Implement refresh token strategy
- [ ] Add pagination metadata (`total`, `pages`) to list responses
- [ ] Restrict CORS to specific origins in production
- [ ] Add rate limiting middleware
- [ ] Unit & integration tests

---

## 👤 Author

**Hazzem Mohamed Anwar**  
Backend Developer | Node.js · Express · MySQL · MongoDB  

[![GitHub](https://img.shields.io/badge/GitHub-hazzem--web-181717?logo=github)](https://github.com/hazzem-web)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hazzem%20Mohammed-0A66C2?logo=linkedin)](https://www.linkedin.com/in/hazzem-mohammed-9133321a5/)

---

## 📄 License

This project is for educational purposes.