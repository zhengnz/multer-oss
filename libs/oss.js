// Generated by CoffeeScript 1.12.6
(function() {
  var OSS;

  OSS = require('ali-oss').Wrapper;

  module.exports = function(opts) {
    return new OSS({
      region: opts.endpoint,
      accessKeyId: opts.accessKeyId,
      accessKeySecret: opts.accessKeySecret,
      bucket: opts.bucket
    });
  };

}).call(this);

//# sourceMappingURL=oss.js.map
