var socket= io.connect('http://localhost:3001/chat'+'<%=room%>');

socket.emit('joinroom',{room:'<%=room%>'});

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

