var userDataRepository = require("../repositories/user-data-repository");
var _ = require("underscore");
var utils = require("../utils/utils.js");
var moment = require("moment");
var logger = require("../utils/logger");

var PromiseService = function () {

};

PromiseService.prototype.getDefaultPromise = function () {
  var promise = {
    promise: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
    book: "Isaiah",
    chapter: "40",
    verse: "10",
    bookStoreValue: "isaiah"
  };
  return promise;
}

PromiseService.prototype.getTodaysPromise = function (callback) {
  var self = this;
  var dateString = moment().format('YYYY-MM-DD');

  console.log(dateString)

  userDataRepository.loadBySimpleQuery("PROMISES", "DATE", dateString, function (err, result) {
    var promise;

    if (err) {
      console.log("Error occured when fetching the promise");
      console.dir(err);
    }
    else {
      promise = result;
    }

    if (!promise) {
      promise = self.getDefaultPromise();
    }

    var currentDate = moment();

    var result = {
      promise: promise.VERSETEXT,
      book: promise.BOOK,
      chapter: promise.CHAPTER,
      verse: promise.VERSE,

      more: "http://biblehub.com/" + promise.bookStoreValue + "/" + promise.CHAPTER + "-" + promise.VERSE + ".htm"
    };

    console.log(result)

    callback(null, result);
  });
}

var processBookStoreValue = function (bookName) {
  var bookNameStoreValue = bookName.toLowerCase().replace(/ /g, "_");

  if (bookNameStoreValue === "songs_of_solomon") {
    bookNameStoreValue = "songs";
  }

  return bookNameStoreValue;
};

module.exports.fetchPromise = function (id, callback) {
  userDataRepository.loadById("promises", id, function (err, data) {
    console.log("Promise Fetched");
    if (err) {
      return callback(err, null);
    }
    callback(null, data.image);
  });
};

module.exports.processBookStoreValue = processBookStoreValue;

module.exports.createPromise = function (promiseDetails, next) {
  if (_.isEmpty(promiseDetails)) {
    logger.error("You should pass Promises object", next);
    return;
  }

  if (_.isEmpty(promiseDetails.book)) {
    logger.error("Book Name should not be empty", next);
    return;
  }

  if (!_.isNumber(promiseDetails.chapter)) {
    logger.error("Chapter should not be empty", next);
    return;
  }

  if (!_.isNumber(promiseDetails.verse)) {
    logger.error("Verse should not be empty", next);
    return;
  }

  if (_.isEmpty(promiseDetails.text)) {
    logger.error("Verse Text should not be empty", next);
    return;
  }

  logger.info("Creating new Promise");

  var date = utils.getTodaysDateObject();

  var promiseToSave = {
    date: date,
    book: promiseDetails.book,
    chapter: promiseDetails.chapter,
    verse: promiseDetails.verse,
    text: promiseDetails.text,
    bookStoreValue: processBookStoreValue(promiseDetails.book)
  };

  var query = { date: date };

  userDataRepository.loadByQuery("promises", query, function (err, result) {
    if (err) {
      logger.error("Error getting promises. Error:" + err);
    }
    else {
      if (result) {
        logger.info("Promise already exists andso updating - " + result._id.toString());
        promiseToSave._id = result._id.toString();
      }
      userDataRepository.save("promises", promiseToSave, function (err, response) {
        logger.info("Promise saved.");
        next(err, response);
      });
    }
  });
};

module.exports = PromiseService;