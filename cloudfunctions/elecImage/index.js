// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()   //声明数据库对象
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    db.collection('imageText').where({
      depth: event.depth,
      way: event.way
    }).get().then(res => {
      console.log(res.data[0].src)
      return res.data[0].src
    })
  } catch (error) {
    console.log(error)
  }
}