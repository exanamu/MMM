var express= require('express');
var router= express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/project/:room', function(req,res){
    res.render('project', {room:req.params.room});
});

module.exports= router;