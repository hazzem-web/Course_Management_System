const express = require('express');
const router = express.Router(); // import router from express
const {getAllUsers , register , login} = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const {ADMIN,MANAGER} = require("../utils/userRole")
const multer = require('multer'); // multer is a middleware for handling file uploads
const appError = require('../utils/appError');
const ERROR = require('../utils/httpStatusText');
const diskStorage = multer.diskStorage({ // to avoid saving images as a binary format and to control the storage of saving images
    destination: function(req,file,cb) { 
        console.log("file: ",file);
        cb(null , 'uploads');
    },
    filename: function(req,file,cb){ 
        const ext = file.mimetype.split('/')[1] //file extension
        const fileName = `user-${Date.now()}.${ext}`
        cb(null , fileName);
    }
})
const fileFilter = (req,file,cb)=>{
    const imageType = file.mimetype.split('/')[0];
    if (imageType === 'image') { 
        return cb(null , true);
    }
    else{
        return cb(appError.create('file must be an image', 400 , ERROR) ,false)
    }
}
const upload = multer({ 
    storage: diskStorage,
    fileFilter
})
// (CRUD)

  
router.route('/')
            .get(verifyToken , allowedTo(ADMIN , MANAGER) , getAllUsers)//Get All Users 

router.route('/register')
            .post(upload.single('avatar') , register) // userRegister

router.route('/login')
            .post(login)  // UserLogin

module.exports = router;

