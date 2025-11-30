// =======================================================
//                 MAIN SERVER FILE
// =======================================================

// import packages
const express = require("express");
const app = express();
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const { ERROR } = require("./utils/httpStatusText");

// =======================================================
//             DATABASE CONNECTION (MySQL)
// =======================================================
const db = require('./DataBase/db'); 

db.getConnection()
    .then(() => console.log("MySQL Database Connected "))
    .catch((err) => {
        console.error("MySQL Connection Error  ", err.message);
        process.exit(1);
    });

// =======================================================
//                 MIDDLEWARES
// =======================================================


app.use(cors());


app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================================================
//                 ROUTERS
// =======================================================
const coursesRouter = require('./Routes/courses.route'); // Routes الخاصة بالكورسات
const usersRouter = require('./Routes/users.route');     // Routes الخاصة باليوزرز
const AdvancedDatabase = require('./Routes/AdvancedDatabase.route')
app.use('/api/courses', coursesRouter); // أي request يبدأ بـ /api/courses هيروح للـ coursesRouter
app.use('/api/users', usersRouter);     // أي request يبدأ بـ /api/users هيروح للـ usersRouter
app.use('/api',AdvancedDatabase)
// =======================================================
//           HANDLING UNKNOWN ROUTES
// =======================================================

app.use((req, res) => {
    return res.status(404).json({
        status: ERROR,
        message: "This Resource Is Not Available"
    });
});

// =======================================================
//           GLOBAL ERROR HANDLER
// =======================================================

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || ERROR,
        message: error.message,
        code: error.statusCode,
        data: null
    });
});

// =======================================================
//               START THE SERVER
// =======================================================
app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});
