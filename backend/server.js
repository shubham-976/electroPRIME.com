const app = require("./app"); //this is actual main app file i.e. app.js
const connectDatabase = require("./database/database")
const cloudinary = require("cloudinary");

/*Handling Uncaught-Exception : Like/e.g. write console.log(xyz) where xyz is not defined
Then if we want to shut down our server intentionally in that case*/
process.on("uncaughtException", (err)=>{
    console.log(`Error occured : ${err.message}`)
    console.log("Shutting down the server due to Uncaught Exception.")
    process.exit(1);
})

//config
//when we are running it on local machine then we need our config file, but when its running in production then we will use heroku config file not this config file
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path:"backend/config/config.env"});
}

//connecting to database
connectDatabase()

//connecting to cloudinary
cloudinary.config({cloud_name:process.env.CLOUDINARY_NAME, api_key:process.env.CLOUDINARY_API_KEY, api_secret:process.env.CLOUDINARY_API_SECRET})

const port = process.env.PORT || 4000;
const server = app.listen(process.env.PORT, ()=>{
    console.log(`App Server is listening at http://localhost:${port}`)
})

/*Unhandled Promise-Rejection : Like/e.g. if unable to connect to mongodb due to some wrong mongodb link/url etc
Then if we want to shut down our server intentionally in that case*/
process.on("unhandledRejection", (err)=>{
    console.log(`Error occured : ${err.message}`)
    console.log("Shutting down the server due to Unhandled Promise-Rejection.")
    server.close(()=>{
        process.exit(1);
    })
})