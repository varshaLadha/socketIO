const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');

const {generateMessage,generateLocationMessage} = require('./utils/message')

const publicPath=path.join(__dirname,"../public");
const port=process.env.PORT || 3000;
var app=express();

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("new user connected");

	socket.on('join',(params,callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMsg',generateMessage('Admin','Welcome to chat app'));
        socket.broadcast.to(params.room).emit('newMsg',generateMessage('Admin',`${params.name} has joined`));

        callback();
    })

	socket.on('createMessage',(msg,callback) => {
        //console.log(msg)
        var user = users.getUser(socket.id);
        if(user && isRealString(msg.text)){
            io.to(user.room).emit('newMsg',generateMessage(user.name,msg.text));
        }

        callback('');
    });

    socket.on('createLocationMessage',(coords) => {
        var user=users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMsg',generateLocationMessage(user.name,coords.latitude,coords.longitude))
        }

    })

    socket.on('disconnect',() => {
        var user=users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMsg',generateMessage('Admin',`${user.name} has left`));
        }
        console.log("user disconnected")
    });
});

server.listen(port,()=>{
    console.log("Connected to server on "+port)
});