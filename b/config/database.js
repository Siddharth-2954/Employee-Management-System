const mongoose = require("mongoose")
require("dotenv").config()

exports.connect = () => {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/employee_management"
    
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to database successfully!")
    })
    .catch((err) => {
        console.error("Error connecting to database:", err.message)
        process.exit(1)
    })
}
