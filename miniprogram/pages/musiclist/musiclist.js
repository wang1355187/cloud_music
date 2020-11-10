// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlistId:"",   //歌单id
    musiclist:[],    //歌单歌曲列表
    listInfo:{},     //用户信息对象
    modalshow:false  //控制授权组件标志
  },
  //获取歌单歌曲
  _getmusiclist(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:"music",
      data:{
        $url:'musiclist',
        playlistId:this.data.playlistId
      }
    }).then(res=>{
      if(!res.result.playlist){
        return;
      }
      let obj=res.result.playlist
      this.setData({
        musiclist:obj.tracks,
        listInfo: {
          coverImgUrl: obj.coverImgUrl,
          name: obj.name,
        }
      })
      wx.setStorageSync('musiclist', this.data.musiclist)
      wx.hideLoading()
    })
  },
  //授权成功
  onLoginSuccess(event) {
    const detail = event.detail
    let imgurl=this.data.listInfo.coverImgUrl.split('==')
    wx.navigateTo({
      url: `../blog-edit/blog-edit?ImgUrl=${imgurl}&name=${this.data.listInfo.name}&nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}&playlistId=${this.data.playlistId}`,
    })
  },
  //授权失败
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },
  //分享歌单
  onshare(){
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalshow: true,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      playlistId:options.id
    })
    this._getmusiclist()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})