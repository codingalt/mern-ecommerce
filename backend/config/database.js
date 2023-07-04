const mongoose = require("mongoose");

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI, {
        dbName: "ecommerce"
    }).then((data)=>{
        console.log(`mongodb connected with server: ${data.connection.host}`);
    })
}
mongoose.set('strictQuery', true);
module.exports = connectDatabase