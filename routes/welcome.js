var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var assert = require('assert');

var app = express();
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = [{
  username: 'fortice',
  password: '1111',
  nickname: 'Fortice'
}];
var count = 1;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(session({
  secret: '14jk225ocvisdifaf@#!',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));
router.use(passport.initialize());
router.use(passport.session());
router.get('/auth/register', function(req, res, next){
  res.render('register');
})
router.post('/auth/register', function(req, res, next){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    user = {
      username : req.body.username,
      password : hash,
      salt:salt,
      nickname : req.body.nickname
    };
    users.push(user);
    console.log(count + users[count].username);
    console.log("regist : " + user.password + " " + req.body.password);
    count++;
    req.session.nickname = req.body.nickname;
    req.session.save(function(){
      res.render('welcome');
    });
  });
});
router.get('/auth/logout', function(req, res, next){
  req.logout();
  res.render('welcome');
});
router.get('/auth/login', function(req, res, next){
  res.render('login')
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
    var pwd = password;
    for(i = 0; i < count; i++){
      console.log(i + "번째" + users[i].username + " and " + uname);
      if(users[i].username==uname){
        return hasher({password:pwd, salt:users[i].salt}, function(err, pass, salt, hash){
          // pass : 비밀번호 , salt : 섞는 값, hash : 암호화 후 비밀번호
          console.log(users[i].password + " " + hash);
          console.log(pwd + " " + pass);
          if(users[i].password == hash){
            console.log("login success");
            done(null, users[i]);
          }
        });
      }
    }
    done(null, false);
  }
))
router.post('/auth/login',
passport.authenticate('local',{
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
))

module.exports = router;
