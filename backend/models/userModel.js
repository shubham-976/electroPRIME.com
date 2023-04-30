const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please eneter your name"],
        maxLength:[30, "Name cannot exceed 30 characters"],
        minLength:[3,"Name should have atleast 3 characters"]
    },
    email:{
        type:String,
        required:[true, "Please enter your email"],
        unique:true,
        validate:[validator.isEmail, "PLease enter a valid email"]
    },
    password:{
        type:String,
        required:[true, "Please Enter Your Password"],
        minLength:[8, "Password should have atleast 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            reuired:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordTokenExpire:Date
})
userSchema.pre("save" , async function(next){                   //someSchema.pre is a DOCUMENT-middleware, with option='save', it means just ye document(row) save hone se pehle

    if(!this.isModified("password")){                           //like profile update ke waqt jab , password change na kra ho, mtlb abhi password me pehle wale password ka hash saved hai, aur wapas is password-ke hash ka hash nhi krna warna paasword wapas nhi milega , to is liye agar password change nhi hua to wala password ka hash hi save rehne do dobara password-hash ka hash nhi krna
        next();                                                 //means iske baad ki lines jo is pre function me likhi hain, execut na ho
    }

    this.password = await bcrypt.hash(this.password, 10);       //this refers to the "document"(row) of this schema 'jiske' save hone se just pehle ye pre-hook call hoga 
})
//JWT Tokens : When user registers/sign in, then a token is issued with some claims,so that user can use website and do specific things only after register/signin, and also token expires after some days then we need to again sign in
userSchema.methods.getJWTToken = function(){
    //mongoose itself assigns an "_id" characteristic to each document(means row , here user), while saving
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});                           //this refers to document(means row means a user)
}
//Compare Password
userSchema.methods.comparePasswordFunc = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);                                                        //means bcrypt ka inbuilt compare() method will match the entered password with this.password(this.password is the hashed-password stored, of user(means document or row) for which this method is called )
}
//generating Password-Reset-Token
userSchema.methods.getResetPasswordToken = function(){
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing resetToken and adding resetPasswordToken,resetPasswordTokenExpire fields of current document( ,eans this user for which it is called)
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordTokenExpire = Date.now() + 15*60*1000; //15 minutes from time of generation of this new token

    return resetToken;
}

module.exports = mongoose.model("User", userSchema)