CREATE TABLE Courses (
	Course_ID INT PRIMARY KEY AUTO_INCREMENT,
    Course_Title VARCHAR(255) UNIQUE NOT NULL,
    Course_Price INT NOT NULL,
    Course_Level ENUM('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);