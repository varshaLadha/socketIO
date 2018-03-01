var socket = io();

socket.on('connect', function() {
    console.log("connected to server")

    socket.emit('createEmail',{
        to:"sachin@gmail.com",
        text:"email from varsha"
    });

    socket.emit('createMessage',{
        from:"varsha ladha",
        message:"hello happy holi"
    })
})

socket.on('disconnect', function(){
    console.log("server disconnected.")
});

socket.on('newEmail', function (email) {        //creating custom event newEmail
   console.log("new email",email);
});

socket.on('newMsg',function (msg) {
    console.log(msg)
})