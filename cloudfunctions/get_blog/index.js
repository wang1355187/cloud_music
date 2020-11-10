// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const blogCollection = db.collection('blog')
// 云函数入口函数
exports.main = async (event, context) => {
  //博客查询关键词
  const keyword = event.keyword
  //查询规则
  let w = {}
  console.log(keyword)
  if (keyword.trim() != '') {
    w = {
      content: new db.RegExp({
        regexp: keyword,
      })
    }
  }
  let blogList = await blogCollection.where(w).skip(event.start).limit(event.count)
    .orderBy('createTime', 'desc').get().then((res) => {
      return res.data
    })
  return blogList
}