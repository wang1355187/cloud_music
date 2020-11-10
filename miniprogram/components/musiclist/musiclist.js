// components/musiclist/musiclist.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:{
      type:Array
    }
  },
  pageLifetimes: {
    show() {
      this.setData({
        playid: parseInt(app.getPlayMusicId())
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    playid:-1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _Select(event){
      console.log(event)
      const ds = event.currentTarget.dataset
      const musicid = ds.id
      this.setData({
        playid: musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicid=${musicid}&index=${ds.index}`,
      })
    }
  }
})
