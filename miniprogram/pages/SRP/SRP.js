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


  // -----------------------------------   短时载流量    ------------------------------------------
  onQueryMoment: function() {
    this.setData({
      hidden: false,
      disabledMoment: true
    });
    wx.cloud.callFunction({
      name: "moment",
      data: {
        a: 1,
      },
      success: res => {
        let that = this;
        wx.cloud.getTempFileURL({   //获取文件下载地址（24小时内有效）
          fileList:[res.result.fileID],
          success: res=> {
            that.setData({
              tempFileURL: res.fileList[0].tempFileURL,
              showUrl: true
            })
            wx.setClipboardData({ //复制刚获取到链接，成功后会自动弹窗提示已复制
              data: that.data.tempFileURL,
              success: res=> {
                wx.getClipboardData({
                  success: (res) => {
                    console.log(res.data)
                  },
                })
              }
            })
          }
        })
      },
      fail: err=> {
        console.log(err)
      },
      complete: () => {
        let that = this;
        that.setData({
          hidden: true,
          disabledMoment: false
        });
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