OSS = require('ali-oss').Wrapper

module.exports = (opts) ->
  new OSS {
    region: opts.endpoint
    accessKeyId: opts.accessKeyId
    accessKeySecret: opts.accessKeySecret
    bucket: opts.bucket
  }