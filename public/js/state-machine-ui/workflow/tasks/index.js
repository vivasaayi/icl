const Begin = require('./begin.js');
const End = require('./end.js');
const GetData = require('./get-data.js');
const SaveData = require('./save-data.js');
const CustomTask = require('./custom-task.js');
const SubTask = require('./sub-task.js');
const Validation = require('./validattion');

module.exports = {
  'begin': Begin,
  'end': End,
  'get-data': GetData,
  'save-data': SaveData,
  'custom': CustomTask,
  'sub-task': SubTask,
  'validation': Validation
}