// pages/databaseGuide/databaseGuide.js
const app = getApp()

Page({
  data: {
    openid: '',
    hidden:true,  // Loading...
    disabledShow: false,
    burywayVal: '直埋',   // post：敷设方式
    DepthVal: '1回',   // post：回路数
    buryWayAll:{
      'cymcapSteady': [{way: '直埋', checked: 'true'}, {way: '电缆沟' }, {way: '埋管'}, {way: '非开挖铺管'}, {way: '空气桥架'}, {way: '隧道'}],

      'cymcapWorkSteady': [{way: '直埋', checked: 'true'}, {way: '电缆沟' }, {way: '埋管'}, {way: '非开挖铺管'}],

      'cymcapDynamic': [{way: '直埋', checked: 'true'}, {way: '电缆沟' }, {way: '埋管'}, {way: '非开挖铺管'}],

      'cymcapShort': [{way: '直埋', checked: 'true'}, {way: '电缆沟' }, {way: '埋管'}, {way: '非开挖铺管'}],
    },

    buryWay: [{way: '直埋', checked: 'true'}, {way: '电缆沟' }, {way: '埋管'}, {way: '非开挖铺管'}, {way: '空气桥架'}, {way: '隧道'}],  // 敷设方式
    buryDepthAll: {
      'cymcapSteady':{'直埋': [{val: '1回', checked:'true'}, {val: '2回'}], 
            '电缆沟': [{val: '2回填沙', checked:'true'},{val: '3回填沙'},{val: '4回填沙'},{val: '6回填沙'},{val: '8回填沙'},{val: '2回无填充'},{val: '3回无填充'},{val: '4回无填充'},{val: '6回无填充'}],
            '埋管': [{val: '1回', checked:'true'}, {val: '2回'},
                    {val: '3回'}, {val: '4回'},{val: '6回'},
                    {val: '1回最优排列'},{val: '2回最优排列'},{val: '3回最优排列'},
                    {val: '4回最优排列'},{val: '6回最优排列'}],
            '非开挖铺管': [{val: '1回', checked:'true'},{val: '2回'},{val: '3回'},{val: '4回'}],
            '空气桥架': [{val: '4回', checked:'true'}],
            '隧道': [{val: '8回', checked:'true'}]},

      'cymcapWorkSteady':{'直埋': [{val: '2回', checked:'true'}], 
            '电缆沟': [{val: '2回填沙', checked:'true'},{val: '3回填沙'},{val: '4回填沙'},{val: '6回填沙'},{val: '8回填沙'}],
            '埋管': [{val: '2回最优排列', checked:'true'},{val: '3回最优排列'},
                    {val: '4回最优排列'},{val: '6回最优排列'}],
            '非开挖铺管': [{val: '2回', checked:'true'},{val: '3回'},{val: '4回'}]},

      'cymcapDynamic':{'直埋': [{val: '1回', checked:'true'}, {val: '2回'}], 
            '电缆沟': [{val: '2回填沙', checked:'true'},{val: '3回填沙'},{val: '4回填沙'},{val: '6回填沙'},{val: '8回填沙'},{val: '2回无填充'},{val: '3回无填充'},{val: '4回无填充'}],
            '埋管': [{val: '1回', checked:'true'}, {val: '2回'},
                    {val: '3回'}, {val: '4回'},{val: '6回'},
                    {val: '1回最优排列'},{val: '2回最优排列'},{val: '3回最优排列'},
                    {val: '4回最优排列'},{val: '6回最优排列'}],
            '非开挖铺管': [{val: '1回', checked:'true'},{val: '2回'},{val: '3回'},{val: '4回'}]},

      'cymcapShort':{'直埋': [{val: '1回', checked:'true'}, {val: '2回'}], 
            '电缆沟': [{val: '2回填沙', checked:'true'},{val: '3回填沙'},{val: '4回填沙'},{val: '6回填沙'},{val: '8回填沙'},{val: '2回无填充'},{val: '3回无填充'},{val: '4回无填充'}],
            '埋管': [{val: '1回最优排列', checked:'true'},{val: '2回最优排列'},{val: '3回最优排列'},
                    {val: '4回最优排列'},{val: '6回最优排列'}],
            '非开挖铺管': [{val: '1回', checked:'true'},{val: '2回'},{val: '3回'},{val: '4回'}]}
    },
    buryDepth: {'直埋': [{val: '1回', checked:'true'}, {val: '2回'}], 
                '电缆沟': [{val: '2回填沙', checked:'true'},{val: '3回填沙'},{val: '4回填沙'},{val: '6回填沙'},{val: '8回填沙'},{val: '2回无填充'},{val: '3回无填充'},{val: '4回无填充'},{val: '6回无填充'}],
                '埋管': [{val: '1回', checked:'true'}, {val: '2回'},
                        {val: '3回'}, {val: '4回'},{val: '6回'},
                        {val: '1回最优排列'},{val: '2回最优排列'},{val: '3回最优排列'},
                        {val: '4回最优排列'},{val: '6回最优排列'}],
                '非开挖铺管': [{val: '1回', checked:'true'},{val: '2回'},{val: '3回'},{val: '4回'}],
                '空气桥架': [{val: '4回', checked:'true'}],
                '隧道': [{val: '8回', checked:'true'}]}, // 填埋回路数
    burydepth: [{val: '1回', checked:'true'}, {val: '2回'}], // 填埋深度
    imageSrc: "",
    description: "",
    loadType: [{val:'cymcapSteady', name:'稳态载流量', checked: 'true'},
               {val:'cymcapWorkSteady', name:'考虑工况稳态载流量'}, 
               {val:'cymcapDynamic', name: '动态载流量'}, 
               {val:'cymcapShort',name:'短时载流量'}],
    loadtype: 'cymcapSteady',
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
  
  // 改变载流量类型
  loadTypeChange: function (e) {
    this.setData({
      loadtype: e.detail.value,
      buryDepth: this.data.buryDepthAll[e.detail.value],
      buryWay: this.data.buryWayAll[e.detail.value],
      burywayVal: this.data.buryWayAll[e.detail.value][0].way,
      burydepth: this.data.buryDepthAll[e.detail.value][this.data.buryWayAll[e.detail.value][0].way],
      DepthVal: this.data.buryDepthAll[e.detail.value][this.data.buryWayAll[e.detail.value][0].way][0].val,
    })
  },

  // 改变敷设方式   
  buryWayChange: function (e) {
    this.setData({
      burywayVal: e.detail.value,
      burydepth: this.data.buryDepth[e.detail.value],
      DepthVal: this.data.buryDepth[e.detail.value][0].val,
    })
  },

  // 改变敷设回数
  buryDepthChange: function(e) {
    this.setData({
      DepthVal: e.detail.value,
    })
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
        let that = this;
        that.setData({
          hidden: true,
          disabledShow: false
        });
      }
    })
  },
})