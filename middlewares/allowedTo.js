const appError = require("../utils/appError");
const {ERROR} = require("../utils/httpStatusText")
module.exports = (...roles)=> { 
    console.log("roles: " , roles)
    return (req,res,next)=>{
        const userRole = req.user.role 
        if (!roles.includes(userRole)) { 
            return next(appError.create("you don't have premission to access this you are not admin" , 401 , ERROR));
        }
        next();
    }
}