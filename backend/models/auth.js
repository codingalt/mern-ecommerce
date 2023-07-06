const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser= catchAsyncErrors(async (req, res, next)=>{
    // const {token} = req.cookies;
    // Retrieve token from session storage
    const token = window.sessionStorage.getItem('token');

    console.log('Token---', token);
    if(!token){
        return next(new ErrorHandler("Please login to access this resourse", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    
    next();
})

exports.autherizeRoles = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }

        next();
    }
}