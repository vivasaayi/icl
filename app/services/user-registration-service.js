var userDataRepository = require("../repositories/user-data-repository");
var _ = require("underscore");
var validator = require("../../public/js/validator");

module.exports.registerUser = function (user, callback) {
  var messages = [];
  
  messages = messages.concat(validator.validateField(null, validator.validations.registerUserFirstName, user.firstName));
  messages = messages.concat(validator.validateField(null, validator.validations.registerUserLastName, user.lastName));
  messages = messages.concat(validator.validateField(null, validator.validations.registerUserEmail, user.email));
  messages = messages.concat(validator.validateField(null, validator.validations.registerUserUserName, user.userName));
  messages = messages.concat(validator.validateField(null, validator.validations.registerUserPassword, user.password1));
  
  var comparisionResult = validator.compareFields(null, null, { message : "Password fields should match" }, user.password1, user.password2);
  if (comparisionResult) {
    messages.push(comparisionResult);
  }

  if (messages.length > 0) {
    callback({ error: "Please provide valid details.", messages: messages });
  } else {
    var documentToSave = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      password: user.password1
    };
    
    userDataRepository.save("users", documentToSave, callback);
  }
};