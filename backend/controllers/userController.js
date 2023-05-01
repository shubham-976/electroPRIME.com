const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler")
const asyncErrorHandlingFunction = require("../middleware/catchasyncerrors");
const tokenAndResponse = require('../utils/jwtToken')
const sendEmailToUser = require("../utils/sendEmail.js");
const crypto = require('crypto');
const cloudinary = require("cloudinary");

//Register user (account creation of a user)
exports.registerUser = asyncErrorHandlingFunction(async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {folder:"avatars",width:150,crop:"scale"});

    const {name,email,password} = req.body;
    const user = await User.create({name,email,password,avatar:{public_id:myCloud.public_id, url:myCloud.secure_url}}); //added to database

    const websiteURL = 'https://electroprime-onlinestore.onrender.com';
    const message = `Dear ${name}, \n\nThankyou for registering on electroPRIME.com (an exclusive Electronics store) : \n\nWe offer a very vast varieties/categories of electronics products and that's too at best possible inbudget prices. Visit our website and grab the best deals as per your requirement. \nVisit : ${websiteURL} \n\n\n--Thankyou for using electroPRIME.com\n--Admin of electroPRIME`;
    try{
        await sendEmailToUser({
            email:user.email, //isi user ko hme mail bhejni hai, 
            subject:`${name}! Welcome to electroPRIME`,
            message
        });
        tokenAndResponse(user, 201, "User Registered/Account created successfully", res);                               //create token save in cookies, also send json response asusual
    }
    catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
})

//Login User (user already has account, just login)
exports.loginUser = asyncErrorHandlingFunction(async (req, res,next)=>{
    const {email, password} = req.body;
    //check if user has entered both things or not
    if(!email || !password){
        return next(new ErrorHandler("Please enter Email and Password", 400));              //when next() has some argument, it means an errorHandler will be called that we used in app.js
    }
    //means both things are provided
    const user = await User.findOne({email:email}).select("+password")                      //if such email is found, then user var will contain all fields of that except password, becoz in UserSchema we did selecl:false for password, but here along with other fields we need to get password field als,o so we have to write specifically select("+password")
    //if user with such email not found
    if(!user){
        return next(new ErrorHandler("Invalid email or password."));
    }
    //means user with such email exists

    //we cannot directly match passord entered by user to the password stored in db, becoz in db hash-code of password is stored not the password itself
    const isPasswordMatching = await user.comparePasswordFunc(password);                   //'password' is entered by user
    //if password not matching
    if(!isPasswordMatching){
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    //means password matched, now allow login
    
    tokenAndResponse(user, 201, "User logged in Successfully", res);                       //create token save in cookies and asusual send json response
})

//Logout User
exports.logout = asyncErrorHandlingFunction(async(req,res,next)=>{

    //means current user ke browser ki cookie me 'token' keyword ke value ko 'null' krdo (means token value over) ans isi waqt cookie ko expire krdo. 
    res.cookie("token", null, {expires:new Date(Date.now()), httpOnly:true})

    res.status(200).json({
        success:true,
        message:"Logged Out Successfully."
    })
})

//Forgot Password : means user ko password reset krne wala email bhejna hai jispe jake wo password reset kr ske
exports.forgotPassword = asyncErrorHandlingFunction(async (req, res, next)=>{

    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found.", 404));
    }

    //get the reset-password-token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false}); //saving 2 fields in getResetPasswordFunction()

    //this below url on clicking will take us to a frontend page : 
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Dear ${user.name}, \n\n To reset your Password click the URL : \n\n ${resetPasswordUrl} \n\n If you have not requested such activity then PLEASE IGNORE.\n\n\n--Thankyou for using electroPRIME.com\n--Admin of electroPRIME`;

    try{
        await sendEmailToUser({
            email:user.email, //isi user ko hme mail bhejni hai, 
            subject:`electroPRIME.com : Your account password Recovery`,
            message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} , for password recovery.`
        })
    }
    catch(error){
        //unset the 2 fields which we set by calling getResetPasswordToken() function and then saved
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message, 500));
    }
})
//Reset Password (in continue to forgetPassword): jb user forget password krne ke baad  aye hue mail wale url pe jayega and newPassword, ConfrimNewPassword dalke put request bhejega to below function call hoga
exports.resetPassword = asyncErrorHandlingFunction(async (req, res, next)=>{
    // ye call se pehle, must isse upar wala function call kiya gyahoga taaki resetPasswordToken and resetPasswordTokenExpire se kiye gye honge us user ke liye

    //creating token hash so that we can find user becoz in user document hased resetPasswordToken is stored not the org
    const resetPasswordToken_obtained = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({resetPasswordToken: resetPasswordToken_obtained, resetPasswordTokenExpire:{$gt: Date.now()}}); //agar 15 min se jyada hue to user milega hi nhi becoz of value resetTokenPasswordExpire value we set earlier

    //if no user found or time passed more than 15 min of clicking forgotPassword 
    if(!user){
        return next(new ErrorHandler("resetPasswordToken is invalid or has been expired (more than 15 min of clicking Forgot Password", 400));
    }
    //its ok, user found and still less than 15 min passsed after clicking forgotpassword()

    if(req.body.newPassword != req.body.confirmNewPassword){
        return next(new ErrorHandler("newPassword does not matches with confirmNewPassword", 400));
    }

    //newPassword matches with confirmNewPassword
    user.password = req.body.newPassword; //before saving it will automatically has the password becoz of pre() method we declared with userSchema
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();

    //password change krne ke turant baad nya token cookie me save krdo is user ke liye
    tokenAndResponse(user, 200, "Password reset done successfully.", res);
})

//Get User details : to let user see their profile details
exports.getUserDetails = asyncErrorHandlingFunction(async (req,res,next)=>{
    //after authentication hi, ye function call hoga and if authentication hogya means user is currently registered/loggedIn, then req.user contains user row/document  due to line-17 in authentication.js
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })

})

//Update User Password
exports.updatePassword = asyncErrorHandlingFunction(async (req, res, next)=>{
    //obvs loggedin/registerdin user ke liye hi ye call kiya jayega and req.user will conatin current user row/document due to line-17 of authentication.js
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePasswordFunc(req.body.oldPassword); //req.body.oldPassword is entered by user
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is Incorrect.", 400));
    }
    //old password is correct

    if(req.body.newPassword !== req.body.confirmNewPassword){    //confirmNewPassword and newPassword are also entered by user
        return next(new ErrorHandler("newPassword doesn't matches with confirmNewPassword.", 400)); 
    }
    //both are matching

    user.password = req.body.newPassword; //it will be hashed auto due to pre function in user schema, before saving
    await user.save();

    tokenAndResponse(user, 200, "Password Updated Successfully", res);
})

//Update User Profile (let a user update his profile except password, becoz seperate function already defined above for password updation)
exports.updateProfile = asyncErrorHandlingFunction(async (req, res, next)=>{
    //obviously its for loggedin/registered user means authenticated so, req,user conatains that user row/document
    const newUserData = {name:req.body.name, email:req.body.email};

    //avatar on hold, will handle later, handled and done
    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {folder:"avatars", width:150, crop:"scale"});
        
        newUserData.avatar = {
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {new:true, runValidators:true, useFindAndModify:false});

    res.status(200).json({
        success:true,
        message:"User Profile Updated successfully."
    })
})

//Get all Users details (--ADMIN only)
exports.getAllUsers = asyncErrorHandlingFunction(async (req, res, next)=>{
    const users = await User.find(); //get all rows/documnets as array

    res.status(200).json({
        success:true,
        totalUsers:users.length,
        users:users
    })
})
//Get Single User details (--ADMIN only)
exports.getSingleUser = asyncErrorHandlingFunction(async (req, res, next)=>{
    const user = await User.findById(req.params.id); //get specific user
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with id : ${req.params.id}`));
    }
    //means user present

    res.status(200).json({
        success:true,
        user:user
    })
})

//Update Role of a User -- (ADMIN only)
exports.updateUserRole = asyncErrorHandlingFunction(async (req, res, next)=>{
    
    const newUserData = {role:req.body.role}; //entered by admin, he can only update role of a user

    //means its a request for converting an admin to user and their is only 1 admin(himself) then don't allow this conversion becoz atleast one admin must be there
    const counts = await User.find({role:"admin"}).count();
    if(req.body.role==="user" && counts===1){
        return next(new ErrorHandler(`This role Change is NOT possible because atleast 1 Admin must be there.`));
    }

    let user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with id : ${req.params.id}`));
    }
    //means such user exist
    user = await User.findByIdAndUpdate(req.params.id, newUserData, {new:true, runValidators:true, useFindAndModify:false});

    res.status(200).json({
        success:true,
        message:"A user's role changed by admin successfully."
    })
})
//Delete a User -- (ADMIN only)
exports.deleteUser = asyncErrorHandlingFunction(async (req, res, next)=>{

    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with id : ${req.params.id}`));
    }
    //means such user exist, 

    //delete profile image of user from cloudinary
    const cloudImageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(cloudImageId);

    //delete the user itself from db
    await user.remove();

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})