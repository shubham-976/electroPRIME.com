//creating token for user(row or document for ehich this function is called) and saving in cookies and after that sending json response asusual

const tokenAndResponse = (user, statusCode, message, res)=>{
    const token = user.getJWTToken(); //userSchema method, we defined it with userSchema
    /*user refers to the user(row or documwnt) which is passed to his function, for which it was called */

    //options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    };
    res.status(statusCode).cookie("token", token, options).json({
        success:true,
        message:message,
        user:user,
        token:token
    })

}

module.exports = tokenAndResponse;