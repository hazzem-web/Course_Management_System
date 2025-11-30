CREATE TABLE enrollments (
  EnrollID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT,
  CourseID INT,
  EnrollDate DATE,
  FOREIGN KEY (UserID) REFERENCES users(user_ID),
  FOREIGN KEY (CourseID) REFERENCES courses(Course_ID)
);
