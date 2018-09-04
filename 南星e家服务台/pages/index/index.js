const app = getApp()
const Url = app.globalData.serverUrl;//服务器地址
var communityCode = wx.getStorageSync('communityCode');
Page({
  data: {
    userInfo: {},
    currentTab: 0,
    currentTabImg: '../images/rent-0.jpg',
    modelHid: true,
    PhoneHid: true,
    loginHid:true,
    phone: '',
    value: '',
    swiperHeight: '',
    swipee3_hid: true,
    swipee4_hid: true,
    APPHid: true,
    SCHid: true,
    role: "",
    openId: ''
  },
  onLoad: function () {
    var that = this
    var value = wx.getStorageSync('user');
    var phone = wx.getStorageSync('phone');
    
    that.setData({
      swiperHeight: app.deviceInfo.windowHeight + 60,
      value: value,
      phone: phone,
    })
  
    if (phone) {
      that.setData({
        phone: phone,
        PhoneHid: true
      })
    } else {
      that.setData({
        PhoneHid: false
      })
    }

    if (value) {
      that.setData({
        value: value,
        modelHid: true
      })
    } else {
      that.setData({
        modelHid: false
      })
    }
    

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
    var that = this
    var role = wx.getStorageSync('role');
    var Time = wx.getStorageSync('Time');
    var Ytime = parseInt(wx.getStorageSync('Time')) - 7200;//过期时间
    var todyT = Math.round(new Date().getTime() / 1000).toString();//当前时间
    var openId = wx.getStorageSync('openId');
    that.setData({
      openId: openId
    })
    if (Time && (todyT > Ytime)) {
      console.log(0)
      //重新登录
      that.setData({
        loginHid: false,
        swipee3_hid: true,
        swipee4_hid: false
      })
    } else if (Time && (todyT < Ytime)) {
      //没有过期
      console.log(1)
      if (role != 0 && role != 1 && role != 2) {
        that.setData({
          swipee3_hid: true,
          swipee4_hid: false
        })
      } else if (role == 0 || role == 1 || role == 2) {
        that.setData({
          swipee3_hid: false,
          swipee4_hid: true
        })
      }
    } else if (!Time) {
      console.log(2)
      //没有登录
      that.setData({
        swipee3_hid: true,
        swipee4_hid: false
      })
    }
    
  },
  /** 
   * 点击tab切换 
   */
  changeSwiperTab: function (e) {
    var that = this;
    var selectTab = e.target.dataset.tabId;
    if (selectTab == 3) {
      // console.log(that.data.currentTab)
      that.setData({
        currentTab: 2,
        currentTabImg: '../images/rent-' + 3 + '.jpg',
      })
    }
    else if (that.data.currentTab == selectTab) {
      return false;
    } else {
      that.setData({
        currentTab: selectTab,
        currentTabImg: '../images/rent-' + selectTab + '.jpg',
      })
    }
  },

  swiperBindChange: function (e) {
    var that = this;
    var selectTab = e.detail.current
    var s3 = that.data.swipee3_hid;
    var s4 = that.data.swipee4_hid;
    if (!s3 && s4) {
      if (selectTab == 2) {
        that.setData({
          currentTab: 2,
          currentTabImg: '../images/rent-' + 2 + '.jpg',
        })
      }
      else if (that.data.currentTab == selectTab) {
        return false;
      } else {
        that.setData({
          currentTab: selectTab,
          currentTabImg: '../images/rent-' + selectTab + '.jpg',
        })
      }
    } else {
      if (selectTab == 2) {
        that.setData({
          currentTab: 2,
          currentTabImg: '../images/rent-' + 3 + '.jpg',
        })
      }
      else if (that.data.currentTab == selectTab) {
        return false;
      } else {
        that.setData({
          currentTab: selectTab,
          currentTabImg: '../images/rent-' + selectTab + '.jpg',
        })
      }
    }
    
  },
  // 用户不同意获取个人信息
  No_UserInfo: function () {
    var that = this;
    that.setData({
      modelHid: true,
      loginHid: true
    })
  },
  //获取用户信息
  onGotUserInfo: function (e) {
    var that = this;
    var code = wx.getStorageSync('code'),
      encryptedData = e.detail.encryptedData,
      rawData = e.detail.rawData,
      signature = e.detail.signature,
      iv = e.detail.iv;
    wx.setStorageSync('user', e.detail.userInfo)

    that.setData({
      APPHid: true,
      SCHid: true
    })
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      that.setData({
        modelHid: true,
        userInfo: e.detail.userInfo
      })
      wx.request({
        url: Url + 'app/wechat/getUserInfo',
        data: {
          loginCode: code,
          encryptedData: encryptedData,
          iv: iv,
          rawData: rawData,
          signature: signature
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          "communityCode": '330102008'
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.setStorageSync('openId', res.data.data.openId);
            that.setData({
              openId: res.data.data.openId
            })
          } else {
            wx.showToast({
              title: "异常错误",
              icon: 'loading',
              duration: 2000
            })
          }
        },
        flai: function (res) {
          console.log("错误")
        }
      })

    } else {
      //用户按了拒绝按钮
      that.setData({
        modelHid: true
      })
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '小程序必须获取您的头像昵称才能正常使用',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              modelHid: false
            })
          }
        }
      })
    }

  },
  // 用户不同意获取手机号码
  No_Phone: function () {
    var that = this;
    that.setData({
      PhoneHid: true,
      loginHid: true,
      swipee3_hid: true,
      swipee4_hid: false
    })
  },
  // 获取手机号码
  PhoneInfo: function (e) {
    var that = this;
    var code = wx.getStorageSync('code'),
      encryptedData = e.detail.encryptedData,
      iv = e.detail.iv;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      //用户按了拒绝按钮
      that.setData({
        PhoneHid: true,
        loginHid:true,
      })
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '小程序必须获取您的手机号码才能正常使用',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              PhoneHid: false,
              loginHid: true,
            })
          }
        }
      })
    } else {
      //用户按了允许授权按钮
      that.setData({
        PhoneHid: true,
        loginHid: true,
      });
      wx.request({
        url: Url + 'app/wechat/getPhoneNumber',
        data: {
          loginCode: code,
          encryptedData: encryptedData,
          iv: iv
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          "communityCode": '330102008'
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.setStorageSync('phone', res.data.data.phone);
            that.login(res.data.data.phone);//登录
            app.onLaunch()//重新获取LoginCode
            that.setData({
              modelHid: false
            })
          } else {
            wx.showToast({
              title: "异常错误",
              icon: 'loading',
              duration: 2000
            })
          }

        },
        flai: function (res) {
          console.log("错误")
        }
      })

    }
  },
  // 登录
  login: function (Phone) {
    var that = this;
    var ts = Math.round(new Date().getTime() / 1000).toString();
    wx.request({
      url: Url + 'app/wechat/login',
      data: {
        phone: Phone
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "communityCode": '330102008'
      },
      success: function (res) {
        var role = res.data.data.role;
        var time = parseInt(res.data.data.expire) + parseInt(ts);
        // var role = 4;
        wx.setStorageSync('token', res.data.data.token)
        wx.setStorageSync('role', res.data.data.role)
        wx.setStorageSync('Time', time)
        if (role != 0 && role != 1 && role != 2) {
          that.setData({
            swipee3_hid: true,
            swipee4_hid: false
          })
        } else if (role == 0 || role == 1 || role == 2) {
          that.setData({
            swipee3_hid: false,
            swipee4_hid: true
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "出现错误",
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '转发',
      path: '//pages/index/index'
    }
  },

  // 跳转小程序
  zkej: function () {
    wx.navigateToMiniProgram({
      appId: 'wx21cac9cbbf8d5d49',
      path: '',
      success(res) {
        console.log(0)
        // 打开成功
      }
    })
  },
  // 拨打求助电话
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '057181022075'
    })
  },

  // 入住登记
  rzdj: function () {
    wx.navigateTo({
      url: '../rzdj/rzdj',
    })
  },
  // 装锁上报
  zssb: function () {
    wx.navigateTo({
      url: '../zssb/zssb',
    })
  },
  // 社工排名
  sgpm: function () {
    wx.navigateTo({
      url: '../gr_pm/gr_pm',
    })
  },
  // 出租申请
  czsq: function () {
    wx.navigateTo({
      url: '../czsq/czsq',
    })
  },
  // 开卡申请
  kksq: function () {
    var that = this;
    that.setData({
      APPHid: false
    })
  },
  // 关闭开卡申请模态框---进入客服对话
  HIdAPP: function () {
    var that = this;
    var openId = that.data.openId;

    if (openId) {
      wx.request({
        url: Url + '/app/wechat/message/' + openId,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
        },
        fail: function () {
          wx.showToast({
            title: "出现错误",
            icon: 'loading',
            duration: 2000
          })
        }
      })
    } else {
      that.setData({
        APPHid: false
      })
    }
    
  },
  // 上城公众号
  SCgzh: function() {
    var that = this;
    var openId = that.data.openId;
    console.log(openId)
    if (openId) {
      wx.request({
        url: Url + '/app/wechat/message/wj/' + openId,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
        },
        fail: function () {
          wx.showToast({
            title: "出现错误",
            icon: 'loading',
            duration: 2000
          })
        }
      })
    } else {
      that.setData({
        SCHid: false
      })
    }
  },
  // 取消开卡申请
  Qxkksq: function() {
    var that = this;
    that.setData({
      APPHid: true,
      SCHid: true
    })
  },
  // 消防安全
  xfaq: function () {
    wx.navigateTo({
      url: '../xfaq/xfaq',
    })
  },
  // 数据大屏
  sjdp: function () {
    wx.navigateTo({
      url: '../sjdp/sjdp',
    })
  },
  // 三色预警
  ssyj: function () {
    wx.navigateTo({
      url: '../ssyj/ssyj',
    })
  },
  // 消防预审
  xfys: function () {
    wx.navigateTo({
      url: '../xfys/xfys',
    })
  },
  // 居住证受理
  XinHZR: function () {
    wx.navigateTo({
      url: '../jzzsl/jzzsl',
    })
  },
  // 安全规定
  aqgd: function () {
    wx.navigateTo({
      url: '../aqgd/aqgd',
    })
  },
  // 房屋委托
  fwwt: function () {
    wx.navigateToMiniProgram({
      appId: 'wx21cac9cbbf8d5d49',
      path: '',
      success(res) {
        console.log(0)
        // 打开成功
      }
    })
  },
  // 消防宣传
  xfxc: function () {
    wx.navigateTo({
      url: '../xfxc/xfxc',
    })
  },
  // 投诉上报
  Tousu: function () {
    wx.navigateTo({
      url: '../tssb/tssb',
    })
  }

})
