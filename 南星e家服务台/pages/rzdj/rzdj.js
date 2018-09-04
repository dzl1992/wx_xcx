// pages/rzdj/rzdj.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var until = require('../../utils/untils.js');
var communityCode = wx.getStorageSync('communityCode');
import WxValidate from '../../utils/wxValidate.js'
const uploadAliyun = require('../../libs/aliyun/uploadAliyun1.js')
Page({
  data: {
    array: ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族",
      "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
      "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族",
      "俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"],
    index: 0,
    region: ['浙江省', '杭州市', '西湖区'],
    customItem: '',
    photo: [],
    photo_Z: [],
    photo_F: [],
    photoB_F: [],
    mgz: [],
    photo_MG: [],
    houseId: null,
    actionSheetHidden: true,
    Mgz_Hidden: true,
    list: [
      {
        tit: '获取相册或拍照',
        id: 1
      }
    ],
    items: [
      { name: '1', value: '已婚' },
      { name: '0', value: '未婚' },
      { name: '2', value: '离异' }
    ],
    pics: [],
    m_pics: [],
    picsLocalPaths: [],
    Dimg: "",
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
    wx.removeStorageSync('photoArr1')
    wx.removeStorageSync('photoArr2')
    wx.removeStorageSync('photoArr3')
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
  // length
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  // 籍贯选择
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  // 民族选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //身份照
  zhaopian: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['获取相册或拍照'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            success: function (res) {
              wx.showLoading({
                title: '上传中',
                mask: true
              })
              that.setData({
                photo_Z: res.tempFilePaths,
                houseId: 1
              })
              //上传图片
              that.uploadPics(
                res.tempFilePaths,
                function (url) {
                  wx.hideLoading()
                },
                function (res) {
                  wx.showToast({
                    image: '/pages/images/error-icon.png',
                    title: '上传失败',
                  })
                },
                that.data.houseId
              )
              //显示图片
              var timer = setInterval(function () {
                var arr = wx.getStorageSync('photoArr1');
                if (arr) {
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

  // 免冠照
  mgz: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['获取相册或拍照'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            success: function (res) {
              wx.showLoading({
                title: '上传中',
                mask: true
              })
              //提前显示
              that.setData({
                photo_MG: res.tempFilePaths,
                houseId: 3
              })
              //上传图片
              that.uploadPics(
                res.tempFilePaths,
                function (url) {
                  wx.hideLoading()
                },
                function (res) {
                  wx.showToast({
                    image: '/pages/images/error-icon.png',
                    title: '上传失败',
                  })
                },
                that.data.houseId
              )
              //显示图片
              var timer = setInterval(function () {
                var arr = wx.getStorageSync('photoArr3');
                if (arr) {
                  clearInterval(timer);
                  that.M_YcImg(arr)
                }
              })

            },
            complete: function () {

            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  // 省份证反面
  zhaopian_F: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['获取相册或拍照'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            success: function (res) {
              wx.showLoading({
                title: '上传中',
                mask: true
              })
              //提前显示
              that.setData({
                photoB_F: res.tempFilePaths,
                houseId: 2
              })
              //上传图片
              that.uploadPics(
                res.tempFilePaths,
                function (url) {
                  wx.hideLoading()
                },
                function (res) {
                  wx.showToast({
                    image: '/pages/images/error-icon.png',
                    title: '上传失败',
                  })
                },
                that.data.houseId
              )
              //显示图片
              var timer = setInterval(function () {
                var arr = wx.getStorageSync('photoArr2');
                if (arr) {
                  clearInterval(timer);
                  that.F_sfzImg(arr);
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

  //身份证反面延迟加载tupian
  F_sfzImg: function (arr) {
    var that = this;
    var P = arr.slice(-1, 1);
    that.setData({
      photo_F: P,
    })

  },

  //身份证正面延迟加载tupian
  YcImg: function (arr) {
    var that = this;
    var P = arr.slice(-1, 1);
    console.log(P)
    that.setData({
      photo: P,
    })
  },
  // 免冠照延迟加载tupian
  M_YcImg: function (arr) {
    var that = this;
    var P = arr.slice(-1, 1);
    console.log(P)
    that.setData({
      mgz: P,
    })
  },
  // 删除选中照片
  close: function (e) {
    var that = this;
    var arr = that.data.photo_Z;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var newArr = arr.filter(function (obj) {
      return id !== obj;
    });
    console.log(newArr)
    that.setData({
      photo_Z: newArr
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

  // 关闭省份证反面
  close_F: function (e) {
    var that = this;
    var arr = that.data.photoB_F;
    var id = e.currentTarget.dataset.id;
    var newArr = arr.filter(function (obj) {
      return id !== obj;
    });
    that.setData({
      photoB_F: newArr
    })
  },

  // 删除免冠照
  close_mgz: function (e) {
    var that = this;
    var arr = that.data.photo_MG;
    var id = e.currentTarget.dataset.id;
    var newArr = arr.filter(function (obj) {
      return id !== obj;
    });
    that.setData({
      photo_MG: newArr
    })
  },
  // 表单提交
  formSubmit: function (e) {
    var jg = e.detail.value.nativePlace.join('-')
    e.detail.value.nativePlace = jg;
    console.log(e.detail.value)
    var that = this;
    var token = wx.getStorageSync('token');
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg}`,
        image: '/pages/images/error-icon.png',
        duration: 2000
      })
      return false
    } else {
      wx.request({
        url: Url + 'app/renter/apply',
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
            image: '/pages/images/error-icon.png' + 2,
            title: '失败',
          })
        }
      })
    }

  },
  /**
   * 审核材料，照片提交
   */
  uploadPics: function (filePaths, successCallback, errorCallback, houseId) {
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
        // var houseId = that.houseId
        // if (houseId == null) {
        //   houseId = 0
        // }
        uploadAliyun(aliyunConfig, filePaths, houseId, successCallback, errorCallback)
      }
    })
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
      maritalStatus: {
        required: true,
      },
      compay: {
        required: true,
        minlength: 4,
        maxlength: 30,
      },
      address: {
        required: true,
        minlength: 5,
        maxlength: 30,
      },
      idCardFrontPic: {
        required: true,
      },
      idCardBackPic: {
        required: true,
      },
      avatarUrl: {
        required: true,
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
      maritalStatus: {
        required: '请勾选婚姻状态',
      },
      compay: {
        required: '请输入工作单位',
      },
      address: {
        required: '请输入房屋位置',
      },
      idCardFrontPic: {
        required: '请上传身份证件',
      },
      idCardBackPic: {
        required: '请上传身份证件',
      },
      avatarUrl: {
        required: '请上传免冠照',
      },
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },

})