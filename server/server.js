const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath=path.join(__dirname,"../public");
const port=process.env.PORT || 3000;
var app=express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("new user connected");

    socket.emit('newEmail', {       //emitting the custom event created newEmail	//socket.emit emits event to a single connection
        from:"varsha@yahoo.in",     // message from server to client				//io.emit emits event to all the connections
        text:"hello ",
        createAt: 123
    });
 
//    socket.emit('newMsg',{
//        from:"sweety",
//        text:"hii happy holi to you too"
//    });
//
//    socket.on('createEmail',(newEmail) => {     //message from client to server
//        console.log(newEmail)
//    });

    socket.on('createMessage',(msg) => {
        console.log(msg)
		io.emit('newMsg',{
			from:msg.from,
			text:msg.text,
			createdAt:new Date().getTime()
		})
    });

    socket.on('disconnect',() => {
        console.log("user disconnected")
    });
});

server.listen(port,()=>{
    console.log("Connected to server on "+port)
});