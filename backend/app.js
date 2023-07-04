const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require('path')

// config
if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config({path: "backend/config/config.env"});
}

const errorMiddleware = require("./middleware/error")

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route imports
const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes");
const payment = require("./routes/paymentRoutes")

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// at the end
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"))
})

// middleware for errors
app.use(errorMiddleware);

module.exports = app;