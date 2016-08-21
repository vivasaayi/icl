const Behaviours = require('../../behaviours/index');
const _ = require('underscore');
var request = require('superagent');

class NetworkProxy {

  static getBehaviour(tableName) {
    return Behaviours[tableName];
  }

  static getTableDefinition(tableName) {
    return this.fetch('http://christianliterature.in/SCHEMA/' + tableName);
  }

  static fetch(url) {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end(function (err, res) {
          if (err) {
            reject(err);
          }
          else {
            resolve(res.body);
          }
        });
    });
  }

  static getData(tableName, recordId, fetchChildData) {
    let url = 'http://christianliterature.in/data/' + tableName;

    if (recordId) {
      url += '/' + recordId;
    }

    return this.fetch(url);
  }

  static createRecord(tableName, data) {
    return new Promise((resolve, reject) => {
      request
        .post('http://christianliterature.in/data/' + tableName)
        .send(data)
        .end(function (err, res) {
          if (err) {
            reject(err);
          }
          else {
            resolve(res.body);
          }
        });
    });
  }

  static updateRecord(tableName, data) {
    return new Promise((resolve, reject) => {
      request
        .post('http://christianliterature.in/dataupdate/' + tableName + '/' + data._id)
        .send(data)
        .end(function (err, res) {
          if (err) {
            reject(err);
          }
          else {
            resolve(res.body);
          }
        });
    });
  }

  static deleteRecord(tableName, recordId) {
    return new Promise((resolve, reject) => {
      request
        .post('http://christianliterature.in/' + tableName + '/' + recordId)
        .end(function (err, res) {
          if (err) {
            reject(err);
          }
          else {
            resolve(res.body);
          }
        });
    });
  }
}

module.exports = NetworkProxy;