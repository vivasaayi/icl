"use strict";

var util = require('util');
var BaseController = require("./base-controller");
var userDataRepository = require("../repositories/user-data-repository");
var TableDefinitions = require('./table-definitions');
var _ = require("underscore");
var async = require('async');

var DataController = function (app) {
  app.get("/data/:table", this.getRecords);
  app.get("/data/:table/:id", _.bind(this.getRecord, this));

  app.post("/data/:table", this.addRecord);
  app.post("/dataupdate/:table/:id", _.bind(this.updateRecord, this));

  app.post("/datadelete/:table/:id", this.deleteRecord);
};

util.inherits(DataController, BaseController);

DataController.prototype.getRecords = function (req, res) {
  var tableName = req.params.table;
  userDataRepository.loadAll(tableName, function (err, response) {
    if (err) {
    }
    else {
      res.send(response);
    }
  });
};

DataController.prototype.getRecord = function (req, res) {
  var tableName = req.params.table;
  var id = req.params.id;
  var that = this;

  console.log("TableName:" + tableName);
  console.log("id: " + id);

  userDataRepository.loadById(tableName, id, function (err, data) {
    if (err) {
      console.log("Error occured when getting the record:" + err);
      res.send({ message: "Error" });
      return;
    }
    else {
      data.__child = {};

      that.loadAllChildRecords(tableName, data._id, function (result) {
        console.log('Final Result' + JSON.stringify(result));
        data.__child = result;
        res.send(data);
      });
    }
  });
};

DataController.prototype.loadAllChildRecords = function (tableName, parentRecordId, callback) {
  var childTables = TableDefinitions[tableName].children;

  if (!childTables || !childTables.length) {
    callback({});
    return;
  }

  console.log(parentRecordId);

  async.eachSeries(childTables, function iterator(childTable, cb) {
    userDataRepository.findAllByQuery(childTable, { '_parent': parentRecordId.toString() }, function (err, data) {
      cb({
        tableName: childTable,
        data: data
      });
    });
  }, function done(results) {

    var finalObject = {};

    if (!_.isArray(results)) {
      finalObject[results.tableName] = results.data;
    }
    else {
      _.each(results, function (result) {
        finalObject[result.tableName] = result.data;
      });
    }
    callback(finalObject);
  });
};

DataController.prototype.addRecord = function (req, res) {
  var tableName = req.params.table;
  var data = req.body;

  var documentToSave = {};

  documentToSave = _.extend(documentToSave, req.body);

  //if (processors[documentToSave.__name__]) {
  //  processors[documentToSave.__name__].processSave(documentToSave);
  //}

  userDataRepository.save(tableName, documentToSave, function (err, response) {
    if (err) {
      res.status(404).send('Not found');
    }
    else {
      if (response && response.length) {
        res.send(response);
      }
      else {
        res.send(documentToSave);
      }
    }
  });
};

DataController.prototype.updateRecord = function (req, res) {
  this.addRecord(req, res);
};

DataController.prototype.deleteRecord = function (req, res) {
  var tableName = req.params.table;
  var recordId = req.params.id;

  userDataRepository.delete(tableName, { _id: recordId }, function (err, response) {
    if (err) {
      res.status(404).send('Not found');
    }
    else {
      res.send({
        message: 'Deleted Successfully'
      })
    }
  });
};

module.exports = DataController;