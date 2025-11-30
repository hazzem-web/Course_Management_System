const express = require("express");
const router = express.Router();
const {ViewCourseLogs,getCourseCount,addCourseProcedure} = require("../controllers/AdvancedDatabase.controller");
// GET all course logs
router.get("/trigger", ViewCourseLogs);
router.get("/function",getCourseCount);
router.post("/procedure",addCourseProcedure);
module.exports = router;
