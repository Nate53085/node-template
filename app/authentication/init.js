const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const authenticationMiddleware = require('./middleware');

const authenticationDataStore = require('./authentication-data-store');

function findUser(username, callback) {
  const user = authenticationDataStore.getUser(username);
  if (user != null && username === user.username) {
    return callback(null, user);
  }
  return callback(null);
}

passport.serializeUser((user, cb) => {
  cb(null, user.username);
});

passport.deserializeUser((username, cb) => {
  findUser(username, cb);
});

function initPassport() {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done(err);
        }

        // User not found
        if (!user) {
          console.log('User not found');
          return done(null, false);
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.passHash, (error, isValid) => {
          if (error) {
            return done(error);
          }
          if (!isValid) {
            return done(null, false);
          }
          return done(null, user);
        });

        return null;
      });
    },
  ));

  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports = initPassport;
