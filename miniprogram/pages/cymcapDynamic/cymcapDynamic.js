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
    envTemp: {'直埋1回': [{val: 28, checked:'true'}, {val: 30},{val: 32}],
             '直埋2回': [{val: 28, checked:'true'}, {val:30}, {val:32}], 
             '电缆沟2回填沙': [{val: 28, checked:'true'}, {val: 30}, {val:32}], 
             '电缆沟2回无填充': [{val: 30, checked:'true'}, {val:40}],
             '电缆沟3回填沙': [{val: 28, checked:'true'}, {val: 30}, {val:32}], 
             '电缆沟3回无填充': [{val: 30, checked:'true'}, {val:40}],
             '电缆沟4回填沙': [{val: 28, checked:'true'}, {val: 30}, {val:32}], 
             '电缆沟4回无填充': [{val: 30, checked:'true'}, {val:40}, ],
             '电缆沟6回填沙': [{val: 28, checked:'true'}, {val: 30}, {val:32}], 
             '电缆沟6回无填充': [{val: 30, checked:'true'}, {val:40}, ],
             '电缆沟8回填沙': [{val: 28, checked:'true'}, {val: 30}, {val:32}], 
             '电缆沟8回无填充': [{val: 30, checked:'true'}, {val:40}, ],
             '非开挖铺管1回': [{val: 24, checked:'true'}, {val:26}, {val:28}], 
             '非开挖铺管2回': [{val: 24, checked:'true'}, {val:26}, {val:28}], 
             '非开挖铺管3回': [{val: 24, checked:'true'}, {val:26}, {val:28}], 
             '非开挖铺管4回': [{val: 24, checked:'true'}, {val:26}, {val:28}], 
             '空气桥架4回':[{val: 30, checked:'true'}, {val:40}],
             '隧道8回':[{val: 23, checked:'true'}, {val:25}, {val:27}],
             '埋管1回': [{val: 28, checked:'true'}, {val:30}, {val:32}], 
             '埋管2回': [{val: 28, checked:'true'}, {val:30}, {val:32}], 
             '埋管3回': [{val: 27, checked:'true'}, {val:29}, {val:31}], 
             '埋管4回': [{val: 27, checked:'true'}, {val:29}, {val:31}], 
             '埋管6回': [{val: 27, checked:'true'}, {val:29}, {val:31}], 
             '埋管1回最优排列': [{val: 28, checked:'true'}, {val:30}, {val:32}], 
             '埋管2回最优排列': [{val: 28, checked:'true'}, {val:30}, {val:32}], 
             '埋管3回最优排列': [{val: 27, checked:'true'}, {val:29}, {val:31}], 
             '埋管4回最优排列': [{val: 27, checked:'true'}, {val:29}, {val:31}], 
             '埋管6回最优排列': [{val: 27, checked:'true'}, {val:29}, {val:31}], 
            },
    envtemp: [{val: 28, checked:'true'}, {val:30}, {val:32}],
    load: [{val: 0.8, checked: 'true'}, {val: 0.9}],
    loadVal: 0.8,
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
    },{
      value: '负荷因子',
      selected: false ,
      title: '负荷因子'
    }],
    imageSrc: "",
    description: ""
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

    let bury_position = this.data.burywayVal + this.data.DepthVal

    // 设置环境温度
    this.setData({
      envtemp: this.data.envTemp[bury_position],
      tempVal: parseFloat(this.data.envTemp[bury_position][0].val)
    })

    // 空气桥架4回    ===>    土壤热阻系数
    if (bury_position == "空气桥架4回") {
      this.setData({
          thermalresistivityVal: "无",
          thermalResistivity: [{val: "无", checked: 'true'}]
      })
    } else {
      this.setData({
          thermalresistivityVal: this.data.thermalResistivityTemp[0].val,
          thermalResistivity: this.data.thermalResistivityTemp
      })
    }

    this.showImage();
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

  showImage: function() {
    let that = this;
    this.setData({
      hidden: false,
      disabledShow: true
    });
    wx.cloud.callFunction({
      name: "showImage",
      data: {
        depth: this.data.DepthVal,
        way: this.data.burywayVal
      },
      success: res => {
        that.setData({
          imageSrc: res.result.url,
          description: res.result.text
        })
      },
      fail: err=> {
        console.log(err)
      },
      complete: () => {
        that.setData({
          hidden: true,
        });
      }
    })
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

  // 负荷因子
  loadChange: function(e) {
    this.setData({
      loadVal: parseFloat(e.detail.value)
    })
  },

  // -----------------------------------   动态载流量    ------------------------------------------
  onQuery: function() {
    console.log(this.data.volVal,this.data.burywayVal,this.data.DepthVal,this.data.landWayVal,this.data.tempVal,this.data.thermalresistivityVal,this.data.sectionVal,)
    console.log( this.data.conditionSelectedList.filter(it => it.selected).map(it => it.value))
    
    // 显示加载
    this.setData({
      hidden: false,
      // disabledSteady: true
    });

    // 查询
    wx.cloud.callFunction({
      name: "query",
      data: {
        类型: "动态",
        电压等级: this.data.volVal,
        敷设方式: this.data.burywayVal,
        回路数: this.data.DepthVal,
        金属护套层接地方式: this.data.landWayVal,
        环境温度: this.data.tempVal,
        土壤热阻系数: this.data.thermalresistivityVal,
        电缆截面: this.data.sectionVal,
        负荷因子: this.data.loadVal,
        selectedVal:  this.data.conditionSelectedList.filter(it => it.selected).map(it => it.value).concat(["敷设方式","回路数"]),
        imageSrc: this.data.imageSrc,
        description: this.data.description
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
          // disabledSteady: false
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