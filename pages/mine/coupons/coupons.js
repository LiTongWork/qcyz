// pages/mine/coupons/coupons.js
const $http = require('../../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: '',
    list: []
  },
  // 点击使用
  clickUse: function (e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let status = Number(e.currentTarget.dataset.status);
    if (status == 0 ) {
      app.globalData.selCouponsId = id;
      if (that.data.from != ''){
        wx.navigateBack();
      }else {
        wx.navigateTo({
          url: '/pages/master/master',
        })
      }
    }else {
      wx.showToast({
        title: '已使用',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }
  },
  // 获取列表
  getList: function (){
    let that = this;
    $http.post('/api/UserCenter/GetCouponsList', {})
      .then(res => {
        console.log(res);
        for(let i in res.data){
          res.data[i].priceStart = Number(res.data[i].priceStart).toFixed(2)
        }
        that.setData({
          list: that.data.list.concat(res.data)
        })
      })
      .catch(res => {
        console.log(res)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getList();
    that.setData({
      from: options.from ? options.from : '',
      money: options.money ? options.money : ''
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      list: []
    })
    that.getList();
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },1000)
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