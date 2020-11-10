// components/progress-bar/progress-bar.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
let duration = 0
let currentSec = -1
let movableAreaWidth = 0
let movableViewWidth = 0
let isMoving = false
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },
  lifetimes:{
    ready(){
      if (this.properties.isSame && this.data.showTime.totalTime == '00:00') {
        this._setTime()
      }
      this.getWidth()
      this._bindBGMEvent()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    moveX:0,
    percent:0,
    showTime:{
      currentTime:"00:00",
      totalTime:"00:00"
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event){
      if (event.detail.source == 'touch'){
        this.data.percent = event.detail.x / (movableAreaWidth - movableViewWidth)*100
        this.data.moveX=event.detail.x
        isMoving = true
      }
    },
    onTouchEnd() {
      const currentTimeFmt = this.DataFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        percent: this.data.percent,
        moveX: this.data.moveX,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      backgroundAudioManager.seek(duration*this.data.percent/100)
      isMoving=false
    },
    //获取进度条宽
    getWidth(){
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        // console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    //音乐绑定触发事件
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        console.log('Pause')
        this.triggerEvent('musicPause')
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })

      backgroundAudioManager.onTimeUpdate(() => {
        if(!isMoving){
          let currentTime=backgroundAudioManager.currentTime
          const duration=backgroundAudioManager.duration
          let currentTimeFmt=this.DataFormat(currentTime)
          let sec = currentTime.toString().split('.')[0]
          if(sec!=currentSec){
            this.setData({
              ['showTime.currentTime']: currentTimeFmt.min + ":" + currentTimeFmt.sec,
              percent: currentTime/duration*100,
              moveX:(movableAreaWidth-movableViewWidth)*currentTime/duration
            })
            this.triggerEvent('timeUpdate', {
              currentTime
            })
            currentSec = sec
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        console.log("onEnded")
        this.triggerEvent("musicEnd")
      })

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },
    //设置歌曲时长
    _setTime(){
      duration=backgroundAudioManager.duration
      const durationFmt=this.DataFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    //格式化时间
    DataFormat(sec){
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec),
      }
    },
    //时间补零
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})
