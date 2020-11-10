// components/login-modal/login-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalshow:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //关闭底部授权组件
    onClose(){
      this.setData({
        modalshow: false,
      })
    },
    //
    onGotUserInfo(event) {
      console.log(event)
      const userInfo = event.detail.userInfo
      if (userInfo) {
        this.setData({
          modalshow: false
        })
        this.triggerEvent('loginsuccess', userInfo)
      } else {
        this.triggerEvent('loginfail')
      }
    }
  }
})
