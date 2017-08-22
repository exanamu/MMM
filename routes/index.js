var express= require('express');
var router= express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/chat/:room', function(req,res){
    res.render('chat', {room:req.params.room});
});

module.exports= router;