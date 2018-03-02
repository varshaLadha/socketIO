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

	socket.emit('newMsg',{
		from:"Admin",
		text:"Welcome to chat app",
		createdAt:new Date().getTime()
	});
	
	socket.broadcast.emit('newMsg',{
		from:"Admin",
		text:"New user joined",
		createdAt:new Date().getTime()
	})	
      socket.on('createMessage',(msg) => {
        console.log(msg)
		io.emit('newMsg',{
			from:msg.from,
			text:msg.text,
			createdAt:new Date().getTime()
		})
		  
//		socket.broadcast.emit('newMsg',{
//			from:msg.from,
//			text:msg.text,
//			createdAt:new Date().getTime()
//		})	//sends message to everyone except the person who creates or sends it
    });

    socket.on('disconnect',() => {
        console.log("user disconnected")
    });
});

server.listen(port,()=>{
    console.log("Connected to server on "+port)
});