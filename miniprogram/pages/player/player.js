// pages/player/player.js
let nowPlayingIndex=0
let musiclist=[]
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying:false,
    isSame:false,   
    isShow:false,
    lyric:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this.getmusic(musiclist[nowPlayingIndex])
  },
  //暂停播放按钮事件
  togglePlaying:function(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    }
    else{
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying:!this.data.isPlaying
    })
  },
  //获取歌曲数据
  getmusic:function(e){
    if (e.id == app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    this.setData({
      picUrl: musiclist[nowPlayingIndex].al.picUrl,
      isPlaying: true
    })
    app.setPlayMusicId(e.id)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:"music",
      data:{
        $url:"player",
        musicId:e.id
      }
    }).then((res)=>{
      let obj=JSON.parse(res.result)
      console.log(obj);
      if(!this.data.isSame){
        backgroundAudioManager.src = obj.data[0].url
        backgroundAudioManager.title = e.name
      }
      else{
        backgroundAudioManager.play()
      }
      wx.setNavigationBarTitle({
        title: e.name,
      })
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId:e.id,
          $url: 'lyric',
        }
      }).then((res) => {
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if (lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
      wx.hideLoading()
    })
  },
  onPrev:function(){
    nowPlayingIndex--
    if(nowPlayingIndex<0){
      nowPlayingIndex = musiclist.length - 1
    }
    this.getmusic(musiclist[nowPlayingIndex])
  },
  onNext:function(){
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this.getmusic(musiclist[nowPlayingIndex])
  },
  onPlay() {
    this.setData({
      isPlaying: true,
    })
  },
  onPause() {
    this.setData({
      isPlaying: false,
    })
  },
  //歌词时间同步
  timeUpdate(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  //是否显示歌词
  onChangeLyricShow(){
    this.setData({
      isShow:!this.data.isShow
    })
  }

})