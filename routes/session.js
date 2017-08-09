var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '14jk225ocvisdifaf@#!',
  resave: false,
  saveUninitalized: true
}));
app.get('/count', function(req, res){
  if(req.session.count){
    req.session.count++;
  }
  else{
    req.session.count = 1;
  }
  res.send('h1 session');
  res.send('count : '+req.session.count);
});
app.post('/auth/login', function(req, res){\
  var user = { //나중 DB 내용
    username: 'fortice',
    password: '1111'
  };
  var username = req.body.username;
  var pwd = req.body.pwd;
  if(user.username == username && user.password == pwd){
    res.send('Hello Master');
  }
  else{
    res.send('Who Are you??');
  }
  res.send(req.body.username);
})
app.get('/auth/login', function(req, res){
  var output=`
  <form action="/auth/login" method="post">
    <h1> Login Test </h1>
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="pwd" placehoder = "pwd">
    </p>
    <p>
      <input type="subject" name="subject" value="제출하기">
    </p>
  </form>
  `;
  res.send(output);
})
app.listen(3003, function(){
  console.log('Connected 3003 session');
});
