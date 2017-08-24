var socket= io('http://localhost:3001');

// parse room name
var room = document.location.href.split("project/").pop();

// enter room
socket.emit('joinRoom', {room: room});

// when has no room
socket.on('noRoom', function() {
    $('#msgbox').val('there are no room');
})

// chat
$('#msgbox').keyup(function(event) {
    if (event.which== 13) { // typing enter
        socket.emit('fromclient', {msg: $('#msgbox').val()});
        $('#msgbox').val('');
    }
});

// chat msg input
socket.on('toclient', function(data){
    console.log(data.msg);
    $('#msgs').append(data.msg+'<BR>');
});

// draw some
$('#drawContainer').append(new mojs.Shape({
    shape: 'circle',
    isShowStart: true,
    fill: 'black',
    property : 'stagger( start, step )'
}));

// SVG handle
addClickEvents();
function addClickEvents() {
    $('#text1').addEventListener('click', Clicked);
}

function Clicked(e) {
    alert('oops');
}