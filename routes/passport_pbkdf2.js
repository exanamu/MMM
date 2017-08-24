var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var assert = require('assert');
var opts = {
  password : "want" // 암호화하고싶은 패스워드
}
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = {
  username: 'fortice',
  password: '',
  displayName: 'Fortice'
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '14jk225ocvisdifaf@#!',
  resave: false,
  saveUninitialized: true.
  store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName) {
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else{
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Loogin</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});
app.post('/auth/register', function(req, res){
  hasher({passowrd:req.body.password}, function(err, pass, salt, hash){
    var user = {
      id : req.body.id,
      password : hash,
      salt:salt,
      displayName : req.body.displayName
    };
    user.push(user);
    req.session.displayName = req.body.displayName;
    req.session.save(function(){
      res.redirect('/welcome');
    });
  });
});
app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/welcome');
});
app.get('/auth/login', function(req, res){
  var output=`
  <form action="/auth/login" method="post">
    <h1> Login Test </h1>
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placehoder = "password">
    </p>
    <p>
      <input type="submit" name="submit" value="제출하기">
    </p>
  </form>
  `;
  res.send(output);
})
passport.serializeUser(function(user, done) { // Strategy 성공 시 호출됨
  console.log('serializeUser', user);
  done(null, user.username); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser(function(id, done) { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  console.log('deserializeUser', id);
  if(users.username == id){
    done(null, users);
  }
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    var uname = username;
    var pwd = md5(password + users.salt);
    if(users.username == uname){
      return hasher(opts, function(err, pass, salt, hash){
        // pass : 비밀번호 , salt : 섞는 값, hash : 암호화 후 비밀번호
        // if(users.password == hash){
        //   req.session.displayName = users.displayName;
        //   req.session.save(function(){
        //     req.redirect('/welcome');
        //   })
        // } else{
        //   res.send('Who are you')
        // }
      });
      done(null, users);
    }
    else{
      done(null, false);
    }
    done(null, false);
  }
))
app.post('/auth/login',
passport.authenticate('local',{
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
))

app.listen(3003, function(){
  console.log('Connected 3003 session');
});
