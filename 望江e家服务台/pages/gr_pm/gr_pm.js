// pages/sgpm/sgpm.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var util = require('../../utils/util.js');
var communityCode = wx.getStorageSync('communityCode');
Page({
  data: {
    content0_hid: '',
    dates: '',
    shequ: []    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      dates: time
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.sgpm()
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
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      dates: e.detail.value
    })
  },
  // 获取社工排名数据吧
  sgpm: function() {
    var that = this,
      date = that.data.dates,
      obj = {
        page: 1,
        size: 10,
        date: date
      }
    var token = wx.getStorageSync('token');
    wx.request({
      url: Url + 'app/lockinstall/countByWorker',
      data: obj,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "token": token,
        "communityCode": communityCode
      },
      success: function (res) {
        var dataL = res.data.data.length;

        if (dataL == 0) {
          content0_hid: false
        } else {
          that.setData({
            shequ: res.data.data,
            content0_hid: true
          })
        }
        
      }
    })
  }
 
})