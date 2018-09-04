// pages/xfys/xfys.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var until = require('../../utils/untils.js');
var communityCode = wx.getStorageSync('communityCode');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content0_hid: true,
    content1_hid:true,
    ys_Arr: [],
    pagesize: 1
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
    if(that.data.ys_Arr) {
      that.setData({
        content1_hid: false
      })
    } else {
      that.setData({
        content0_hid: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var page = this.data.pagesize
    this.Xfys(page)
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
  //消防预审列表
  Xfys: function (pagesize) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: Url + 'app/fir/list',
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
        console.log(res.data)
        let code = res.data.code,
          page = res.data.data;
        var list = that.data.ys_Arr;
        wx.hideLoading()
        if (res.data.code == 0 && page != '') {
          for (var val in page) {
            list.push(page[val]);
            if (page[val] != "") {
              page[val].createTime = until.formatTime(page[val].createTime, 'M-D')
              page[val].applyTime = until.formatTime(page[val].applyTime, 'Y.M.D')
            }
          }
          that.setData({
            ys_Arr: list
          })
        } else {
          that.setData({
            content0_hid: true,
            content1_hid: false,
          })
        }
      }
    })
  },

  // 提交预审
  tjys: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../tjys/tjys',
    })
    that.setData({
      ys_Arr: []
    })
  },
  // 预审详情
  ysxq: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../ysxq/ysxq?id=' + id,
    })
    that.setData({
      ys_Arr: []
    })
  }
})