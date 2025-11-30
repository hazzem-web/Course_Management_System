DELIMITER $$
CREATE TRIGGER after_course_insert
AFTER INSERT ON Courses 
FOR EACH ROW 
BEGIN
	INSERT INTO Course_Logs (Course_ID , Course_Title , Course_Price)
    VALUES (NEW.Course_ID , NEW.Course_Title , NEW.Course_Price);
END $$
DELIMITER ;