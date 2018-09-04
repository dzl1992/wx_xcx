
const app = getApp()
var fileKeyArr = [];
const uploadFile = function (aliyunConfig, filePaths, objectId, successCallback, errorCallback) {
  if (filePaths == undefined || filePaths == null || filePaths.length == 0) {
    return;
  }

  var successCount = 0, failCount = 0
  var timer = setInterval(function () {
    if (filePaths.length == successCount) {
      clearInterval(timer)
    }
  }, 1000)
  filePaths.map(filePath => {
    const key = 'PIC' + (new Date().getTime()) + '_' + objectId + filePath.substring(filePath.lastIndexOf('.'));
    // var filrKey = aliyunConfig.host + '/' + key;
    var filrKey = key;
    fileKeyArr.push(filrKey)
    // console.log(filrKey)
    // console.log(fileKeyArr)
    wx.setStorageSync('photoArr' + objectId, fileKeyArr)
    wx.uploadFile({
      url: aliyunConfig.host,
      filePath: filePath,
      name: 'file',
      formData: {
        'key': key,
        'OSSAccessKeyId': aliyunConfig.accessId,
        'policy': aliyunConfig.policy,
        'signature': aliyunConfig.signature,
        'success_action_status': '200',   // 设置成功返回状态码为 200
      },
      success: function (res) {
        if (res.statusCode == 200) {
          console.log('上传成功', res)
          successCount++
          typeof successCallback == "function" && successCallback(key);
        } else {
          clearInterval(timer)

          // 出现错误，清空aliyunConfig，重新获取
          app.globalData.aliyunConfig = null
          errorCallback(new Error('上传错误:' + JSON.stringify(res)))
        }
      },
      fail: function (res) {
        clearInterval(timer)
        wx.hideLoading()
        errorCallback(res)
      }
    })
  })
}


module.exports = uploadFile;