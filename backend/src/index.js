const express = require("express");
const dotenv = require("dotenv");
const db = require('./config/database')
const app = express();


require("dotenv").config();


const PORT = process.env.PORT || 4000;


db()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port : ${PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})