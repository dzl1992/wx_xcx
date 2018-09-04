const TxvContext = requirePlugin("tencentvideo");

Page({
  data: {
    videoUrls: '',
    token: '',
    file_id: '',
    videUrl: ''
  },
  
 

  onLoad: function (options) {
    this.setData({
      file_id: 'a0323w0u5hk'
    });
    
    let player1 = TxvContext.getTxvContext('txv1');
  },
  
  onReady: function () {
    // 页面渲染完成
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})