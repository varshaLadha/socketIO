const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {isRealString} = require('./utils/validation')

const {generateMessage,generateLocationMessage} = require('./utils/message')

const publicPath=path.join(__dirname,"../public");
const port=process.env.PORT || 3000;
var app=express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("new user connected");

	socket.emit('newMsg',generateMessage('Admin','Welcome to chat app'));
	
	socket.broadcast.emit('newMsg',generateMessage('Admin','New user joined'));

	socket.on('join',(params,callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required');
        }

        callback();
    })

	socket.on('createMessage',(msg,callback) => {
        console.log(msg)
		io.emit('newMsg',generateMessage(msg.from,msg.text));
        callback('');
    });

    socket.on('createLocationMessage',(coords) => {
        io.emit('newLocationMsg',generateLocationMessage('Admin',coords.latitude,coords.longitude))
    })

    socket.on('disconnect',() => {
        console.log("user disconnected")
    });
});

server.listen(port,()=>{
    console.log("Connected to server on "+port)
});