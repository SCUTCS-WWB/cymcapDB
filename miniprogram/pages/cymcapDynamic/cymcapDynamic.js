// pages/databaseGuide/databaseGuide.js
const app = getApp()

Page({
  data: {
    openid: '',
    hidden:true,  // Loading...
    disabledSteady: false,
    disabledDynamic: false,   // 按钮禁用
    disabledMoment: false,
    queryResult: '',
    tempFileURL: '',
    volVal: 110,  // post：电压等级
    sectionVal: 1600,   // post: 电缆截面
    burywayVal: '直埋',   // post：敷设方式
    thermalresistivityVal: 0.8, // post：土壤热阻系数
    landWayVal: '单点接地', // post: 金属护套层接地方式
    DepthVal: '',
    depthVal: 0.7,  // num：敷设深度
    tempVal: 28,  // post：环境温度
    vol: [{vol:110, checked: 'true'}, {vol:220}], // 电压等级
    landWay: [{val:'单点接地', checked: 'true'}, {val:'交叉接地'}],  // 金属护套层接地方式
    Section: {110:[{val: 1600 ,checked: 'true'}, {val: 1200}, {val: 800}, {val: 500}], 
              220:[{val: 2500,checked: 'true'} ,{val: 2000}, {val: 1600}, {val: 1200}]},  // 电缆截面
    section: [{val: 1600 ,checked: 'true'}, {val: 1200}, {val: 800}, {val: 500}],
    thermalResistivity: [{val:0.8, checked: 'true'}, {val:1 }, {val:1.5 }, {val:2 }, {val:3 }], // 土壤热阻系数
    thermalResistivityTemp: [{val:0.8, checked: 'true'}, {val:1 }, {val:1.5 }, {val:2 }, {val:3 }], // 土壤热阻系数Temp
    envTemp: {'直埋': [{val: 35, checked:'true'}, {val:25}],
             '电缆沟': [{val: 28, checked:'true'}, {val:30}, {val:32}], 
             '埋管': [{val: 27, checked:'true'}, {val:29}, {val:31}], 
             '非开挖铺管': [{val: 24, checked:'true'}, {val:26}, {val:28}], 
             '空气桥架':[{val: 30, checked:'true'}, {val:40}]}, // 环境温度（0代表空气中[春夏秋35℃，冬25℃]，其他为埋地[水泥、正常、草地地面]）
    envtemp: [{val: 28, checked:'true'}, {val:30}, {val:32}],
    conditionSelectedList: [{
      value: '电压等级',
      selected: false ,
      title: '电压等级'
    },{
      value: '电缆截面',
      selected: false ,
      title: '电缆截面'
    },{
      value: '环境温度',
      selected: false ,
      title: '环境温度'
    },{
      value: '土壤热阻系数',
      selected: false ,
      title: '土壤热阻系数'
    },{
      value: '金属护套层接地方式',
      selected: false ,
      title: '金属护套层接地方式'
    }]
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
      })
    }

    this.setData({
      DepthVal: options.DepthVal,
      burywayVal: options.burywayVal
    })

    // 电缆沟2回    ===>    环境温度
    if (this.data.burywayVal == "电缆沟" && this.data.DepthVal == "2回") {
      this.setData({
        envtemp: [{val: 30, checked:'true'}, {val: 40}],
        tempVal: parseFloat(30)   
      })
    } else {
      this.setData({
        envtemp: this.data.envTemp[this.data.burywayVal],
        tempVal: parseFloat(this.data.envTemp[this.data.burywayVal][0].val)
      })
    }

    // 空气桥架和隧道/电缆沟2回    ===>    土壤热阻系数
    if (this.data.burywayVal == "空气桥架" || this.data.burywayVal == "隧道" || (this.data.burywayVal == "电缆沟" && this.data.DepthVal == "2回")) {
      this.setData({
          thermalresistivityVal: "无",
          thermalResistivity: [{val: "无", checked: 'true'}]
      })
    } else {
      this.setData({
          thermalresistivityVal: this.data.thermalResistivity[0].val,
          thermalResistivity: this.data.thermalResistivityTemp
      })
    }
    
  },

  checkboxChange: function(e) {
    console.log('checkboxChange e:',e);
    let string = "conditionSelectedList["+e.target.dataset.index+"].selected"
        this.setData({
            [string]: !this.data.conditionSelectedList[e.target.dataset.index].selected
        })
        let detailValue = this.data.conditionSelectedList.filter(it => it.selected).map(it => it.value)
        console.log('所有选中的值为：', detailValue)
  },

  // ------------------------------------------       电压关联与优先度： 电压等级 > 电缆截面       ---------------------------------
  // 改变电压等级
  volChange: function (e) {
    this.setData({
      volVal: parseFloat(e.detail.value),
      section: this.data.Section[e.detail.value],
      sectionVal: parseFloat(this.data.Section[e.detail.value][0].val),
    })
  },

  // 改变电缆截面
  sectionChange: function(e) {
    this.setData({
      sectionVal: parseFloat(e.detail.value),
    })
  },

  // ----------------------------    温度关联与优先度： 敷设方式 > 填埋深度 > 环境温度    --------------------------------------
  // 改变敷设方式   

  buryWayChange: function () {

  },

  tempChange: function(e) {
    this.setData({
      tempVal: parseFloat(e.detail.value)
    })
  },

  // ------------------------------------  其他  -----------------------------------------

  // 改变热阻系数
  thermalResistivityChange: function(e) {
    console.log(this.data.DepthVal)
    console.log(this.data.burywayVal)
    this.setData({
      thermalresistivityVal: parseFloat(e.detail.value)
    })
  },

  // 接地方式
  landWayChange: function(e) {
    this.setData({
      landWayVal: e.detail.value
    })
  },

  // -----------------------------------   稳态载流量    ------------------------------------------
  onQuerySteady: function() {
    console.log(this.data.volVal,this.data.burywayVal,this.data.DepthVal,this.data.landWayVal,this.data.tempVal,this.data.thermalresistivityVal,this.data.sectionVal,)
    console.log( this.data.conditionSelectedList.filter(it => it.selected).map(it => it.value))
    // 显示加载
    this.setData({
      hidden: false,
      disabledSteady: true
    });
    // 查询
    wx.cloud.callFunction({
      name: "steady",
      data: {
        电压等级: this.data.volVal,
        敷设方式: this.data.burywayVal,
        回路数和深度: this.data.DepthVal,
        金属护套层接地方式: this.data.landWayVal,
        环境温度: this.data.tempVal,
        土壤热阻系数: this.data.thermalresistivityVal,
        电缆截面: this.data.sectionVal,
        selectedVal:  this.data.conditionSelectedList.filter(it => it.selected).map(it => it.value)
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
          disabledSteady: false
        });
      }
    })
  },

  // -----------------------------------   动态载流量    ------------------------------------------
  onQueryDynamic: function() {
    this.setData({
      hidden: false,
      disabledDynamic: true
    });
    wx.cloud.callFunction({
      name: "dynamic",
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
      fail: err => {
        console.log(err)
      },
      complete: () => {
        let that = this;
        that.setData({
          hidden: true,
          disabledDynamic: false
        });
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