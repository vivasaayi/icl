"use strict";

var util = require('util');
var BaseController = require("./base-controller");
var TableDefinitions = require('./table-definitions');
var _ = require("underscore");

var MetaDataController = function (app) {
  app.get("/schema/:table", this.getSchema);
};

util.inherits(MetaDataController, BaseController);

MetaDataController.prototype.getSchema = function (req, res) {
  var tableName = req.params.table;

  var result = {};

  if (TableDefinitions[tableName]) {
    result[tableName] = TableDefinitions[tableName];
  }

  _.each(result[tableName].children, childTableName => {
    if (TableDefinitions[childTableName]) {
      result[childTableName] = TableDefinitions[childTableName];
    }
  });

  res.send(result);
};

module.exports = MetaDataController;