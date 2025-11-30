const db = require("../DataBase/db")
const { validationResult } = require("express-validator");
const { SUCCESS, FAIL, ERROR } = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');

const getCoursesCount = asyncWrapper(async (req,res,next)=>{
    const [rows] = await db.query(
        "SELECT get_course_count() AS totalCourses"
    )
    return res.json({ status: SUCCESS, message:"this is the total number of courses: " ,data: { totalCourses: rows[0].totalCourses } });
})

// GET ALL COURSES
const getAllCourses = asyncWrapper(async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    console.log("req.body: ", req.body);
    console.log("req.user: ", req.user);
    const [courses] = await db.query(
        "SELECT * FROM courses LIMIT ? OFFSET ?",
        [Number(limit), Number(skip)]
    );

    if (courses.length === 0) {
        return res.status(200).json({ status: SUCCESS, data: { courses: [] }, message: "No courses found" });
    }
    getCoursesCount()
    return res.json({ status: SUCCESS, data: { courses }});
    
});

// GET SINGLE COURSE
const getSingleCourse = asyncWrapper(async (req, res, next) => {
    const { courseId } = req.params;

    const [course] = await db.query(
        "SELECT * FROM courses WHERE Course_ID = ?",
        [courseId]
    );

    if (course.length === 0) {
        return next(AppError.create("Course Not Found", 404, FAIL));
    }

    return res.json({ status: SUCCESS, data: { course: course[0] } });
});

// ADD COURSE
const addCourse = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(AppError.create(errors.array(), 400, FAIL));
    }

    const { title, price, level } = req.body;

    const [exists] = await db.query(
        "SELECT * FROM courses WHERE Course_Title = ?",
        [title.toLowerCase()]
    );

    if (exists.length > 0) {
        return next(AppError.create("This course already exists", 400, ERROR));
    }

    const [result] = await db.query(
        "INSERT INTO courses (Course_Title, Course_Price, Course_Level) VALUES (?,?,?)",
        [title.toLowerCase(), price, level]
    );

    return res.status(201).json({
        status: SUCCESS,
        data: { id: result.insertId },
        message: "Course Created Successfully"
    });
});

// UPDATE COURSE
const updateCourse = asyncWrapper(async (req, res, next) => {
    const { courseId } = req.params;
    const { title, price, level} = req.body;

    const [result] = await db.query(
        "UPDATE courses SET Course_Title=?, Course_Price=?, Course_Level=? WHERE Course_ID=?",
        [title, price, level, courseId]
    );

    if (result.affectedRows === 0) {
        return next(AppError.create("Course Not Found", 404, FAIL));
    }

    return res.json({ status: SUCCESS, message: "Course Updated Successfully" });
});

// DELETE COURSE
const deleteCourse = asyncWrapper(async (req, res, next) => {
    const { courseId } = req.params;

    const [result] = await db.query(
        "DELETE FROM courses WHERE Course_ID = ?",
        [courseId]
    );

    if (result.affectedRows === 0) {
        return next(AppError.create("Course Not Found", 404, FAIL));
    }

    return res.json({ status: SUCCESS, message: "Course Deleted Successfully" });
});

module.exports = {
    getAllCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse,
    getCoursesCount
};

