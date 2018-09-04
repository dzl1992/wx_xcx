// pages/czsq/czsq.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var until = require('../../utils/untils.js');
var communityCode = wx.getStorageSync('communityCode');
import WxValidate from '../../utils/wxValidate.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Mgz_Hidden: true,
    mgz: [],
    list: [
      {
        tit: '拍照', 
        id: 1
      },
      {
        tit: '从相册选择',
        id: 2
      }
    ]
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
 
  // 出租申请
  formSubmit: function(e) {
    var that = this;
    var token = wx.getStorageSync('token');
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
        url: Url + 'app/landlord/apply',
        data: e.detail.value,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          "token": token,
          "communityCode": communityCode
        },
        success: function (res) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        },
        fail: function () {
          wx.showToast({
            image: '/pages/images/error-icon.png',
            title: '失败',
          })
        }
      })
    }
    
  },
  // 表单验证规则
  initValidate() {
    // 验证字段的规则
    const rules = {
      name: {
        required: true,
        minlength: 2,
        maxlength: 30,
      },
      idCard: {
        required: true,
        idcard: true,
      },
      phone: {
        required: true,
        tel: true,
      },
      address: {
        required: true,
        minlength: 14,
        maxlength: 30,
      },
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: '请填写您的姓名',
      },
      idCard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      phone: {
        required: '请输入手机号',
        tel: '请输入正确的手机号',
      },
      address: {
        required: '请输入房屋位置',
      },
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
})