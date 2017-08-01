var socket=io.connect('http://127.0.0.1:3001');

socket.emit('showRoom');

$('#makeRoom').click(function() {
    socket.emit('makeRoom', $('#roomName').val());
    socket.emit('showRoom');
});

socket.on('showRoom', function(data){
    $('#chatroom').empty();
    for(var i=0; i< data.roomCount; i++) {
        $('#chatroom').append($('<button>').text('room '+data.rooms.shift()));
    }
    console.log(data.roomCount);

    $('#chatroom').click(function() {
        window.open("/chat");
    })
});