// pages/wode/wode.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var communityCode = wx.getStorageSync('communityCode');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var value = wx.getStorageSync('user');
    if (value) {
      that.setData({
        url: value.avatarUrl
      })
    } else {
      that.setData({
        url: '../images/mrtx.png'
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */  
  onShow: function () {
    const Phone = wx.getStorageSync('phone');
    this.setData({
      phone: Phone
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取手机号码
  PhoneInfo: function (e) {
    var that = this;
    var code = wx.getStorageSync('code'),
      encryptedData = e.detail.encryptedData,
      iv = e.detail.iv;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      //用户按了拒绝按钮
      that.setData({
        PhoneHid: true
      })
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '小程序必须获取您的手机号码才能正常使用,请再次点击登录',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              PhoneHid: false
            })
          }
        }
      })
    } else {
      //用户按了允许授权按钮
      that.setData({
        PhoneHid: true
      });
      wx.request({
        url: Url + 'app/wechat/getPhoneNumber',
        data: {
          loginCode: code,
          encryptedData: encryptedData,
          iv: iv
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          "communityCode": '330103009'
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.setStorageSync('phone', res.data.data.phone);
            that.login(res.data.data.phone);//登录
            app.onLaunch()//重新获取LoginCode
            that.setData({
              modelHid: false
            })
          } else {
            wx.showToast({
              title: "异常错误",
              icon: 'loading',
              duration: 2000
            })
          }

        },
        flai: function (res) {
          console.log("错误")
        }
      })

    }
  },
  // 登录
  login: function (Phone) {
    var that = this;
    var ts = Math.round(new Date().getTime() / 1000).toString();
    wx.request({
      url: Url + 'app/wechat/login',
      data: {
        phone: Phone
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "communityCode": '330103009'
      },
      success: function (res) {
        var role = res.data.data.role;
        var time = parseInt(res.data.data.expire) + parseInt(ts);
        // var role = 4;
        wx.setStorageSync('token', res.data.data.token)
        wx.setStorageSync('role', res.data.data.role)
        wx.setStorageSync('Time', time)
        if (role != 0 && role != 1 && role != 2) {
          that.setData({
            swipee3_hid: true,
            swipee4_hid: false
          })
        } else if (role == 0 || role == 1 || role == 2) {
          that.setData({
            swipee3_hid: false,
            swipee4_hid: true,
            phone: Phone
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "出现错误",
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  //获取用户信息
  // onGotUserInfo: function (e) {
  //   var that = this;
  //   var code = wx.getStorageSync('code'),
  //     encryptedData = e.detail.encryptedData,
  //     rawData = e.detail.rawData,
  //     signature = e.detail.signature,
  //     iv = e.detail.iv;
  //   wx.setStorageSync('user', e.detail.userInfo)
  //   if (e.detail.userInfo) {
  //     //用户按了允许授权按钮
  //     that.setData({
  //       modelHid: true,
  //       userInfo: e.detail.userInfo
  //     })
  //     wx.request({
  //       url: Url + 'app/wechat/getUserInfo',
  //       data: {
  //         loginCode: code,
  //         encryptedData: encryptedData,
  //         iv: iv,
  //         rawData: rawData,
  //         signature: signature
  //       },
  //       method: 'POST',
  //       header: {
  //         'content-type': 'application/json',
  //         "communityCode": communityCode
  //       },
  //       success: function (res) {
  //         if (res.data.code == 0) {
  //           wx.setStorageSync('openId', res.data.data.openId);
  //         } else {
  //           wx.showToast({
  //             title: "异常错误",
  //             icon: 'loading',
  //             duration: 2000
  //           })
  //         }
  //       },
  //       flai: function (res) {
  //         console.log("错误")
  //       }
  //     })

  //   } else {
  //     //用户按了拒绝按钮
  //     that.setData({
  //       modelHid: true
  //     })
  //     wx.showModal({
  //       title: '提示',
  //       showCancel: false,
  //       content: '小程序必须获取您的头像昵称才能正常使用',
  //       success: function (res) {
  //         if (res.confirm) {
  //           that.setData({
  //             modelHid: false
  //           })
  //         }
  //       }
  //     })
  //   }

  // }
})