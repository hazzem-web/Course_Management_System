const express = require('express');
const router = express.Router(); // import router from express
const {getAllCourses , getSingleCourse , addCourse , updateCourse , deleteCourse} = require('../controllers/courses.controller.js'); // get all controllers methods 
const { validationSchema } = require('../middlewares/validationSchema.js');
const verifyToken = require('../middlewares/verifyToken.js');
const {ADMIN , MANAGER} = require("../utils/userRole.js")
const allowedTo = require("../middlewares/allowedTo.js")

// (CRUD)

  
router.route('/')
            .get(getAllCourses)//Get All Courses 
            .post(validationSchema(), verifyToken ,allowedTo(ADMIN),addCourse);//Create New Course
router.route('/:courseId')
            .get(getSingleCourse) // Get One Course
            .patch(validationSchema() , verifyToken , allowedTo(ADMIN), updateCourse)  // Update Course
            .delete(verifyToken , allowedTo(ADMIN,MANAGER) , deleteCourse) // Delete Course



module.exports = router;

