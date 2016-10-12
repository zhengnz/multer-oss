moment = require 'moment'
OSS = require './libs/oss'

getDestination = (req, file, cb) ->
  cb(null, '')

getFileName = (req, file, cb) ->
  cb null, moment().format 'x'

class ossStorage
  constructor: (@opts) ->
    if not @opts.bucket
      throw new Error 'oss bucket is require!'

    @oss = OSS @opts

    if 'string' is typeof @opts.destination
      @getDestination = ( $0, $1, cb ) ->
        cb null, @opts.destination
    else
      @getDestination = @opts.destination or getDestination
    @getFileName = @opts.filename or getFileName

  _handleFile: (req, file, cb) ->
    @getDestination req, file, (err, destination) =>
      if err
        return cb err

      @getFileName req, file, (err, filename) =>
        if err
          return cb err

        finalPath = "#{destination}/#{filename}"

        @oss.putStream finalPath, file.stream, {contentLength: file.size}
        .then ->
          cb null, {
            destination: destination
            filename: filename
            path: finalPath
          }
        .catch cb


  _removeFile: (req, file, cb) ->
    @oss.delete file.path
    .then ->
      cb null
    .catch cb

module.exports = (opts) ->
  new ossStorage opts