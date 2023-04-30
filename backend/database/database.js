const mongoose = require("mongoose");
mongoose.set('strictQuery', true); //new version of mongoose was demanding such line by giving warning

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI).then((data)=>{
        console.log(`Mongodb connected with server : ${data.connection.host}`)
    })
}

module.exports = connectDatabase;