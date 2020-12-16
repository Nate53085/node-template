const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const authenticationMiddleware = require('./middleware');

// Generate Password
const saltRounds = 10;
const myPlaintextPassword = 'my-password';
const salt = bcrypt.genSaltSync(saltRounds);
const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt);

const testUser = {
  username: 'test-user',
  passwordHash,
  id: 1,
};

function findUser(username, callback) {
  if (username === testUser.username) {
    return callback(null, testUser);
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
        bcrypt.compare(password, user.passwordHash, (error, isValid) => {
          if (error) {
            return done(error);
          }
          if (!isValid) {
            return done(null, false);
          }
          return done(null, user);
        });

        console.log('Got here');
      });
    },
  ));

  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports = initPassport;
