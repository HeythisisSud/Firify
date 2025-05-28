const express = require("express")
const app= express()
const http=require("http");
const { Server }= require("socket.io")
const cors= require("cors")

app.use(cors())


const PORT = process.env.PORT || 3001;
const server= http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:process.env.PORT,
        methods:["GET","POST"],
    }
})

io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.id}`)

    socket.on("send_message", (d)=>{
        socket.broadcast.emit("receive_message", d)
    })
})

server.listen(port, '0.0.0.0', () => {
  console.log('Server is running on port 3001');
});
