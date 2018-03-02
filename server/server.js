const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message')

const publicPath=path.join(__dirname,"../public");
const port=process.env.PORT || 3000;
var app=express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("new user connected");

	socket.emit('newMsg',generateMessage('Admin','Welcome to chat app'));
	
	socket.broadcast.emit('newMsg',generateMessage('Admin','New user joined'))
      socket.on('createMessage',(msg) => {
        console.log(msg)
		io.emit('newMsg',generateMessage(msg.from,msg.text))
		  
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