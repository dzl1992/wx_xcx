// pages/sbxx/sbxx.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var communityCode = wx.getStorageSync('communityCode');
import WxValidate from '../../utils/wxValidate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'default',
    val: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  //完成输入时按钮变化
  gd_suo: function(e) {
    var val = e.detail.value;
    if(val.length > 0) {
      this.setData({
        type: "primary"
      })
    }
  },
  //上报信息
  formSubmit: function (e) {
    let that = this;
    let val = this.data.val;
    let obj = e.detail.value;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var token = wx.getStorageSync('token');

    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        image: '/pages/images/error-icon.png',
        duration: 2000
      })
      return false
    } else {
      wx.request({
        url: Url + 'app/lockinstall/save',
        method: 'POST',
        data: obj,
        header: {
          'content-type': 'application/json',
          "token": token,
          "communityCode": communityCode
        },
        success: function (res) {
          if (res.data.code == 0) {
            prevPage.data.Suo_xq = [];
            prevPage.data.page = 1;
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          }

          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      })
    }
    
  },
  // 表单验证规则
  initValidate() {
    // 验证字段的规则
    const rules = {
      landlordName: {
        required: true,
        minlength: 2,
        maxlength: 30,
      },
      landlordPhone: {
        required: true,
        tel: true,
      },
      address: {
        required: true,
        minlength: 5,
        maxlength: 30,
      },
      doorLock: {
        required: true,
        min: 0,
        max: 10,
      },
      hallwayLock: {
        required: true,
        min: 0,
        max: 10,
      },
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      landlordName: {
        required: '请填写您的姓名',
      },
      landlordPhone: {
        required: '请输入手机号',
        tel: '请输入正确的手机号',
      },
      address: {
        required: '请输入房屋位置',
      },
      doorLock: {
        required: '请输入入户锁',
        min: '入户锁不小于0',
        max: '入户锁不大于10',
      },
      hallwayLock: {
        required: '请输入过道锁',
        min: '过道锁不小于0',
        max: '过道锁不大于10',
      },
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
})