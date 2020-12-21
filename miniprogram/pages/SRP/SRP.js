// pages/databaseGuide/databaseGuide.js
const app = getApp()

Page({
  data: {
    openid: '',
    hidden: true,
    filename: ''
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  // -------------------------------------  上传word文件    ------------------------------------
  upLoadAction: function(e) {
    let that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: res => {
        let filename = res.tempFiles[0].name
        that.setData({filename:filename});

        wx.cloud.uploadFile({
          cloudPath: './srp/' + res.tempFiles[0].name,
          filePath: res.tempFiles[0].path, // 文件路径
          success: res => {
            // get resource ID
            console.log(res.fileID)
          },
          fail: err => {
            // handle error
          }
        })
      }
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})