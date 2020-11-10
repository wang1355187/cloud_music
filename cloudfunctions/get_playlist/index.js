// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const rp = require('request-promise')
const playlistcollection = db.collection('playlist')
const URL = 'http://musicapi.xiecheng.live/personalized'
// 云函数入口函数
exports.main = async (event, context) => {
  const playlist=await rp(URL).then(res=>{
    return JSON.parse(res).result;
  })
  const list = await playlistcollection.get();
  const newData=[];
  for(let i=0,len1=playlist.length;i<len1;i++){
    let flag=true;
    for(let j=0,len2=list.data.length;j<len2;j++){
      if(playlist[i].id===list.data[j].id){
        flag =false;
        break;
      }
    }
    if(flag){
      newData.push(playlist[i])
    }
  }
  for(let i=0,len=newData.length;i<len;i++){
    await db.collection('playlist').add({
      data:{
        ...newData[i],
        createTime:db.serverDate()
      }
    }).then((res)=>{
      console.log("插入成功");
    }).catch((err)=>{
      console.log("插入失败");
    })
  }
  return newData.length;
}