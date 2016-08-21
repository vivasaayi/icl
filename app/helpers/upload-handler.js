var Formidable = require('formidable');
var fs = require('fs');

var UploadHandler = function(req, res, callback) {
  this.req = req;
  this.res = res;
  this.callback = callback;
};

UploadHandler.prototype.get = function() {
  var handler = this,
    files = [];
  fs.readdir(options.uploadDir, function(err, list) {
    list.forEach(function(name) {
      var stats = fs.statSync(options.uploadDir + '/' + name),
        fileInfo;
      if (stats.isFile() && name[0] !== '.') {
        fileInfo = new FileInfo({
          name: name,
          size: stats.size
        });
        fileInfo.initUrls(handler.req);
        files.push(fileInfo);
      }
    });
    handler.callback({files: files});
  });
};

UploadHandler.prototype.post = function() {
  var handler = this,
    form = new Formidable.IncomingForm(),
    tmpFiles = [],
    files = [],
    map = {},
    counter = 1,
    redirect,
    finish = function() {
      counter -= 1;
      if (!counter) {
        files.forEach(function(fileInfo) {
          fileInfo.initUrls(handler.req);
        });
        handler.callback({files: files}, redirect);
      }
    };
  form.uploadDir = options.tmpDir;
  form.on('fileBegin', function(name, file) {
    tmpFiles.push(file.path);
    var fileInfo = new FileInfo(file);
    fileInfo.safeName();
    map[path.basename(file.path)] = fileInfo;
    files.push(fileInfo);
  }).on('field', function(name, value) {
    if (name === 'redirect') {
      redirect = value;
    }
  }).on('file', function(name, file) {
    var fileInfo = map[path.basename(file.path)];
    fileInfo.size = file.size;
    if (!fileInfo.validate()) {
      fs.unlink(file.path);
      return;
    }
    fs.renameSync(file.path, options.uploadDir + '/' + fileInfo.name);
  }).on('aborted', function() {
    tmpFiles.forEach(function(file) {
      fs.unlink(file);
    });
  }).on('error', function(e) {
    console.log(e);
  }).on('progress', function(bytesReceived) {
    if (bytesReceived > options.maxPostSize) {
      handler.req.connection.destroy();
    }
  }).on('end', finish).parse(handler.req);
};

UploadHandler.prototype.destroy = function() {
  var handler = this,
    fileName;
  if (handler.req.url.slice(0, options.uploadUrl.length) === options.uploadUrl) {
    fileName = path.basename(decodeURIComponent(handler.req.url));
    if (fileName[0] !== '.') {
      fs.unlink(options.uploadDir + '/' + fileName, function(ex) {
        Object.keys(options.imageVersions).forEach(function(version) {
          fs.unlink(options.uploadDir + '/' + version + '/' + fileName);
        });
        handler.callback({success: !ex});
      });
      return;
    }
  }
  handler.callback({success: false});
};

module.exports = UploadHandler;