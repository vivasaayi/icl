var userDataRepository = require("../repositories/user-data-repository");
var _ = require("underscore");

var LyricsService = function () {

};

LyricsService.prototype.getTopLyrics = function (callback) {
  userDataRepository.loadWithLimit("LYRICS", 8, function (err, result) {
    if (err) {
      console.log("Error occured when fetching the promise");
      console.dir(err);
      callback(err, null);
    }

    console.log(JSON.stringify(result, null, 2));

    var ids = [];

    _.each(result, function (item) {
      ids.push(item._id);
    });

    var query = {};

    userDataRepository.findAllByQuery('LYRICSSTANZAS', query, function (err, stanzas) {
      console.log(JSON.stringify(stanzas, null, 2));

      _.each(result, function (item) {
        var children = stanzas.filter(function (stanza) {
          return stanza._parent.toString() === item._id.toString();
        })

        item.stanzas = children;
      });

      callback(null, result);
    })
  });
};

module.exports = new LyricsService();