var socket= io('http://localhost:3001');

var room = document.location.href.split("chat/").pop();

socket.emit('joinroom', {room: room});

$('#msgbox').keyup(function(event) {
    if (event.which== 13) { // typing enter
        socket.emit('fromclient', {msg: $('#msgbox').val()});
        $('#msgbox').val('');
    }
});

socket.on('toclient', function(data){
    console.log(data.msg);
    $('#msgs').append(data.msg+'<BR>');
});
var para = document.location.href.split("?");
