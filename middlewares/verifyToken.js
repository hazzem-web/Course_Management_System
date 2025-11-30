const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatusText");
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader) { 
        const error = appError.create("No Token Provided",401,ERROR);
        return next(error);
    }        
    const token = authHeader.split(' ')[1];
    try {
        const currentUser = jwt.verify(token , JWT_SECRET_KEY);
        req.user = currentUser // add a new property to the request object to store the current logged-in user, so it can be accessed in any route or middleware after verification
        next();
    } catch (err) {
        const error = appError.create("unAuthorized Access",401,ERROR);
        return next (error);
    }
}

module.exports = verifyToken;