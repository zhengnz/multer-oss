moment = require 'moment'
OSS = require './libs/oss'

getDestination = (req, file, cb) ->
  cb(null, '')

getFileName = (req, file, cb) ->
  cb null, moment().format 'x'

class ossStorage
  constructor: (@opts, @debug=false) ->
    if not @opts.ossCreator
      if not @opts.bucket
        throw new Error 'oss bucket is require!'
      @logger 'use default oss'
      @oss = OSS @opts
    else
      @logger 'use custom oss'

    if 'string' is typeof @opts.destination
      @getDestination = ( $0, $1, cb ) ->
        cb null, @opts.destination
    else
      @getDestination = @opts.destination or getDestination
    @getFileName = @opts.filename or getFileName

  logger: (msg) ->
    if @debug is on
      console.log msg

  _handleFile: (req, file, cb) ->
    if @opts.ossCreator
      @logger 'creating oss client'
      @opts.ossCreator req, file, (err, conf) =>
        if err
          return cb err
        @oss = OSS conf
        @logger 'oss client created'
        @__handleFile req, file, cb
    else
      @__handleFile req, file, cb

  __handleFile: (req, file, cb) ->
    @getDestination req, file, (err, destination) =>
      if err
        return cb err

      @getFileName req, file, (err, filename) =>
        if err
          return cb err

        finalPath = "#{destination}/#{filename}"

        @oss.putStream finalPath, file.stream, {
          contentLength: file.size
          timeout: @opts.timeout or 30 * 60 * 60 * 1000 #默认超时30分钟可以通过timeout来设置
        }
        .then ->
          cb null, {
            destination: destination
            filename: filename
            path: finalPath
            buffer: file.stream
          }
        .catch cb

  _removeFile: (req, file, cb) ->
    @oss.delete file.path
    .then ->
      cb null
    .catch cb

module.exports = (opts) ->
  new ossStorage opts