// pages/ysxq/ysxq.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var until = require('../../utils/untils.js');
var communityCode = wx.getStorageSync('communityCode');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '1', value: '1kg干粉灭火器' },
      { name: '2', value: '30型防毒面具' },
      { name: '3', value: '20米逃生绳' },
      { name: '4', value: '多功能安全手电' },
      { name: '5', value: '防滑手套' },
      { name: '6', value: '烟感设备' },
    ],
    obj: {},
    id: null,
    check: [],
    photo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info = prevPage.data //取上页data里的数据也可以修改
    var page = info.ys_Arr
    console.log(id)
    that.setData({
      id: id
    })
    // for (var val in page) {
    //   if (page[val].status == id) {
    //     that.setData({
    //       obj: page[val]
    //     })
    //   }
    // };
    that.ysXp()
    console.log(that.data.obj)
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
  // 获取用户信息
  ysXp: function() {
    var that = this;
    var id = that.data.id;
    var token = wx.getStorageSync('token');
    var arr1 = that.data.items;
    wx.request({
      url: Url + 'app/fir/info/' + id,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "token": token,
        "communityCode": communityCode
      },
      success: function (res) {
        var arr2 = res.data.data.equipments;
        that.setData({
          obj: res.data.data
        })
        console.log(res.data)
        for(var a in arr1) {
          // console.log(arr1[a].name)
          for(var b in arr2) {
            // console.log(arr2[b])
            if (arr1[a].name == arr2[b]) {
              console.log(arr1[a].name)
              arr1[a].checked = 'true'
            }
          }
        }
        that.setData({
          check: arr1,
        })
      }
    })
  }
})