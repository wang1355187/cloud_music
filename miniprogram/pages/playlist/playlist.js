// miniprogram/pages/playlist/playlist.js
const db = wx.cloud.database();
Page({
  data: {
    swiperImgUrls:[],
    playlist:[],
  },
  //获取数据库中的轮播图地址数组
  _getSwiper() {
    db.collection('swiper').get().then((res) => {
      this.setData({
        swiperImgUrls:res.data[0].url
      })
    })
  },
  //调用云函数加载歌单
_getPlaylist(){
  wx.showLoading({
    title: '加载中',
  })
  wx.cloud.callFunction({
    name:"music",
    data:{
      start:this.data.playlist.length,
      count:15,
      $url:'playlist'
    }
  }).then(res=>{
    let obj=res.result
    this.setData({
      playlist:this.data.playlist.concat(obj.data)
    })
    wx.hideLoading()
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getSwiper();
    this._getPlaylist();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})