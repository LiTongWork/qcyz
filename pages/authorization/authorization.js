// pages/authorization/authorization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '/static/img/defaultPhoto.png',
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo);
    if (e.detail.userInfo){
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})