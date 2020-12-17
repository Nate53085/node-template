const passport = require('passport');

function initUser(app) {
  app.get('/portal', passport.authenticationMiddleware(), (req, res) => {
    res.render('portal/portal', {
      username: req.user.username,
    });
  });
}

module.exports = initUser;
