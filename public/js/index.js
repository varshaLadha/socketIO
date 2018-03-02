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

socket.on('newLocationMsg',function (msg) {
    var li=jQuery('<li></li>');
    var a=jQuery('<a target="_blank">My current location</a>')
    li.text(`${msg.from}: `);
    a.attr('href',msg.url);
    li.append(a);
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

    var msg=jQuery('[name=msgText]');
    socket.emit('createMessage',{
        from:'User',
        text:msg.val()
    }, function () {
        msg.val('')
    });
});

var locBtn=jQuery('#location');

locBtn.on('click', function () {
    if(!navigator.geolocation){
        return alert("Geolocation not available on your browser")
    }

    locBtn.attr('disabled','disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locBtn.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    }, function () {
        locBtn.removeAttr('disabled').text('Send location');
        alert('Unable to access loation')
    })
})