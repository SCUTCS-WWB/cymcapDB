// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const xlsx = require('node-xlsx')    //导入Excel类库
const db = cloud.database()   //声明数据库对象
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let DataInfo = await db.collection('cymcap').where({
      a: _.eq(event.a)
    }).get()  //将获取到的数据对象赋值给变量，接下来需要用该对象向Excel表中添加数据

    let dataCVS = 'CymcapDynamic-' + Math.floor(Math.random()*1000000000) + '.xlsx';
    //声明一个Excel表，表的名字用随机数产生
    let alldata = [];
    let row = ['电压等级','敷设方式','敷设深度','金属护套曾接地方式','环境温度','土壤热阻系数','电缆截面','稳态载流量','动态载流量','短时载流量'];; //表格的属性，也就是表头说明对象
    alldata.push(row); //将此行数据添加到一个向表格中存数据的数组中
    //接下来是通过循环将数据存到向表格中存数据的数组中
    for (let key = 0; key < DataInfo.data.length; key++) {
      let arr = [];
      arr.push(DataInfo.data[key].a);
      arr.push(DataInfo.data[key].b);
      arr.push(DataInfo.data[key].c);
      arr.push(DataInfo.data[key].d);
      arr.push(DataInfo.data[key].e);
      arr.push(DataInfo.data[key].f);
      arr.push(DataInfo.data[key].g);
      arr.push(DataInfo.data[key].h);
      arr.push(DataInfo.data[key].i);
      arr.push(DataInfo.data[key].j);
      arr.push(DataInfo.data[key].k);
      alldata.push(arr)
    }
    var buffer = await xlsx.build([{   
      name: "dynamic",
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