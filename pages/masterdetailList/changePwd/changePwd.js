// pages/masterdetailList/changePwd/changePwd.js
const app = getApp();
const md5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    before:'',
    now:''
  },
  beforePwd(e) {
    this.setData({
      before: e.detail.value
    })
  },
  nowPwd(e) {
    this.setData({
      now: e.detail.value
    })
  },
  baoBtn() {
    var that = this;
    let baseUrl = app.globalData.baseURL;
    console.log(md5.hexMD5(that.data.before))
    wx.request({
      url: baseUrl + '/api/User/UpdatePwd',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        oldPwd: md5.hexMD5(that.data.before),
        newPwd: md5.hexMD5(that.data.now)
      },
      success(res) {
        console.log(res.data.code);
      }
    })
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