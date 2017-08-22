var express= require('express');
var router= express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/chat', function(req, res, next) {
  res.render('chat');
});

app.get('/:room', function(req,res){
    console.log('room name is :'+req.params.room);
    res.render('chat', {room:req.params.room});
});

module.exports= router;