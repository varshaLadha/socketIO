var socket = io();

socket.on('connect', function() {
    console.log("connected to server")
})

socket.on('disconnect', function(){
    console.log("server disconnected.")
});

socket.on('newMsg',function (msg) {
    console.log(msg)
    var li=jQuery('<li></li>');
    li.text(`${msg.from}: ${msg.text}`)

    jQuery('#messages').append(li);
})

// socket.emit('createMessage',{
//     from:"varsha",
//     text:"hello"
// }, function (data) {
//     console.log("acknowledged : ",data)
// })

jQuery('#message-form').on('submit',function (e) {
    e.preventDefault();
    socket.emit('createMessage',{
        from:'User',
        text:jQuery('[name=msgText]').val()
    }, function () {
        
    });
});