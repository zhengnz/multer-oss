```coffee
multer  = require 'multer'
oss = require 'multer-oss'

oss_storage = oss {
  destination: (req, file, cb) ->
    cb null, 'test'
  accessKeyId: 'xxxxx'
  accessKeySecret: 'xxxxx'
  endpoint: 'oss-cn-beijing'
  bucket: 'xxxx'
  filename: (req, file, cb) ->
    cb null, file.fieldname + '-' + Date.now()
}

upload = multer {storage: oss_storage}

router.post '/upload', upload.single('avatar'), (req, res, next) ->
  res.send req.file.path
```

```html
<form method="post" action="/upload" enctype="multipart/form-data">
    <input type="file" name="avatar" />
    <input type="submit" />
</form>
```