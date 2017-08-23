var socket= io('http://localhost:3001');

socket.emit('showRoom');

$('#makeRoom').click(function() {
    socket.emit('makeRoom', $('#roomName').val());
    socket.emit('showRoom');
});

socket.on('showRoom', function(data){
    $('#chatroom').empty();

    var keys= Object.keys(data.rooms);

    for(var i=0; i< data.roomCount; i++) {
        $('#chatroom').append($('<button>').text(keys.shift()).click(function() {
            window.open('/project/'+$(this).text());
        }));  
    }
    console.log(data.roomCount);
});