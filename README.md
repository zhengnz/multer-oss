Usage
-------
```coffee
multer = require 'multer'
oss = require 'multer-oss'

oss_storage = oss [options]
```

Options
----------
Key | Description | Type | Require | Note
--- | ----------- | ---- | ------- | ----
`destination` | 返回目录名称 | Function | False | 默认返回空字符串，即无目录
`filename` | 返回文件名称 | Function | False | 默认当前时间戳
`accessKeyId` | 授权id | String | False | 如果存在ossCreator时，无需设置
`accessKeySecret` | 授权secret | String | False | 同上
`endpoint` | oss区域 | String | False | 同上
`bucket` | oss bucket | String | False | 同上
`ossCreator` | 返回oss配置，即`{accessKeyId, accessKeySecret, endpoint, bucket}` | Function(req, file, cb(err, conf)) | False | 通过cb回调配置
`timeout` | 上传超时时间 | 毫秒 | False | 默认60秒
`extensionError` | 当上传文件格式不符合规则时抛出 | Error Exception | False | 当设置了规则此项必须设置，否则会出错
`extensionsMime` | 可上传的文件mime | Array | False | 设置后会检查文件类型是否符合，不符合会抛出extensionError的设置
`extensionsMimeReg` | 可上传的mime | Regex | False | 同上
`extensionsExt` | 可上传的文件后缀名 | Array | False | 同上
`extensionsExtReg` | 可上传的文件后缀名 | Regex | False | 同上

Demo
-------
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
  timeout: 12 * 60 * 60 * 1000 #超时时间12小时，不设置默认30分钟
  extensionsMime: ['audio/mpeg']
  extensionError: new TipsError('请上传音频文件')
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