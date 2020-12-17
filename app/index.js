const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const favicon = require('serve-favicon');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

require('./authentication').init(app);

const insecureSession = {
  secret: 'keyboard cat',
  cookie: {},
  resave: false,
  saveUninitialized: false,
};
app.use(session(insecureSession));

app.use(passport.initialize());
app.use(passport.session());

app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname),
  partialsDir: path.join(__dirname),
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname));

app.get('/', (req, res) => {
  res.render('home', {
    id: req.params.id,
  });
});

app.use('/public', express.static(path.join(__dirname, 'public'))); // Serves resources from public folder

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

require('./user').init(app);
require('./portal').init(app);

module.exports = app;
