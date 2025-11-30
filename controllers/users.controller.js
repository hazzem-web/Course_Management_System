const db = require("../DataBase/db");
const { validationResult } = require("express-validator");
const { SUCCESS, FAIL, ERROR } = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require("../utils/appError");
const bcrypt = require('bcryptjs');
const generateJWT = require("../utils/generateJWT");
const allowedTo = require("../middlewares/allowedTo");

// Get All Users - Admin Only
const getAllUsers = asyncWrapper(async (req, res, next) => {
    console.log("hello");
    console.log("req.body: " , req.body);
    console.log("req.user: " , req.user);
    const { role } = req.user; // assuming allowedTo middleware sets req.user
    if (role !== "ADMIN") return next(AppError.create("Unauthorized", 403, FAIL));

    const query = req.query;
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const offset = (page - 1) * limit;

    const [users] = await db.query(
        "SELECT user_ID AS id, First_Name AS firstName, Last_Name AS lastName, Email AS email, Role AS role, AVATAR AS avatar, created_at FROM Users LIMIT ? OFFSET ?",
        [limit, offset]
    );

    if (!users.length) {
        return res.status(200).json({ status: SUCCESS, data: { users: [] }, message: "No users found" });
    }
    res.status(200).json({ status: SUCCESS, data: { users } });
});

// Register User
const register = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(AppError.create(errors.array(), 400, FAIL));
    }

    const { firstName, lastName, email, password, role } = req.body;

    const [exists] = await db.query("SELECT * FROM Users WHERE Email = ?", [email]);
    if (exists.length > 0) {
        return next(AppError.create("User already exists", 400, ERROR));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
        "INSERT INTO Users (First_Name, Last_Name, Email, Password, Role) VALUES (?,?,?,?,?)",
        [firstName, lastName, email, hashedPassword, role || "USER"]
    );

    const token = await generateJWT({ email, id: result.insertId, role: role || "USER" });

    await db.query("UPDATE Users SET Token = ? WHERE user_ID = ?", [token, result.insertId]);

    res.status(201).json({
        status: SUCCESS,
        data: { user: { id: result.insertId, firstName, lastName, email, role: role || "USER", token } },
        message: "User Created Successfully"
    });
});

// Login User
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(AppError.create("Email Or Password Are Required", 400, ERROR));
    }

    const [users] = await db.query("SELECT * FROM Users WHERE Email = ?", [email]);
    if (!users.length) {
        return next(AppError.create("User Not Found", 404, ERROR));
    }

    const user = users[0];
        console.log("User from DB:", user);
        console.log("Password from request:", password);
        console.log("Password from DB:", user?.Password);

    const matchedPassword = await bcrypt.compare(password, user.Password);
    if (!matchedPassword) {
        return next(AppError.create("Password Incorrect", 400, ERROR));
    }

    const token = await generateJWT({ email: user.Email, id: user.user_ID, role: user.Role });

    // Optionally update token in DB
    await db.query("UPDATE Users SET Token = ? WHERE user_ID = ?", [token, user.user_ID]);

    res.status(200).json({
        status: SUCCESS,
        message: `Welcome ${user.First_Name} you are Logged In Successfully`,
        data: {
            token,
            user: { id: user.user_ID, email: user.Email, role: user.Role }
        }
        
    });
});

module.exports = {
    getAllUsers,
    register,
    login,
};
