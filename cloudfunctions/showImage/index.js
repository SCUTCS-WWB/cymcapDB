// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()   //声明数据库对象
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    url = ""
    text = ""
    const DataInfo = await db.collection('imageText').where({
      depth: event.depth,
      way: event.way
    }).get().then(res => {
      if(res.data.length > 0) {
        url = res.data[0].src
        text = res.data[0].text
      }
    })
    return {url: url, text: text}
  } catch (error) {
    console.log(error)
  }
}