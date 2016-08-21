var icl = (function () {
  
  var applyValidationStatus = function (target, status, doNotClear) {
    var messageDiv = $(target).siblings("#validation-message");
    
    if (!doNotClear) {
      messageDiv.html("");
    }
    
    if (status.length > 0) {
      $(target).attr("data-state", "error");
      
      var html = "";
      _.each(status, function (mes) {
        html += "<span class='fg-red'>" + mes + "</span> ";
      });
      
      messageDiv.html(html);

    } else {
      $(target).attr("data-state", "success");
    }
  };
  
  return {
    applyValidationStatus: applyValidationStatus
  };
})();

$("#firstName").on("change", function (event) {
  var status = $.validator.validateField(event.target, $.validator.validations.registerUserFirstName);
  icl.applyValidationStatus(event.target, status);
});

$("#lastName").on("change", function () {
  var status = $.validator.validateField(event.target, $.validator.validations.registerUserLastName);
  icl.applyValidationStatus(event.target, status);
});

$("#email").on("change", function () {
  var status = $.validator.validateField(event.target, $.validator.validations.registerUserEmail);
  icl.applyValidationStatus(event.target, status);
});

$("#username").on("change", function () {
  var status = $.validator.validateField(event.target, $.validator.validations.registerUserUserName);
  icl.applyValidationStatus(event.target, status);
});

$("#password1").on("change", function () {
  var status = $.validator.validateField(event.target, $.validator.validations.registerUserPassword);
  icl.applyValidationStatus(event.target, status);
});

$("#password2").on("change", function () {
  var status = $.validator.validateField(event.target, $.validator.validations.registerUserPassword);
  icl.applyValidationStatus(event.target, status);
  
  var comparisionResult = $.validator.compareFields($("#password1"), $("#password2"), { message : "Password fields should match" });
  if (comparisionResult) {
    icl.applyValidationStatus(event.target, [comparisionResult]);
  }
});