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
    DepthVal: '1回0.7m',   // post：回路数和深度
    depthVal: 0.7,  // num：敷设深度
    tempVal: 28,  // post：环境温度
    vol: [{vol:110, checked: 'true'}, {vol:220}], // 电压等级
    landWay: [{val:'单点接地', checked: 'true'}, {val:'交叉接地'}],  // 金属护套层接地方式
    Section: {110:[{val: 1600 ,checked: 'true'}, {val: 1200}, {val: 800}, {val: 500}], 
              220:[{val: 2500,checked: 'true'} ,{val: 2000}, {val: 1600}, {val: 1200}]},  // 电缆截面
    section: [{val: 1600 ,checked: 'true'}, {val: 1200}, {val: 800}, {val: 500}],
    thermalResistivity: [{val:0.8, checked: 'true'}, {val:1 }, {val:1.5 }, {val:2 }, {val:3 }], // 土壤热阻系数
    thermalResistivityTemp: [{val:0.8, checked: 'true'}, {val:1 }, {val:1.5 }, {val:2 }, {val:3 }], // 土壤热阻系数Temp
    buryWay: [{way: '直埋', checked: 'true'}, {way: '电缆沟' }, {way: '埋管'}, {way: '非开挖铺管'}, {way: '空气桥架'}, {way: '隧道'}],  // 敷设方式
    buryDepth: {'直埋': [{val: '1回0.7m', checked:'true'}, {val: '2回0.7m'}], 
                '电缆沟': [{val: '2回0.7m', checked:'true'},{val: '3回0.7m'},{val: '4回0.7m'},{val: '6回0.7m'}],
                '埋管': [{val: '1回0.7m', checked:'true'}, {val: '2回0.7m'},
                        {val: '3回1.2m'}, {val: '4回1.2m'},{val: '6回1.2m'}],
                '非开挖铺管': [{val: '1回3m', checked:'true'},{val: '2回3m'},
                        {val: '3回3m'},{val: '4回3m'}],
                '空气桥架': [{val: '4回', checked:'true'}],
                '隧道': [{val: '8回5m', checked:'true'}]}, // 填埋深度
    burydepth: [{val: '1回0.7m', checked:'true'}, {val: '2回0.7m'}], // 填埋深度
    envTemp: {0: [{val: 35, checked:'true'}, {val:25}],
             0.7: [{val: 28, checked:'true'}, {val:30}, {val:32}], 
             1.2: [{val: 27, checked:'true'}, {val:29}, {val:31}], 
             3: [{val: 24, checked:'true'}, {val:26}, {val:28}], 
             5:[{val: 30, checked:'true'}, {val:40}]}, // 环境温度（0代表空气中[春夏秋35℃，冬25℃]，其他为埋地[水泥、正常、草地地面]）
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
      value: '敷设方式',
      selected: false ,
      title: '敷设方式'
    },{
      value: '回路数和深度',
      selected: false ,
      title: '回路数和深度'
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
        openid: app.globalData.openid
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

  // 格式转换，1回 => depth: 0, 1回0.7m => depth: 0.7
  getDepth: function(strDepth) {
    if(strDepth.split('回')[1] == "") {
      return 0
    } else {
      return parseFloat(strDepth.split('回')[1]);
    }
  },

  buryWayChange: function (e) {
    this.setData({
      burywayVal: e.detail.value,
      burydepth: this.data.buryDepth[e.detail.value],
      DepthVal: this.data.buryDepth[e.detail.value][0].val,
      depthVal: this.getDepth(this.data.buryDepth[e.detail.value][0].val),
    })

    // 电缆沟2回0.7m    ===>    环境温度
    if (e.detail.value == "电缆沟" && this.data.DepthVal == "2回0.7m") {
      this.setData({
        envtemp: [{val: 30, checked:'true'}, {val: 40}],
        tempVal: parseFloat(30)
      })
    } else {
      this.setData({
        envtemp: this.data.envTemp[this.getDepth(this.data.buryDepth[e.detail.value][0].val)],
        tempVal: parseFloat(this.data.envTemp[this.getDepth(this.data.buryDepth[e.detail.value][0].val)][0].val)
      })
    }

    // 空气桥架和隧道/电缆沟2回0.7m    ===>    土壤热阻系数
    if (e.detail.value == "空气桥架" || e.detail.value == "隧道" || (e.detail.value == "电缆沟" && this.data.DepthVal == "2回0.7m")) {
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

  buryDepthChange: function(e) {
    this.setData({
      DepthVal: e.detail.value,
      depthVal: this.getDepth(e.detail.value),
    })

    // 电缆沟2回0.7m    ===>    环境温度
    if (this.data.burywayVal == "电缆沟" && this.data.DepthVal == "2回0.7m") {
      this.setData({
        envtemp: [{val: 30, checked:'true'}, {val: 40}],
        tempVal: parseFloat(30)
      })
    } else {
      this.setData({
        envtemp: this.data.envTemp[this.getDepth(e.detail.value)],
        tempVal: parseFloat(this.data.envTemp[this.getDepth(e.detail.value)][0].val),
      })
    }
  },

  tempChange: function(e) {
    this.setData({
      tempVal: parseFloat(e.detail.value)
    })
  },

  // ------------------------------------  其他  -----------------------------------------

  // 改变热阻系数
  thermalResistivityChange: function(e) {
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