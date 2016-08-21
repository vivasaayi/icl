var FileInfo = function(file) {
  this.name = file.name;
  this.size = file.size;
  this.type = file.type;
  this.deleteType = 'DELETE';
};

FileInfo.prototype.validate = function() {
  if (options.minFileSize && options.minFileSize > this.size) {
    this.error = 'File is too small';
  } else if (options.maxFileSize && options.maxFileSize < this.size) {
    this.error = 'File is too big';
  } else if (!options.acceptFileTypes.test(this.name)) {
    this.error = 'Filetype not allowed';
  }
  return !this.error;
};

FileInfo.prototype.safeName = function() {
  // Prevent directory traversal and creating hidden system files:
  this.name = path.basename(this.name).replace(/^\.+/, '');
  // Prevent overwriting existing files:
  while (_existsSync(options.uploadDir + '/' + this.name)) {
    this.name = this.name.replace(nameCountRegexp, nameCountFunc);
  }
};

FileInfo.prototype.initUrls = function(req) {
  if (!this.error) {
    var that = this,
      baseUrl = (options.ssl ? 'https:' : 'http:') +
      '//' + req.headers.host + options.uploadUrl;
    this.url = this.deleteUrl = baseUrl + encodeURIComponent(this.name);
    Object.keys(options.imageVersions).forEach(function(version) {
      if (_existsSync(
        options.uploadDir + '/' + version + '/' + that.name
        )) {
        that[version + 'Url'] = baseUrl + version + '/' +
          encodeURIComponent(that.name);
      }
    });
  }
};

module.exports = FileInfo;