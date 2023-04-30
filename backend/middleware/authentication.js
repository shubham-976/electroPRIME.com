const asyncErrorHandlingFunction = require("../middleware/catchasyncerrors");
const ErrorHandler = require("../utils/errorhandler");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


//To Make sure, User is registered or signed in
exports.isUserAuthenticated = asyncErrorHandlingFunction(async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token){ //no token, means no cookie saved, means user not registered or not logged in
        return next(new ErrorHandler("Please Login to access this resource.", 401)); //next(with argument) means errorHandler called, other function after this function in,  router.route("url").get/post/anything(ye_wala_function, other function), will not be called now
    }
    //means,token found, means cookie saved, user is registered or logged in
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next(); //next() without argument, means other function after this function will be called in router.route("url").get/post/anything(ye_wala_func, other_function) 

})
//To Make sure, this User's-Role is allowed/authorized to do or not
exports.isUserRoleAuthorized = (...allowedRoles)=>{
    return (req,res,next)=>{
        //if this user's role is not in the allowed roles, means next(with arg) means other function after this will NOT be called, in router.route().get/put(ye_wala_func,f1, f2)
        if(!allowedRoles.includes(req.user.role)){ //"user" means document/row we fetched using id , in above function during checking authentication, "role" is an actual field of this 'user' as we defined in userSchema
            return next(new ErrorHandler(`Role as '${req.user.role}' is not allowed to access this resource.`, 403));
        }
        //means this user's role is in allowed role
        next(); //next() without argument means other function after this will be called, in router.route().get/put(ye_wala_func,f1, f2)
    }
}
