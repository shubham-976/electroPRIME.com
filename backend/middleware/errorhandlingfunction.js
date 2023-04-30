const { Error } = require("mongoose");
const ErrorHandler = require("../utils/errorhandler")

let errorHandlingFunction = (err, req, res, next)=>{
    err.message = err.message || "Internal Server Error"; //if message is not passed as parameter or some invalid message then use this message
    err.statusCode = err.statusCode || 500;  //if statusCode is not passed as parameter or some invalid statusCode then use this code

    //invalid mongodb id error (means certain require no. of digits not provided)
    if(err.name == "CastError"){
        const message = `Resource NOT found. Invalid : ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose duplicate key error (means field which is unique and more than one user enters same value for that field while registering)
    if(err.code == 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered, it should be unique.`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong jwt error
    if(err.name == "JsonWebTokenError"){
        const message = `Json web token is invalid.`;
        err = new ErrorHandler(message, 400);
    }

    //jwt expire error
    if(err.name == "TokenExpiredError"){
        const message = `Json web token is expired.`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message:err.message
    })
}

module.exports = errorHandlingFunction;