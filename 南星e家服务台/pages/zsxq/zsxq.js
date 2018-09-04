// pages/zsxq/zsxq.js
const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var until = require('../../utils/untils.js');
var communityCode = wx.getStorageSync('communityCode');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xgfalse: true,
    sb_rison: true,
    type: 'default',
    jjr_Hid: true,
    success_hid: true,
    fail_hid: true,
    obj: {},
    id: '',
    status: '',
    failMessage: '',
    Second21_hid: true,//第二步成功
    Second22_hid: true,//第二步进行中(社工锁匠)
    Second_jjr_hid: true,//第二步进行中（经纪人确认）
    Second_sb_hid: true,//第二步失败（经纪人和锁匠）
    Second_sb_sg_hid: true,//第二步失败（社工重新上报）
    Third21_hid: true,//第三步进行中（锁匠接单）
    Third_ck_hid: true,//第三步进行中 （经纪人和社工查看）
    Third_cg_hid: true,//第三步成功 
    Fourth_jjrQr_hid: true,//第四步（经纪人反馈）
    Fourth_ck_hid: true,//第四步进行中（社工、锁匠 查看）
    Fourth_Yes_hid: true,//第四步 成功
    Fourth_No_hid: true,//第四步失败
    Forth_success: true,
    Forth_file: true,
    Third_height: '0rpx',
    Fourth_height: '0rpx',
    suojiang_type: 'default',
    suojiang_name: '',
    suojiang_phone: '',
    jjrFk: '',
    photo: [],
    jjr_bhType: 'default',
    jjr_BH_YY: ''
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
    var page = info.Suo_xq
    var suojiang_phone = wx.getStorageSync('phone');
    that.setData({
      id: id,
      suojiang_phone: suojiang_phone
    })
    for(var val in page) {
      if(page[val].id == id) {
        that.setData({
          obj: page[val]
        })
      }
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var status = that.data.obj.status;//当前信息状态 0-待处理，10-核查信息正确，11-核查信息有误，20-锁匠接单，30-安装成功，31-安装失败
    var step = that.data.obj.step;//当前信息步骤 1： 社工提交信息完成， 2 经纪人核查信息完成， 3 锁匠接单完成， 4 经纪人反馈完成
    // var role = wx.getStorageSync('role');//当前角色 0-社工，1-中介，2-锁匠
    console.log(status)
    console.log(step)
     var role = 1;
    // 以角色划分 社工 锁匠 （查看社工信息房东确认中）
    if ((role == 0 || role == 2)  && status == 0 && step == 1) {
      that.setData({
        Second22_hid: false,//第二步进行中(社工锁匠)
      })
    } else if ((role == 0 || role == 1) && status == 10 && step == 2) {
      //社工、经纪人 查看房东信息确认成功 锁匠接单中
      that.setData({
        Second21_hid: false,//第二步成功
        Third_ck_hid: false,//第三步进行中
        Third_height: '200rpx',
      })
    } else if (role == 2 && status == 10 && step == 2) {
      // 锁匠接单中
      that.setData({
        Second21_hid: false,//第二步成功
        Third21_hid: false,//第三步进行中
        Third_height: '200rpx',
      })
      that.pageScrollToBottom()
    } else if (role == 0 && status == 11 && step == 2) {
      //社工 房东信息错误 重新上报
      that.setData({
        Second_sb_sg_hid: false,//第二步成功
      })
    } else if ((role == 1 || role == 2) && status == 11 && step == 2) {
      //经纪人 锁匠 房东信息错误 查看
      that.setData({
        Second_sb_hid: false,//第二步成功
      })
    } else if ((role == 0 || role == 2) && status == 20 && step == 3) {
      //社工\锁匠 查看锁匠接单成功 经纪人反馈中
      that.setData({
        Second21_hid: false,//第二步成功
        Third_cg_hid: false,//第三步成功
        Fourth_ck_hid: false,//第四步进行中
        Third_height: '200rpx',
        Fourth_height: '200rpx'
      })
    } else if (role == 1&& status == 20 && step == 3) {
      // 经纪人反馈中
      that.setData({
        Second21_hid: false,//第二步成功
        Third_cg_hid: false,//第三步成功
        Fourth_jjrQr_hid: false,//第四步进行中
        Third_height: '200rpx',
        Fourth_height: '200rpx'
      })
      that.pageScrollToBottom()
    }  else if ((role == 0 || role == 2 || role == 1) && status == 30 && step == 4) {
      //社工\锁匠\经纪人 查看信息反馈成功
      that.setData({
        Second21_hid: false,//第二步成功
        Third_cg_hid: false,//第三步成功
        Fourth_Yes_hid: false,//第四步成功
        Third_height: '200rpx',
        Fourth_height: '200rpx'
      })
    } else if ((role == 0 || role == 2 || role == 1) && status == 31 && step == 4) {
      //社工\锁匠\经纪人 查看信息反馈失败
      that.setData({
        Second21_hid: false,//第二步成功
        Third_cg_hid: false,//第三步成功
        Fourth_No_hid: false,//第四步成功
        Third_height: '200rpx',
        Fourth_height: '200rpx'
      })
    } else if (role == 1 && status == 0 && step == 1 ) {
      //经纪人 确认房东信息
      that.setData({
        Second_jjr_hid: false,//第二步进行中(经纪人 确认房东信息)
      })     
    } 
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
  // 修改地址
  xgaddress: function(e) {
    var that = this;
    var Xaddress = e.detail.value;
    that.data.obj.address = Xaddress;
  },
  // 修改过道锁
  xggds: function(e) {
    var that = this;
    var Xgds = e.detail.value;
    that.data.obj.hallwayLock = Xgds;
  },
  // 修改入户锁
  xgrhs: function (e) {
    var that = this;
    var Xrhs = e.detail.value;
    that.data.obj.doorLock = Xrhs;
  },
  // 修改确定
  XG_qd: function() {
    var that = this;
    var data = {
      id: that.data.obj.id,
      address: that.data.obj.address,
      doorLock: that.data.obj.doorLock,
      hallwayLock: that.data.obj.hallwayLock
    };
    var token = wx.getStorageSync('token');
    wx.request({
      url: Url + 'app/lockinstall/save',
      data: data,
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
      },
      fail: function(e) {
        wx.showToast({
          image: '/pages/images/error-icon.png',
          title: '失败',
        })
      }
    })
  },
  // 房东确认-结果改变
  radioChange: function(e) {
    var that = this;
    var jg = e.detail.value;
    console.log(jg)
    that.setData({
      status: jg
    })
    if (jg == 0) {
      that.setData({
        type: 'default',
        sb_rison: false
      })
    } else {
      that.setData({
        type: 'primary',
        sb_rison: true
      })
    }
  },
  // 第四步 经纪人选择改变现实
  Fourth_radioChange: function(e) {
    var that = this;
    var val = e.detail.value;
    that.setData({
      jjrFk: val
    })
    if (val == 1) {
      that.setData({
        Forth_success: false,
        Forth_file: true
      })
    } else {
      that.setData({
        Forth_success: true,
        Forth_file: false
      })
      that.pageScrollToBottom()
    }
  },
  // 经纪人 审核信息
  fangdongqueren: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var obj = {
      id: that.data.id,
      status: that.data.status,
      failMessage: that.data.failMessage
    }
    for(var val in obj) {
      if(obj[val] == '') {
        delete obj[val]
      }
    }
    wx.request({
      url: Url + 'app/lockinstall/audit',
      data: obj,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "token": token,
        "communityCode": communityCode
      },
      success: function (res) {
        if (res.data.code == 0) {
          prevPage.data.Suo_xq = [];//改变上个页面的数据
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
      },
      fail: function (e) {
        wx.showToast({
          image: '/pages/images/error-icon.png',
          title: '失败',
        })
      }
    })
  },
  // 填写失败原因
  rison_Xr: function (e) {
      length = e.detail.cursor;
    console.log(e.detail.value)
    if (length >= 1) {
      this.setData ({
          type: "primary",
          failMessage: e.detail.value
        })
      
    }
  },
  // 锁匠输入 改变按钮
  suojiang_name: function (e) {
    var length = e.detail.cursor;
    if (length >= 1) {
      this.setData({
        suojiang_type: "primary",
        suojiang_name: e.detail.value
      })

    }
  },
// 锁匠角色 锁匠接单
  suojiangjiedan: function() {
    var that=this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var token = wx.getStorageSync('token');
    var obj = {
      id: that.data.id
    };
    wx.request({
      url: Url + 'app/lockinstall/locksmithReceiving',
      data: obj,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "token": token,
        "communityCode": communityCode
      },
      success: function (res) {
        if (res.data.code == 0) {
          prevPage.data.Suo_xq = [];//改变上个页面的数据
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
      },
      fail: function(res) {
        wx.showToast({
          image: '/pages/images/error-icon.png',
          title: '失败',
        })
      }
    })
  },

  // 经纪人角色 反馈结果选择成功
  jjrFk_success: function() {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var token = wx.getStorageSync('token');
    var obj = {
      id: that.data.id,
      status: that.data.jjrFk
    };
    wx.request({
      url: Url + 'app/lockinstall/confirm',
      data: obj,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token,
        "communityCode": communityCode
      },
      success: function (res) {
        if (res.data.code == 0) {
           prevPage.data.Suo_xq = [];//改变上个页面的数据
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
  },
  // 经纪人驳回原因
  jjr_bhyy: function (e) {
    length = e.detail.cursor;
    if (length >= 1) {
      this.setData({
        jjr_bhType: "primary",
        jjr_BH_YY: e.detail.value
      })

    }
  },
  // 经纪人选择驳回 
  jjr_bh: function() {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var token = wx.getStorageSync('token');
    var obj = {
      id: that.data.id,
      status: that.data.jjrFk,
      pics:that.data.photo,
      failMessage: that.data.jjr_BH_YY
    };
    for (var value in obj) {
      if (obj[value] == "") {
        delete obj[value]
      }
    }
    wx.request({
      url: Url + 'app/lockinstall/confirm',
      data: obj,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token,
        "communityCode": communityCode
      },
      success: function (res) {
        if (res.data.code == 0) {
          prevPage.data.Suo_xq = [];//改变上个页面的数据
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
  },
  //修改地址
  XgAddress: function() {
    var that = this;
    that.setData({
      xgfalse: false
    })
    
  },
  //打电话
  Call: function () {
    var that = this;
    var phone = that.data.obj.landlordPhone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
})