// pages/tjys/tjys.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
const net = require('../../utils/net.js')
const uploadAliyun = require('../../libs/aliyun/uploadAliyun.js')
var communityCode = wx.getStorageSync('communityCode');
import WxValidate from '../../utils/wxValidate.js'

Page({
  data: {
    imageUrl: app.globalData.imageUrl,
    items: [
      { name: '1', value: '1kg干粉灭火器' },
      { name: '2', value: '30型防毒面具' },
      { name: '3', value: '20米逃生绳' },
      { name: '4', value: '多功能安全手电' },
      { name: '5', value: '防滑手套' },
      { name: '6', value: '烟感设备' },
    ],
    list: [
      {
        tit: '选择相册或拍照',
        id: 1
      }
    ],
    photo: [],
    mgz: [],
    actionSheetHidden: true,
    type: "default",
    pics: [],
    picsLocalPaths: [],
    DImg_Hid: true,
    place_hid: false
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
    wx.removeStorageSync('photoArr')
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
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  zhaopian: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['获取相册或拍照'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 6,
            sizeType: ['original'],
            success: function (res) {
              wx.showLoading({
                title: '上传中',
                mask: true
              })
              //上传图片
              that.uploadPics(
                res.tempFilePaths,
                function (url) {
                  var pic = {};
                  pic.key = url
                  pic.index = that.data.pics.length
                  that.data.pics.push(pic)
                  that.setData({
                    pics: that.data.pics
                  })
                },
                function (res) {
                  console.log(res)
                  wx.showToast({
                    image: '/pages/images/error-icon.png',
                    title: '上传失败',
                  })
                }
              )
              //显示图片
              var timer = setInterval(function () {
                var arr = wx.getStorageSync('photoArr');
                if (arr) {
                  console.log(arr)
                  clearInterval(timer);
                  that.YcImg(arr);
                }
              })

            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  //延迟加载tupian
  YcImg: function (arr) {
    var that = this;

    that.setData({
      photo: arr,
      actionSheetHidden: !that.data.actionSheetHidden,
      type: 'primary'
    })
    wx.hideLoading()

  },
  // 删除选中照片
  close: function (e) {
    var that = this;
    var arr = that.data.photo;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var newArr = arr.filter(function (obj) {
      console.log(obj)
      return id !== obj;
    });
    that.setData({
      photo: newArr
    })
  },
  // 放大图
  FDimg: function (e) {
    var that = this;
    var arr = that.data.photo;
    var id = e.currentTarget.dataset.id;
    that.setData({
      DImg_Hid: false,
      Dimg: id,
      place_hid: true
    })
  },
  // 缩小图
  smallImg: function () {
    var that = this;
    that.setData({
      DImg_Hid: true,
      place_hid: false
    })
  },
  // 提交预审
  formSubmit: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var token = wx.getStorageSync('token');
    console.log(e.detail.value)

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      wx.showToast({
        title: `${error.msg} `,
        image: '/pages/images/error-icon.png',
        duration: 2000
      })
      return false
    } else {
      wx.request({
        url: Url + 'app/fir/save',
        method: 'POST',
        data: e.detail.value,//TODO 照片加入datazhong $$$$$$$
        header: {
          'content-type': 'application/json',
          "token": token,
          "communityCode": communityCode
        },
        success: function (res) {
          prevPage.data.ys_Arr = [];
          prevPage.data.page = 1;
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

        }
      })
    }

  },

  /**
   * 审核材料，照片提交
   */
  uploadPics: function (filePaths, successCallback, errorCallback) {
    var that = this;
    if (filePaths == undefined || filePaths == null || filePaths.length == 0) {
      return;
    }
    app.getAliyunConfig(function (aliyunConfig) {
      if (aliyunConfig == null) {
        wx.showToast({
          image: '/pages/images/error-icon.png',
          title: '上传失败',
        })
      } else {
        var houseId = that.data.houseId
        if (houseId == null) {
          houseId = 0
        }

        uploadAliyun(aliyunConfig, filePaths, houseId, successCallback, errorCallback)
      }
    })
  },
  // 表单验证规则
  initValidate() {
    // 验证字段的规则
    const rules = {
      address: {
        required: true,
      },
      
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      address: {
        required: '请输入上报内容',
      }
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },

})