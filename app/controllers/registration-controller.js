"use strict";

var util = require('util');
var BaseController = require("./base-controller");
var userRegistrationService = require("../services/user-registration-service");
var CaptchaService = require("../services/captcha-service");

var RegistrationController = function (app) {
  //app.get("/promises", this.ensureApiAuthenticated, this.getPromises);
  //app.post("/promises", this.ensureApiAuthenticated, this.savePromise);
  
  //app.get("/promises", this.getPromises);
  //app.post("/promises", this.savePromise);
};

util.inherits(RegistrationController, BaseController);

RegistrationController.prototype.registerUser = function (req, res) {
  var data = {
    remoteip: req.connection.remoteAddress,
    challenge: req.body.recaptcha_challenge_field,
    response: req.body.recaptcha_response_field
  };
  
  var captchaService = new CaptchaService();

  captchaService.verifyCaptcha(data, function (success, error_code) {
    if (success) {
      var user = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email: req.body.email,
        password1 : req.body.password1,
        password2 : req.body.password2,
        userName: req.body.username
      };
      
      userRegistrationService.registerUser(user, function (err) {
        if (err) {
          req.flash("error", err);
          res.redirect("/registeruser");
        } else {
          res.redirect('/login');
        }
      });
    } else {
      req.flash('error', { error: "Registration Failed. Are you really a human?", messages: ["You have entered invalid captcha."] });
      res.redirect("/registeruser");
    }
  });
};

module.exports = RegistrationController;
