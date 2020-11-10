// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const BASE_URL = 'https://api.imjad.cn/cloudmusic/'
const rp = require('request-promise')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //使用TcbRouter模块，将有关音乐的数据库调用，request请求API方法放在同一云函数中
  const app=new TcbRouter({event})
  //获取数据库歌单
  app.use('playlist',async(ctx,next)=>{
    ctx.body=cloud.database().collection('playlist')
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res)=>{
      return res
    })
  })
  //request请求获取歌单歌曲信息
  app.use('musiclist', async (ctx, next) => {
    ctx.body =await rp(BASE_URL + '?type=playlist&id=' + parseInt(event.playlistId))
    .then(res=>{
      return JSON.parse(res)
    }).catch(err=>{
      console.log(err)
    })
  })
  //request请求获取歌曲播放地址等信息
  app.use('player', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `?type=song&id=${event.musicId}`).then((res) => {
      return res
    })
  })
  //request请求获取歌曲歌词信息
  app.router('lyric', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `?type=lyric&id=${event.musicId}`).then((res) => {
      return res
    })
  })
  return app.serve()
}