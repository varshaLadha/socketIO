var socket = io();

function scrollToBoottom() {
    var messages = jQuery('#messages');
    var newmsg = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop=messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newmsgh = newmsg.innerHeight();
    var lstmsg=newmsg.prev().innerHeight();
    if(clientHeight+scrollTop+newmsgh+lstmsg>=scrollHeight){
        //console.log("Should scroll");
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    console.log("connected to server")
})

socket.on('disconnect', function(){
    console.log("server disconnected.")
});

socket.on('newMsg',function (msg) {
    var formattedTime=moment(msg.createdAt).format('h:mm a');
    var template = jQuery('#messageTemplate').html();
    var html=Mustache.render(template,{
        text:msg.text,
        from:msg.from,
        createdAt:formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBoottom();
})

socket.on('newLocationMsg',function (msg) {
    var formattedTime=moment(msg.createdAt).format('h:mm a');
    var template = jQuery('#locationTemplate').html();
    var html=Mustache.render(template,{
        from:msg.from,
        url:msg.url,
        createdAt:formattedTime
    })

    jQuery('#messages').append(html);
    scrollToBoottom();
})

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