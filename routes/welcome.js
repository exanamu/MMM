var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var assert = require('assert');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');

//var app = express();
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = [{
  username: 'fortice',
  password : 'shxRhT2oH31W6aaVc8VgMqsx9VUR3KqQTLO2nwR7lqpEsIHQS4eARggeG1OUpVNJotkzrXkrR3HwmqOTyz9Y608bU+QqvTa9NKuIjG0Km4txIC6XwBRG5ZecpKuHgSWhjwU+sWJsjsK72VoVJHYYOy5DnUa6jCg4kcyY6PU7sz8=',
  salt: '3xoDUlZU6JK64lbMcIWHwMNoFdwmQdIICrL1o1q4Qic9dTQkHvx7HMcy8Jg1FbAs3Wpsxe9Hi9x1PmkQq/UfbQ==',
  nickname: 'Fortice'
}];
var count = 1;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieSession({
  secret: '14jk225ocvisdifaf@#!',
  cookie: {maxAge: 1000},
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function(req, res, next){
  console.log(req.user);
  if(req.user) {
    console.log("login render~~");
    res.render('welcome_l',{
      _id : req.user.username,
      _name : req.user.nickname
    });
  }
  else{
    res.render('welcome');
  }
});

router.get('/register', function(req, res, next){
  res.render('register');
});

router.post('/register', function(req, res, next){
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
    // req.session._id = req.body.username;
    // req.session._name = req.body.nickname;
    // req.session.save(function(){
    //   console.log(req.session._id + " " + req.session._name);
    //   res.redirect('/auth');
    // });
    res.redirect('/auth');
  });
});

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/auth');
});

router.get('/login', function(req, res, next){
  res.render('login')
});

passport.serializeUser(function(user, done) { // Strategy 성공 시 호출됨
  console.log('serializeUser', user);
  done(null, user.username); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser(function(id, done) { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  console.log('deserializeUser', id);

  for(var i=0; i<users.length+1; i++){
    var user = users[i];
    if(user.username == id){
      console.log("find session... //deserializeUser");
      done(null, user);
    }
    else{
      console.log("can't find ..." + i);
      if(i == users.length - 1){
        done(null, {
          username : 'han',
          password : 'shxRhT2oH31W6aaVc8VgMqsx9VUR3KqQTLO2nwR7lqpEsIHQS4eARggeG1OUpVNJotkzrXkrR3HwmqOTyz9Y608bU+QqvTa9NKuIjG0Km4txIC6XwBRG5ZecpKuHgSWhjwU+sWJsjsK72VoVJHYYOy5DnUa6jCg4kcyY6PU7sz8=',
          salt: '3xoDUlZU6JK64lbMcIWHwMNoFdwmQdIICrL1o1q4Qic9dTQkHvx7HMcy8Jg1FbAs3Wpsxe9Hi9x1PmkQq/UfbQ==',
          nickname : 'fortice'
        });
      }
    }
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
));

router.post('/login',
passport.authenticate('local',{
        successRedirect: '/auth',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
));

module.exports = router;
