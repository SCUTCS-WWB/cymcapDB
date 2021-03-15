// pages/databaseGuide/databaseGuide.js
const app = getApp()

Page({
  data: {
    openid: '',
    hidden:true,  // Loading...
    disabledShow: false,
    burywayVal: '直埋',   // post：敷设方式
    DepthVal: '1回',   // post：回路数
    buryWay: [{way: '直埋', checked: 'true'}, {way: '电缆沟' }, {way: '埋管'}, {way: '非开挖铺管'}, {way: '空气桥架'}, {way: '隧道'}],  // 敷设方式
    buryDepth: {'直埋': [{val: '1回', checked:'true'}, {val: '2回'}], 
                '电缆沟': [{val: '2回填沙', checked:'true'},{val: '3回填沙'},{val: '4回填沙'},{val: '6回填沙'},{val: '8回填沙'},{val: '2回无填充'},{val: '3回无填充'},{val: '4回无填充'},{val: '6回无填充'},{val: '8回无填充'}],
                '埋管': [{val: '1回', checked:'true'}, {val: '2回'},
                        {val: '3回'}, {val: '4回'},{val: '6回'}],
                '非开挖铺管': [{val: '1回', checked:'true'},{val: '2回'},{val: '3回'},{val: '4回'}],
                '空气桥架': [{val: '4回', checked:'true'}],
                '隧道': [{val: '8回', checked:'true'}]}, // 填埋回路数
    burydepth: [{val: '1回', checked:'true'}, {val: '2回'}], // 填埋深度
    imageSrc: "",
    description: ""
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