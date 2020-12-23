const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const authenticationMiddleware = require('./middleware');

const authenticationDataStore = require('./authentication-data-store');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

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
      const usernameLower = username.toLowerCase();

      findUser(usernameLower, (err, user) => {
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

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    username: 'username',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
  ((req, username, password, done) => {
    const usernameLower = username.toLowerCase();

    // Do any input validation
    // Ex: Check password and usernames match
    if (req.body['retype-username'].toLowerCase() !== usernameLower) {
      console.log('usernames do not match');
      return done(null, false);
    }
    if (req.body['retype-password'] !== password) {
      console.log('passwords do not match');
      return done(null, false);
    }

    // Validate the user doesn't exist
    findUser(usernameLower, async (err, user) => {
      if (user) {
        console.log(`User ${usernameLower} already exists`);
        return done(err);
      }
      // Register the user
      console.log(`Registering ${usernameLower}`);
      const passHash = await bcrypt.hash(password, salt);
      authenticationDataStore.registerUser(usernameLower, passHash);
      return done(null, { username: usernameLower });
    });

    return null;
  })));

  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports = initPassport;
