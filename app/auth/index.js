"use strict";

module.exports.ensureAuthenticated = function ensureAuthenticated(req, res, isApi, next) {
  if (req.isAuthenticated()) {
    return next();
  } else if (!isApi){
    res.redirect('/login');
  } else {
    res.send({ code: "You are not authorized to access this endpoint" });
  }
};