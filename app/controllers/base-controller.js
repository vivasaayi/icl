"use strict";

var auth = require("../auth");

var BaseController = function () {
};

BaseController.prototype.ensureAuthenticated = function (req, res, next) {
  return auth.ensureAuthenticated(req, res, false, next);
};

BaseController.prototype.ensureApiAuthenticated = function (req, res, next) {
  return auth.ensureAuthenticated(req, res, true, next);
};

module.exports = BaseController;