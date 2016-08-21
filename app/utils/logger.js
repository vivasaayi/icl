var userDataRepository = require("../repositories/user-data-repository");
var moment = require("moment");

var Logger = function () {

};

Logger.prototype.info = function (info, callback) {
  console.log("INFO:", info);
  
  var logEntry = {
    level: "INFO", 
    data: info
  };

  this.logMessage(logEntry, callback);
};

Logger.prototype.debug = function (debug, callback) {
  console.log("DEBUG:", debug);

  var logEntry = {
    level: "DEBUG", 
    data: debug
  };
  
  this.logMessage(logEntry, callback);  
};

Logger.prototype.error = function (error, callback) {
  console.log("ERROR:", error);

  var logEntry = {
    level: "ERROR", 
    data: error
  };

  this.logMessage(logEntry, callback);
};

Logger.prototype.logMessage = function (logEntry, callback) {
  logEntry.time = moment().toDate();
  userDataRepository.save("_logs", logEntry, function () {
    if (callback) {
      callback(logEntry.data);
    }
  });
};

module.exports = new Logger();