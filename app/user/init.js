const passport = require('passport');

function renderWelcome(req, res) {
  res.render('user/welcome');
}

function renderProfile(req, res) {
  res.render('user/profile', {
    username: req.user.username,
  });
}

function renderRegister(req, res) {
  res.render('user/register');
}

function initUser(app) {
  app.get('/', renderWelcome);
  app.get('/profile', passport.authenticationMiddleware(), renderProfile);
  app.get('/register', renderRegister);
  // app.post('/register', passp)
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/',
  }));
}

module.exports = initUser;
