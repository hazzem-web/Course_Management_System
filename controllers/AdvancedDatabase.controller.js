const db = require("../DataBase/db");
const asyncWrapper = require("../middlewares/asyncWrapper");

const ViewCourseLogs = asyncWrapper(async (req, res, next) => { //Trigger
    const [logs] = await db.query("SELECT * FROM course_logs");
    res.status(200).json({        
        status: "success",
        message: "Course logs retrieved successfully",
        data: logs
    });
});


const getCourseCount = asyncWrapper(async (req,res,next)=>{
    const [rows] = await db.query("SELECT get_course_count() AS Count")
    res.status(200).json({
        status:"SUCCESS",
        message: "Total Number Of Courses Is"   ,
        data: rows[0]
    })
})

const addCourseProcedure = asyncWrapper(async (req,res,next)=>{
    const { title, price, level } = req.body;
    await db.query("CALL Add_Course(?,?,?)",[title,price,level])
    res.status(200).json({
        status:"SUCCESS",
        message:"Course Added Successfully"
    })
})

module.exports = {
    ViewCourseLogs,
    getCourseCount,
    addCourseProcedure
};

