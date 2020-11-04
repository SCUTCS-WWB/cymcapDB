// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const xlsx = require('node-xlsx')    //导入Excel类库
const db = cloud.database()   //声明数据库对象
const _ = db.command

function prefixInteger(num,length){
  return (Array(length).join('0') + num).slice(-length)
}

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let DataInfo = await db.collection('cymcap').where({
      电压等级: _.eq(event.电压等级),
      敷设方式: _.eq(event.敷设方式),
      回路数和深度: _.eq(event.回路数和深度),
      金属护套层接地方式: _.eq(event.金属护套层接地方式),
      环境温度: _.eq(event.环境温度),
      土壤热阻系数: _.eq(event.土壤热阻系数),
      电缆截面: _.eq(event.电缆截面),
    }).get()  //将获取到的数据对象赋值给变量，接下来需要用该对象向Excel表中添加数据

    // 年月日时分秒 + 随机数
    let createTime = String(new Date().getFullYear()) + prefixInteger(new Date().getMonth()+1, 2) + prefixInteger(new Date().getDate(), 2) + prefixInteger(new Date().getHours(),2) +       prefixInteger(new Date().getMinutes(), 2) + prefixInteger(new Date().getSeconds(), 2) + String(Math.floor(Math.random()*1000000000));
    let dataCVS = 'CymcapSteady-' + createTime + '.xlsx';
    //声明一个Excel表，表的名字用随机数产生
    let alldata = [];
    let row = ['电压等级（KV）','敷设方式','回路数+深度','金属护套层接地方式','环境温度（°Ｃ）','土壤热阻系数（°Ｃ•m/W）','电缆截面（mm2)','稳态载流量（A）']; //表格的属性，也就是表头说明对象
    alldata.push(row); //将此行数据添加到一个向表格中存数据的数组中
    //接下来是通过循环将数据存到向表格中存数据的数组中
    for (let key = 0; key < DataInfo.data.length; key++) {
      let arr = [];
      arr.push(DataInfo.data[key].电压等级);
      arr.push(DataInfo.data[key].敷设方式);
      arr.push(DataInfo.data[key].回路数加深度);
      arr.push(DataInfo.data[key].金属护套层接地方式);
      arr.push(DataInfo.data[key].环境温度);
      arr.push(DataInfo.data[key].土壤热阻系数);
      arr.push(DataInfo.data[key].电缆截面);
      arr.push(DataInfo.data[key].稳态载流量);
      alldata.push(arr)
    }
    var buffer = await xlsx.build([{   
      name: "steady",
      data: alldata
    }]); 
    //将表格存入到存储库中并返回文件ID
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })
  } catch (error) {
    console.log(error)
  }
}