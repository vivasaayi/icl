var PromiseService = require("../services/promise-service");
var moment = require("moment");

//Create instances of Services
var promiseService = new PromiseService();
var eventsService = require("../services/events-service");
var moviesService = require("../services/movies-service");
var lyricsService = require("../services/lyrics-service");
var audioService = require("../services/audio-service");

var IndexController = function () {
};

IndexController.prototype.render = function (req, res) {
  var data = {
    layout: false
  };

  promiseService.getTodaysPromise(function (err, promise) {
    data.promise = promise;

    eventsService.getTodaysEvents(function (err, events) {
      data.events = events;

      moviesService.getMoviesForIndexPage(function (err, movies) {
        data.musicVideos = movies;

        lyricsService.getTopLyrics(function (err, lyrics) {
          console.log(JSON.stringify(lyrics, null, 2));

          data.lyrics = lyrics;

          audioService.getTopAudios(function (err, audios) {
            data.audios = audios;

            res.render('index', data);
          });
        });
      });
    });
  });
};

module.exports = new IndexController();