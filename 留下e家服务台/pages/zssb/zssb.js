// pages/zssb/zssb.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var until = require('../../utils/untils.js');
var communityCode = wx.getStorageSync('communityCode');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content0_hid: false,
    content1_hid: true,
    Suo_xq: [],
    page: 1,
    List: []
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      Suo_xq: []
    })
    this.Zssb(1)
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
    var that = this,
    a = that.data.page+1;
    that.data.page = a
    this.Zssb(that.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取装锁上报信息学
  Zssb: function (pagesize) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: Url + 'app/lockinstall/list', 
      data: {
        page: pagesize,
        size: 10
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "token": token,
        "communityCode": communityCode
      },
      success: function (res) {
        let code = res.data.code,
          page = res.data.page; 
        var list = that.data.Suo_xq; 
        wx.hideLoading()
    
        if (res.data.code == 0 && page != '') {
          for(var val in page) {     
            list.push(page[val]);
            if (page[val] != "") {
              page[val].createTime = until.formatTime(page[val].createTime, 'Y.M.D h:m')
              page[val].applyTime = until.formatTime(page[val].applyTime, 'Y.M.D')
              if (page[val].status == 1 || page[val].status == 30) {
                page[val].failMessage = "成功"
              } else if (page[val].status == 2 || page[val].status == 31) {
                page[val].failMessage = "失败"
              } else if (page[val].status == 0) {
                page[val].failMessage = "社工提交信息完成"
              } else if (page[val].status == 10 || page[val].status == 11) {
                page[val].failMessage = "经纪人核查信息中"
              } else if (page[val].status == 20) {
                page[val].failMessage = "锁匠已接单"
              } else {
                page[val].failMessage = "..."
              }
            } 
          }
          that.setData({
            Suo_xq: list,
            content0_hid: true,
            content1_hid: false
            })
        } else {
          that.setData({
            content0_hid: true,
            content1_hid: false,
          })
        }
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  // 进入装锁详情
  zsxq: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../zsxq/zsxq?id='+id,
    })
  },
  //填写上报信息
  sbxx: function() {
    var that = this;
    wx.navigateTo({
      url: '../sbxx/sbxx'
    })
    that.setData({
      Suo_xq: []
    })
  }
})