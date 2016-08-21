var DataController = require("./data-controller");
var MetaDataController = require('./metadata-controller');

var dataController = null;
var metadataController = null;

var controllers = function (app) {
  dataController = new DataController(app);
  metadataController = new MetaDataController(app);
};

module.exports = controllers;