const express = require("express")
const app = express();
const http = require("http");
//
const server = http.createServer(app);


const { Server } = require("socket.io");



const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
 const getReceiverSocketId = (userId:string)  =>{
    return userSocketMap[userId]
  }
  //
  const userSocketMap: { [key: string]: string } = {};
  io.on("connection", (socket:any) => {
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id;
    //Send event emit socketio
    io.emit("getOnlineUser",Object.keys(userSocketMap))
    
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      delete userSocketMap[userId];
      io.emit("getOnlineUser",Object.keys(userSocketMap));
    });
  });
  export { io, app, server ,getReceiverSocketId};