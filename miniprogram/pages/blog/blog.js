// pages/blog/blog.js
let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalshow:false,
    blogList:[],
    pageOn:false,
  },

  onLoad: function (options) {
    this.setData({
      blogList: []
    })
    this._loadBlogList()
  },
  onPullDownRefresh: function() {
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },
  onShow: function () {
    this.setData({
      blogList: []
    })
    if(this.data.pageOn){
      this._loadBlogList(0)
      this.data.pageOn=false
    }
  },
  onHide: function () {
    this.setData({
      pageOn:true
    })
  },
  //触底加载
  onReachBottom: function() {
    this._loadBlogList(this.data.blogList.length)
  },
  //搜索博客
  onSearch(event) {
    this.setData({
      blogList: []
    })
    keyword = event.detail
    this._loadBlogList(0)
  },

  //监控搜索框输入内容
  onInput(event) {
    keyword = event.detail
  },

  //加载博客
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'get_blog',
      data: {
        start,
        count: 10,
        keyword,
      }
    }).then((res) => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

//发布博客
  onPublish() {
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
            modalShow: true,
          })
        }
      }
    })
  },
  onLoginSuccess(event) {
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  }
})