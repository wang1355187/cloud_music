// components/lyric/lyric.js
let nowLyricIndex=0
let lyricHeight=0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lyric:String,
    lyricShow:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lyricList:[],
    scrollTop:0,
  },
  observers: {
    lyric(lrc) {
      if (lrc == '暂无歌词') {
        this.setData({
          lyricList: [{
            lrc,
            time: 0,
          }],
          nowLyricIndex: -1
        })
      } else {
        this.getLyric(lrc)
      }
    },
  },
lifetimes:{
  ready(){
    wx.getSystemInfo({
      success(res) {
        // 求出1rpx的大小
        lyricHeight = res.screenWidth / 750 * 64
      },
    })
  }
},
  /**
   * 组件的方法列表
   */
  methods: {
    update(time){
      let lrcList = this.data.lyricList
      if (lrcList.length == 0) {
        return
      }
      if (time > lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight
          })
        }
      }
      for (let i = 0; i < this.data.lyricList.length;i++){
        if (time<this.data.lyricList[i].time){
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: lyricHeight * (i - 1)
          })
          break;
        }
      }
    },
    getLyric(sLyric){
      let line=sLyric.split('\n')
      let _lrcList=[]
      line.forEach((elem) => {
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = elem.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 把时间转换为秒
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lrcList.push({
            lrc,
            time: time2Seconds,
          })
        }
      })
      this.setData({
        lyricList:_lrcList
      })
    },
  }
})
