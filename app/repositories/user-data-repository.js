var database = require("dal");
var objectId = require("mongodb").ObjectID;

module.exports.getContacts = function(){

};

module.exports.save = function(collectionName, document, callback) {
  if (document._id) {
    database.updateDocument(collectionName, document, function(err, result) {
      callback(err, result);
    });
  } else {
    database.insertDocument(collectionName, document, function(err, result) {
      callback(err, result);
    });
  }
};

module.exports.delete = function(collectionName, document, callback) {
  if (document._id) {
    database.deleteDocument(collectionName, document, function(err, result) {
      callback(err, result);
    });
  } 
};

module.exports.loadSummary = function(collectionName, fields, callback){
  database.loadSelectedFields(collectionName, {},fields, function(err, result){
    callback(err, result);
  });
};

module.exports.loadAll = function(collectionName, callback){
  database.getAllFromCollection(collectionName, function(err, result){
    callback(err, result);
  });
};

module.exports.loadById = function(collectionName, id ,callback){  
  var query = {
    "_id" : new objectId(id)
  };
  
  database.findOne(collectionName, query, function(err, result){
    callback(err, result);
  });
};

module.exports.loadWithLimit = function (collectionName, limit, callback) {
  console.log("Loading " + collectionName);
  
  database.getTopXFromCollection(collectionName, limit, function (err, result) {
    callback(err, result);
  });
};


module.exports.loadBySimpleQuery = function(collectionName, fieldName, value, callback){
  var query = {};
  query[fieldName] = value;

  database.findOne(collectionName, query, function(err, result){
    callback(err, result);
  });
};

module.exports.findAllByQuery = function (collectionName, query, callback) {
  database.findAll(collectionName, query, function (err, result) {
    callback(err, result);
  });
};

module.exports.loadByQuery = function (collectionName, query, callback) {
  database.findOne(collectionName, query, function (err, result) {
    callback(err, result);
  });
};

module.exports.customQuery = function (collectionName, query, sort, limit, callback) {
  var options = {
    query: query,
    sort: sort,
    limit: limit
  };
  
  if (sort && limit) {
    options.hint = "queryWithSortAndLimit";
  }

  database.customQuery(collectionName, query, function (err, result) {
    callback(err, result);
  });
};

module.exports.new = function(req, res){
  var employees = [
    {
      empNo: 500,
      name: 'Rajan',
      active:true,
      homeCode:'VLR'
    },
    {
      empNo: 501,
      name: 'Rajan',
      active:true,
      homeCode:'VLR'
    },
    {
      empNo: 502,
      name: 'Rajan',
      active:true,
      homeCode:'VLR'
    }
  ];

  return employees;
};
