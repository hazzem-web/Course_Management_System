DELIMITER $$

CREATE PROCEDURE Add_Course(
	IN procedure_title VARCHAR(255),
    IN procedure_price INT,
    IN procedure_level ENUM('Beginner','Intermediate','Advanced')
)
BEGIN
    IF procedure_level IS NULL THEN
        SET procedure_level = 'Beginner';
    END IF;
	INSERT INTO Courses(Course_Title , Course_Price , Course_Level)
    VALUES(procedure_title , procedure_price , procedure_level);
END $$
DELIMITER ;