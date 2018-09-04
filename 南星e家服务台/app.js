//app.js
var net = require('./utils/net.js')
var communityCode = 330102010;
App({
  deviceInfo: {},
  onLaunch: function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求 
          // console.log(res.code)
          wx.setStorageSync('code', res.code)
          wx.setStorageSync('communityCode', communityCode)
        } else {
          // console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });  
    wx.getSystemInfo({
      success: function (res) {
        that.deviceInfo.windowWidth = res.windowWidth
        that.deviceInfo.windowHeight = res.windowHeight
      }
    })
  },
  globalData: {
    userInfo: null,
    deviceInfo: null,
    aliyunConfig: null,
    //serverUrl: "http://192.168.6.135:8081/",
    serverUrl: 'https://www.iyuebanwan.com/nxdesk/'
  }, 
  /**
  * 获取阿里云上传文件配置
  */
  getAliyunConfig: function (cb) {
    var that = this;
    if (that.globalData.aliyunConfig) {
      typeof cb == "function" && cb(that.globalData.aliyunConfig)
    } else {
      net.post(
        that.globalData.serverUrl + 'pub/aliyun/uploadConfig', null,
        function (res) {
          if (res.code == 0) {
            that.globalData.aliyunConfig = res.data
            typeof cb == "function" && cb(that.globalData.aliyunConfig)
          } else {
            wx.showToast({
              image: '/pages/images/error-icon.png',
              title: '错误',
            });
          }
        },
        function (res) {
          wx.showModal({
            content: '请求服务失败',
            showCancel: false
          });
        }, null
      )
    }
  },
  dateFormat: function (fmt, date) {
    var o = {
      "M+": date.getMonth() + 1,                 //月份   
      "d+": date.getDate(),                    //日   
      "h+": date.getHours(),                   //小时   
      "m+": date.getMinutes(),                 //分   
      "s+": date.getSeconds(),                 //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  getNowFormatDate: function () {
    return this.dateFormat('yyyy-MM-dd hh:mm:ss', new Date())
  }

})