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
  app.get('/login', renderWelcome);
  app.get('/profile', passport.authenticationMiddleware(), renderProfile);
  app.get('/register', renderRegister);
  app.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/login', // redirect to the secure profile section
    failureRedirect: '/register', // redirect back to the signup page if there is an error
  }));
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  }));
}

module.exports = initUser;
