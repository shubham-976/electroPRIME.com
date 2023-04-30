const express = require("express");
const app = express();
const errorHandlingFunction = require("./middleware/errorhandlingfunction")
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload");
const path = require("path");

//config
//when we are running it on local machine then we need our config file, but when its running in production then we will use heroku config file not this config file
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path:"backend/config/config.env"});
}

app.use(cookieParser()); //parenthesis very imp, :( , took 24 hrs to sort out this mistake, 
// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 5000000 }));
app.use(express.json());
app.use(fileUpload());

//importing all routes
/*Product related all-routes */
/*User related all routes */
/*Order related all routes */
/*Payment related all routes */
const product = require("./routes/productRoute");
const user = require("./routes/userRoute")
const order = require("./routes/orderRoute")
const payment = require("./routes/paymentRoute");
app.use("/api/v1", product); 
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

//joining this backend with frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
})


//When some error encountered, and next(ErrorHandler class object) is called, then below errorHandling function will be called.
app.use(errorHandlingFunction);

module.exports = app;