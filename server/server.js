const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const publicPath=path.join(__dirname,"../public")
const port=process.env.PORT || 3000;
var app=express();

var server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket)=>{
    console.log("new user connected");

    socket.emit('newEmail', {       //emitting the custom event created newEmail
        from:"varsha@yahoo.in",     // message from server to client
        text:"hello ",
        createAt: 123
    });

    socket.emit('newMsg',{
        from:"sweety",
        text:"hii happy holi to you too"
    })

    socket.on('createEmail',(newEmail) => {     //message from client to server
        console.log(newEmail)
    })

    socket.on('createMessage',(msg) => {
        console.log(msg)
    })

    socket.on('disconnect',() => {
        console.log("user disconnected")
    })
})

server.listen(port,()=>{
    console.log("Connected to server on "+port)
})