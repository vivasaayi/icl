if (typeof exports === "object" && typeof module === "object") {
  var _ = require("underscore");
}

var validations = {
  registerUserFirstName: {
    fieldName: "First Name",
    required: true,
    minLength: 5,
    maxLength: 25,
    allowedCars: "alpha-spaces"
  },
  registerUserLastName: {
    fieldName: "Last Name",
    required: false,
    minLength: 5,
    maxLength: 25,
    allowedCars: "alpha-spaces"
  },
  registerUserEmail: {
    fieldName: "Email",
    required: true,
    isEmail: true
  },
  registerUserUserName: {
    fieldName: "User Name",
    required: false,
    minLength: 5,
    maxLength: 25,
    allowedCars: "password"
  },
  registerUserPassword: {
    fieldName: "Password",
    required: false,
    minLength: 5,
    maxLength: 25,
    allowedCars: "password"
  }
};


var Validator = function () {
  var validateRequired = function (value, options) {
    if (!value) {
      return options.fieldName + " is required.";
    }
  };
  
  var validateMinLength = function (value, options) {
    if (value.toString().length < options.minLength) {
      return options.fieldName + " should be atleast " + options.minLength + " chars.";
    }
  };
  
  var validateMaxLength = function (value, options) {
    if (value.toString().length > options.maxLength) {
      return options.fieldName + " should not exceed " + options.maxLength + " chars.";
    }
  };
  
  var validateInputChars = function (value, options) {
    var regex = "";
    var message = "";
    
    if (options.allowedCars === "alpha-spaces") {
      regex = /^[a-zA-Z\s]+$/;
      message = options.fieldName + " should contain letters and spaces only."
    } else if (options.allowedCars === "password") {
      var capitalLettersCount = 0;
      var smallLettersCount = 0;
      var specialCharsCount = 0;
      var numbersCount = 0;
      var invalidCharsCount = 0;
      
      _.each(value, function (char) {
        if (char >= "A" && char <= "Z") {
          capitalLettersCount++;
          return;
        }
        if (char >= "a" && char <= "z") {
          smallLettersCount++;
          return;
        }
        if (char >= "1" && char <= "9") {
          numbersCount++;
          return;
        }
        if (char === "$" || char === "#" || char === "@") {
          specialCharsCount++;
          return;
        }
        
        invalidCharsCount++;
      });
      
      if (invalidCharsCount > 1) {
        message = options.fieldName + " should contain letters, numbers and special chars($, #, @)."
        return message;
      } else if (numbersCount === 0) {
        message = options.fieldName + " should contain atleast one number."
        return message;
      } else if (capitalLettersCount === 0) {
        message = options.fieldName + " should contain atleast one Capital Letter."
        return message;
      } else if (smallLettersCount === 0) {
        message = options.fieldName + " should contain atleast one Small Letter."
        return message;
      }
      
      return;
    }
    
    if (!regex.test(value)) {
      return message;
    }
  };
  
  var validateEmail = function (value, options) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(value)) {
      return "You have entered an invalid email id";
    }
  };
  
  var pushMessage = function (messages, message) {
    if (message) {
      messages.push(message)
    }
  };
  
  var validateField = function (field, options, propertyValue) {
    var value = propertyValue || $(field).val();

    var messages = [], message;
    
    if (options.required) {
      message = validateRequired(value, options);
      pushMessage(messages, message);
    }
    
    if (options.minLength) {
      message = validateMinLength(value, options);
      pushMessage(messages, message);
    }
    
    if (options.maxLength) {
      message = validateMaxLength(value, options);
      pushMessage(messages, message);
    }
    
    if (options.allowedCars) {
      message = validateInputChars(value, options);
      pushMessage(messages, message);
    }
    
    if (options.isEmail) {
      message = validateEmail(value, options);
      pushMessage(messages, message);
    }
    
    return messages;
  };
  
  var compareFields = function (field1, field2, options, f1, f2) {
    var value1 = f1 || $(field1).val();
    var value2 = f2 || $(field2).val();
    var message;
    
    if (value1 !== value2) {
      message = options.message;
    }
    
    return message;
  };
  
  return {
    validations: validations,
    validateField: validateField,
    compareFields: compareFields
  };
};

if (typeof exports === "object" && typeof module === "object") {
  module.exports = new Validator();
} else {
  $.validator = new Validator();
}