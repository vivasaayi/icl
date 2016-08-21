"use strict";

//Core
var path = require('path');
var util = require("util");

//Create the express app
var express = require('express');
var app = express();

//Middlewares
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');

//Authentication Middlewares
var session = require('express-session');
var passport = require("passport");
var LocalStrategy = require("passport-local");

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));  //1. Serve the static files
app.use(cookieParser());            //2. Cookie Parse
app.use(bodyParser({ limit: '3mb' }));
app.use(bodyParser.json());         //3. JSON Body Parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //4. for parsing application/x-www-form-urlencoded
app.use(multer({ dest: './uploads/' })); //5. for handling file uploads

//Our Modules
var databaseHelper = require("dal");
var appConfig = require("./app/config");
var logger = require("./app/utils/logger");
var schemaService = require('./app/services/schema-service');
var dataService = require("./app/services/user-data-service");
var staticContentHelper = require("./app/services/static-content-helper");
var promiseService = require("./app/services/promise-service");
var CaptchaService = require("./app/services/captcha-service");
var indexController = require("./app/controllers/index-controller");
var RegistrationController = require("./app/controllers/registration-controller");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var controllers = require("./app/controllers")(app);
var fs = require("fs");

var regController = new RegistrationController();
var captchaService = new CaptchaService();

var validateUser = function (username, password, done) {
  dataService.loadBySimpleQuery("users", "userName", username, function (err, user) {
    if (err) {
      logger.info("Error authenticating user:" + JSON.stringify(err));
      return done(err);
    }
    if (!user) {
      logger.info("Incorrect user name:" + username)
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
      logger.info("Incorrect Password:" + username);
      return done(null, false, { message: 'Incorrect password.' });
    }

    logger.info("User authenticated:" + username);
    return done(null, user);
  });
};

passport.use(new LocalStrategy(validateUser));

var desrializeUserCallBack = function (object, done) {
  done(null, object);
};

var serializeUserFunction = function (user, done) {
  done(null, user);
};

passport.serializeUser(serializeUserFunction);
passport.deserializeUser(desrializeUserCallBack);

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.get('/', function (req, res) {
  return indexController.render(req, res);
});

app.get('/login', function (req, res) {
  logger.info("Login Requested");
  res.render('login', { layout: false, recaptcha_form: captchaService.getCaptchaForm() });
});

app.get('/uploadedimages/:id', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'image/png' });
  promiseService.fetchPromise(req.params.id, function (err, data) {
    if (err) {
      res.send("Error");
    }
    else {
      console.log("Converting image data");
      var base64Data = data.replace(/^data:image\/png;base64,/, "");
      var buffer = new Buffer(base64Data, "base64");
      res.end(buffer, "binary");
    }
  });
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/admin');
  }
);

app.get('/logout', function (req, res) {
  logger.info("Logout Requested");
  req.logout();
  res.redirect('/');
});

app.get('/registerchurch', ensureAuthenticated, function (req, res) {
  res.render('registerchurch', { layout: false, recaptcha_form: captchaService.getCaptchaForm() });
});

app.post('/registerchurch', ensureAuthenticated, function (req, res) {
  var data = {
    remoteip: req.connection.remoteAddress,
    challenge: req.body.recaptcha_challenge_field,
    response: req.body.recaptcha_response_field
  };
  var recaptcha = new Recaptcha(appConfig.captcha.publicKey, appConfig.captcha.privateKey, data);

  recaptcha.verify(function (success, error_code) {
    if (success) {
      res.send({ state: "success" });
    }
    else {
      res.send({ state: "Failure" });
    }
  });
});

app.get('/registeruser', function (req, res) {
  res.render('registeruser', {
    flash: req.flash("error")[0],
    layout: false,
    recaptcha_form: captchaService.getCaptchaForm()
  });
});

app.post("/registeruser", regController.registerUser);

app.get('/admin', ensureAuthenticated, function (req, res) {
  res.render('admin', { layout: false });
});


app.get('/main', function (req, res) {
  res.render('home');
});

app.get('/main/:term', staticContentHelper.render);
app.get('/main/:term/:id', staticContentHelper.renderItem);

app.get('/schemas/:id', schemaService.getSchema);

app.get('/data/:schema', dataService.loadSummary);
app.get('/data/lyrics/search/:term', dataService.searchLyrics);

app.get('/data/:schema/:term', dataService.load);
app.post('/data/:schema/:term', dataService.save);
app.delete('/data/:schema/:term', dataService.removeFromCollection);
app.delete('/data/id', dataService.remove);

function listImages(req, res) {
  fs.readdir("./public/images/promises/", function (err, files) {

    var data = {
      files: []
    };

    var start = parseInt(req.params.start);

    if (!err && files && files.length > 0 && start < files.length) {
      data.files = files.slice(start, start + 9);
    }

    res.writeHead(200, { 'content-type': 'application/json' });
    res.write(JSON.stringify(data));
    res.end();
  });
}

app.get("/images/promises/:start", listImages)

app.get('/events', function (req, res) {
  res.render('events');
});

app.post('/events', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.write('received upload:\n\n');
  res.end();
});

databaseHelper.startMongo(appConfig.db, function (err, db) {
  if (err) {
    console.error("Error Starting Mongo..");
    console.dir(err);
    console.error("Exiting...");
  }
  else {
    logger.info("Successfully connected to Database... Starting Node...");
    var port = appConfig.node.port;
    app.listen(port);
    logger.info("Listening for connections in port:" + port);
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}