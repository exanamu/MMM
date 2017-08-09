var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = {
  username: 'fortice',
  password: '1111',
  displayName: 'Fortice'
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '14jk225ocvisdifaf@#!',
  resave: false,
  resave: true,
  saveUninitialized: true
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
    var pwd = password;
    if(users.username == uname && users.password == pwd){
      done(null, users);
      // req.session.displayName = username;
      // req.session.save(function(){
      //   res.redirect('/welcome');
      // })
    }
    else{
      done(null, false);
      //res.send('Who Are you??');
    }
    //User.findOne({ username: username }, function(rerr,user) {
      // if (err) { return done(err); }
      // if (!user) {
      //   return done(null, false, { message: 'Incorrect username.' });
      // }
      // if (!user.validPassword(password)) {
      //   return done(null, false, { message: 'Incorrect password.' });
      // }
      // return done(null, user);
    //});
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
/*module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
    done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    done(null, user); // 여기의 user가 req.user가 됨
  });

  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'id',
    passwordField: 'pwd',
    session: true, // 세션에 저장 여부
    passReqToCallback: false,
  }, (id, password, done) => {
    Users.findOne({ id: id }, (findError, user) => {
      if (findError) return done(findError); // 서버 에러 처리
      if (!user) return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 임의 에러 처리
      return user.comparePassword(password, (passError, isMatch) => {
        if (isMatch) {
          return done(null, user); // 검증 성공
        }
        return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
      });
    });
  }));
};
*/
