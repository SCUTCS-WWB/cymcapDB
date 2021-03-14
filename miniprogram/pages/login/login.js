// login.js

const app = getApp()

Page({

  data: {
    name: '',
    pwd: ''
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  inputUser: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  inputPwd: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },

  clean: function(e) {
    this.setData({
      pwd: "",
      name: ""
    })
  },

  onQuery: function() {
    console.log(this.data.name, this.data.pwd)
    const db = wx.cloud.database()
    db.collection('user').where({
      name: this.data.name,
      pwd: this.data.pwd
    }).get({
      success: res => {
        // this.setData({
        //   queryResult: JSON.stringify(res.data, null, 2)
        // })
        console.log('[数据库] [查询记录] 成功: ', res)
        if(res.data.length > 0) {
          wx.navigateTo({
            url: '../index/index',
          })
        } else {
          wx.showToast({
            title: '用户名或密码错误！',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
})