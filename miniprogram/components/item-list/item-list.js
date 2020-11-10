// components/item-list/item-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:{
      type:Object
    }
  },
  observers:{
    ['playlist.playCount'](count){
      this.setData({
        _count: this._tranNumber(count, 2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tranNumber(count,point){
      let num=count.toString().split('.')[0]
      let length=num.length
      if(length<=6){
        return num;
      }
      else if(length>6&&length<=8){
        let point_num=num.substring(length-4,length-4+point)
        return parseInt(num/10000)+'.'+point_num+'万'
      }
      else{
        let point_num = num.substring(length - 8, length - 8 + point)
        return parseInt(num/100000000) + '.' + point_num + '亿'
      }
    },
    _getMusic(){
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?id=${this.properties.playlist.id}`,
      })
    }
  }
})
