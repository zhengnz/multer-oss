// Generated by CoffeeScript 1.12.6
(function() {
  var OSS, Promise, concat, fileType, getBuffer, getDestination, getFileName, moment, ossStorage,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  moment = require('moment');

  concat = require('concat-stream');

  fileType = require('file-type');

  Promise = require('bluebird');

  OSS = require('./libs/oss');

  getDestination = function(req, file, cb) {
    return cb(null, '');
  };

  getFileName = function(req, file, cb) {
    return cb(null, moment().format('x'));
  };

  getBuffer = function(file) {
    return new Promise(function(resolve, reject) {
      return file.stream.pipe(concat(function(data) {
        return resolve(data);
      }));
    });
  };

  ossStorage = (function() {
    function ossStorage(opts1, debug) {
      this.opts = opts1;
      this.debug = debug != null ? debug : false;
      if (!this.opts.ossCreator) {
        if (!this.opts.bucket) {
          throw new Error('oss bucket is require!');
        }
        this.logger('use default oss');
        this.oss = OSS(this.opts);
      } else {
        this.logger('use custom oss');
      }
      if ('string' === typeof this.opts.destination) {
        this.getDestination = function($0, $1, cb) {
          return cb(null, this.opts.destination);
        };
      } else {
        this.getDestination = this.opts.destination || getDestination;
      }
      this.getFileName = this.opts.filename || getFileName;
    }

    ossStorage.prototype.logger = function(msg) {
      if (this.debug === true) {
        return console.log(msg);
      }
    };

    ossStorage.prototype._handleFile = function(req, file, cb) {
      if (this.opts.ossCreator) {
        this.logger('creating oss client');
        return this.opts.ossCreator(req, file, (function(_this) {
          return function(err, conf) {
            if (err) {
              return cb(err);
            }
            _this.oss = OSS(conf);
            _this.logger('oss client created');
            return _this.__handleFile(req, file, cb);
          };
        })(this));
      } else {
        return this.__handleFile(req, file, cb);
      }
    };

    ossStorage.prototype.checkType = function(buffer) {};

    ossStorage.prototype.__handleFile = function(req, file, cb) {
      return this.getDestination(req, file, (function(_this) {
        return function(err, destination) {
          if (err) {
            return cb(err);
          }
          return _this.getFileName(req, file, function(err, filename) {
            var finalPath, props;
            if (err) {
              return cb(err);
            }
            finalPath = destination + "/" + filename;
            props = {
              oss: _this.oss.putStream(finalPath, file.stream, {
                contentLength: file.size,
                timeout: _this.opts.timeout || 30 * 60 * 60 * 1000
              }),
              buffer: getBuffer(file)
            };
            return Promise.props(props).then(function(result) {
              var file_type, ref, ref1;
              if (_this.opts.extensionsExt || _this.opts.extensionsMime || _this.opts.extensionsExtReg || _this.opts.extensionsMimeReg) {
                file_type = fileType(result.buffer);
                if (_this.opts.extensionsExt && (ref = file_type.ext, indexOf.call(_this.opts.extensionsExt, ref) < 0)) {
                  return Promise.reject(_this.opts.extensionsError);
                }
                if (_this.opts.extensionsMime && (ref1 = file_type.mime, indexOf.call(_this.opts.extensionsMime, ref1) < 0)) {
                  return Promise.reject(_this.opts.extensionsError);
                }
                if (_this.opts.extensionsExtReg && !_this.opts.extensionsExtReg.test(file_type.ext)) {
                  return Promise.reject(_this.opts.extensionsError);
                }
                if (_this.opts.extensionsMimeReg && !_this.opts.extensionsMimeReg.test(file_type.mime)) {
                  return Promise.reject(_this.opts.extensionsError);
                }
              }
              return cb(null, {
                destination: destination,
                filename: filename,
                path: finalPath,
                buffer: result.buffer
              });
            })["catch"](cb);
          });
        };
      })(this));
    };

    ossStorage.prototype._removeFile = function(req, file, cb) {
      return this.oss["delete"](file.path).then(function() {
        return cb(null);
      })["catch"](cb);
    };

    return ossStorage;

  })();

  module.exports = function(opts) {
    return new ossStorage(opts);
  };

}).call(this);

//# sourceMappingURL=index.js.map
