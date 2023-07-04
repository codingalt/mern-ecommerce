const http = require('http')
const { Server } = require('socket.io')
const app = require('./app');
const cloudinary = require("cloudinary");
const PORT = process.env.PORT || 4000;
const connectDatabase = require("./config/database");

// handling uncaught exception
process.on("uncaughtException", (error)=>{
    console.log(`Error: ${error.message}`);
    console.log("Sutting down the server due to uncaughtException")

    process.exit(1);
})

// config
if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config({path: "backend/config/config.env"});
}
// connecting to database
connectDatabase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.get("/", (req, res) => {
  res.send("API is Running Successfully.");
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
const users = [];
io.on('connection', (socket)=>{
    socket.on('disconnect', ()=>{
        const user = users.find((x) => x.socketId === socket.id);
        if(user){
            user.online = false;
            console.log('Offline', user.name);
            const admin = users.find((x) => x.isAdmin && x.online);
            if(admin){
                io.to(admin.socketId).emit('updateUser', user);
            }
        }
    });
    socket.on('onLogin', (user) => {
        const updatedUser = {
            ...user,
            online: true,
            socketId: socket.id,
            messages: [],
        }
        const existUser = users.find((x) => x._id === updatedUser._id);
        if(existUser){
            existUser.socketId = socket.id;
            existUser.online = true;
        }else{
            users.push(updatedUser);
        }
        console.log('Online', user.name)
        const admin = users.find((x) => x.isAdmin && x.online);
        if(admin){
            io.to(admin.socketId).emit('updatedUser', updatedUser);
        }
        if(updatedUser.isAdmin){
            
            io.to(updatedUser.socketId).emit('listUsers', users)
        }
    })
    socket.on('onUserSelected', (user) => {
        const admin = users.find((x) => x.isAdmin && x.online);
        if(admin){
            const existUser = users.find((x) => x._id === user._id);
            io.to(admin.socketId).emit('selectedUser', existUser);
        }
    })
    socket.on('onMessage', (message) => {
        // console.log('message ', message)
        if(message.isAdmin){
            const user = users.find((x) => x._id === message._id && x.online);
            if(user){
                io.to(user.socketId).emit('message', message);
                user.messages.push(message);
            }
        }else{
            const admin = users.find((x) => x.isAdmin && x.online);
            if(admin){
                io.to(admin.socketId).emit('message', message)
                const user = users.find((x) => x._id === message._id && x.online);
                user.messages.push(message);
            }else{
                io.to(socket.id).emit('message', {
                    name: 'Admin',
                    body: 'Sorry, I am not online right now',
                })
            }
        }
    })
})
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
// const server = app.listen(process.env.PORT, ()=>{
//     console.log(`Server is running on http://localhost:${process.env.PORT}`);
// })

// handling promise rejection
process.on("unhandledRejection", (error)=>{
    console.log(`Error: ${error.message}`);
    console.log("Sutting down the server due to Unhandled Promise Rejection")

    server.close(()=>{
        process.exit(1);
    })
})












// const app = require('./app');
// const dotenv = require('dotenv');
// const cloudinary = require("cloudinary");
// const connectDatabase = require("./config/database");

// // handling uncaught exception
// process.on("uncaughtException", (error)=>{
//     console.log(`Error: ${error.message}`);
//     console.log("Sutting down the server due to uncaughtException")

//     process.exit(1);
// })

// // config
// dotenv.config({path: "backend/config/config.env"});
// // connecting to database
// connectDatabase();
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })

// const server = app.listen(process.env.PORT, ()=>{
//     console.log(`Server is running on http://localhost:${process.env.PORT}`);
// })

// // handling promise rejection
// process.on("unhandledRejection", (error)=>{
//     console.log(`Error: ${error.message}`);
//     console.log("Sutting down the server due to Unhandled Promise Rejection")

//     server.close(()=>{
//         process.exit(1);
//     })
// })