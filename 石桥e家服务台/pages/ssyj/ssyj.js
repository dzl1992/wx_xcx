// pages/sjdp/sjdp.js
const CHARTS = require('../../utils/wxcharts.js'); // 引入wx-charts.js文件
Page({
  data: {
    Yes_hid: false,
    NO_hid: true,
    house: [
      {
        id: 1,
        name: '嘉绿苑40#2-501',
        Type: 0
      },
      {
        id: 1,
        name: '封坛嘉绿苑40#2单元-501',
        Type: 1
      },
      {
        id: 1,
        name: '封坛嘉绿苑40#2单元-501',
        Type: 2
      },
      {
        id: 1,
        name: '嘉绿苑40#2-501',
        Type: 0
      },
      {
        id: 1,
        name: '嘉绿苑40#2-501',
        Type: 0
      },
    ]
  },

  ringShow: function () {
    for (var i in this.data.dataInfo) {
      var item = this.data.dataInfo[i];
      let pie = {
        canvasId: "ringGraph" + item.id, // 与canvas-id一致
        type: 'pie', // 图表类型，可选值为pie, line, column, area, ring
        series: [
          {
            name: "已安装",
            data: item.percentage,
            color: '#3ad61d'
          },
          {
            name: "未安装",
            data: 100 - item.percentage,
            color: '#ffb321'
          }
        ],
        width: 210,
        height: 180,
        title: { // 显示百分比
          name: item.name,
          color: '#333333',
          fontSize: 14
        },
        dataLabel: true,
        legend: true,
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ringShow()
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

  }
})