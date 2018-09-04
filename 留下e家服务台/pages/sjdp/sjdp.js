// pages/sjdp/sjdp.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
const CHARTS = require('../../utils/wxcharts.js'); // 引入wx-charts.js文件
var communityCode = wx.getStorageSync('communityCode');
Page({
  data: {
    Yes_hid: false,
    NO_hid:true,
    xq_name: '',
    dataInfo: [],
    imageWidth: '',
    page: 1

  },
  //饼状图
  ringShow: function () {
    var Arr = this.data.dataInfo
    var Width = this.data.imageWidth;
    for (var i in Arr) {
      var item = Arr[i];
      var count = item.rentInstalledLockCount / item.rentCount
      if (item.rentInstalledLockCount == 0) {
        count = 0
      }
      let pie = {
        canvasId: "ringGraph" + item.id, // 与canvas-id一致
        type: 'pie', // 图表类型，可选值为pie, line, column, area, ring
        series: [
          {
            name: "已安装",
            data: count*100,
            color: '#3ad61d'
          },
          {
            name: "未安装",
            data: 100 - (count*100),
            color: '#ffb321'
          }
        ],
        width: Width/2,
        height: 170,
        title: { 
          name: item.name,
          color: '#333333',
          fontSize: 14
        },
        dataLabel: true,
        legend: false,
        extra: {
          pie: {
            offsetAngle: -90
          }
        }
      };
      new CHARTS(pie);
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth
    })
     this.countByResidential(1)
     
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
    var that = this,
      a = that.data.page + 1;
    that.data.page = a
    this.countByResidential(that.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //获取小区名
  xq_name: function(e) {
    this.setData({
      xq_name: e.detail.value
    })
  },
  //搜索
  search: function() {
    var that = this;
    that.countByResidential()
  },
  // 小区统计
  countByResidential: function (pagesize) {
    var that = this,
        residentialName = that.data.xq_name,
        obj = {
          page: pagesize,
          size: 6,
          residentialName: residentialName
        };
    var token = wx.getStorageSync('token');
    for(var val in obj) {
      if(obj[val] == '' ) {
        delete obj[val]
      }
    }
    wx.request({
      url: Url + 'app/lockinstall/countByResidential',
      data: obj,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "token": token,
        "communityCode": communityCode
      },
      success: function (res) {
        var xiaoqu = res.data.data;
        var arr = that.data.dataInfo;
        // if (res.data.data.length > 0) {
          for (var val in xiaoqu) {
            arr.push(xiaoqu[val])
          }
          if(arr.length > 0) {
            that.setData({
              Yes_hid: false,
              NO_hid: true,
              dataInfo: arr
            })
            that.ringShow()
          } else {
          that.setData({
            Yes_hid: true,
            NO_hid: false
          })
        }
          
        // } 
        // else {
        //   that.setData({
        //     Yes_hid: true,
        //     NO_hid: false
        //   })
        // }
        
        
      }
    })
  }
})