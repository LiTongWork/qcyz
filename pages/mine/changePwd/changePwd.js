// pages/changePwd/changePwd.js
const $http = require('../../../utils/config.js');
const md5 = require('../../../utils/md5.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPwd: '',
    newPwd: '',
    confirmPwd: ''
  },
  // 输入旧密码
  oldPwdInput: function(e){
    this.setData({
      oldPwd: e.detail.value
    })
  },
  // 输入新密码
  newPwdInput: function (e) {
    this.setData({
      newPwd: e.detail.value
    })
  },
  // 确认新密码
  confirmInput: function (e) {
    this.setData({
      confirmPwd: e.detail.value
    })
  },
  // 保存修改
  sub: function (){
    let that = this;
    let oldPwd = that.data.oldPwd;
    let newPwd = that.data.newPwd;
    let confirmPwd = that.data.confirmPwd;
    if(oldPwd == ''){
      // 判断旧密码
      wx.showToast({
        title: '请输入旧密码',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (newPwd == '') {
      // 判断新密码
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (confirmPwd == '') {
      // 确认新密码
      wx.showToast({
        title: '请确认新密码',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (confirmPwd != newPwd) {
      // 判断新密码是否相等
      wx.showToast({
        title: '新密码不想等',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else {
      console.log(oldPwd,newPwd)
      let parmas = {
        oldPwd: md5.hexMD5(oldPwd),
        newPwd: md5.hexMD5(newPwd)
      }
      console.log(parmas);
      $http.post('/api/User/UpdatePwd',parmas)
      .then(res => {
        console.log(res);
        wx.showToast({
          title: res.message,
          icon: 'none',
          mask: true,
          duration: 1500
        })
        setTimeout(function(){
          if (res.code == 200) {
            wx.setStorageSync('auth', '');
            wx.setStorageSync('loginType', '');
            wx.setStorageSync('openId', '');
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        },1500)
      })
      .catch(res => {
        console.log(res)
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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