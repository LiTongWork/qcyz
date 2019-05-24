// pages/masterdetailList/masterMoney/masterMoney.js
const app = getApp();
const md5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyNumber:"",//填写多少钱
    allMoney:"",//总价格
    moneyPwd:""//密码
  },
  number(e) {
    this.setData({
      moneyNumber: e.detail.value
    })
  },
  pwd(e) {
    this.setData({
      moneyPwd: e.detail.value
    })
  },
  // 余额有多少
  allMoney:function() {
    var that = this;
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl +'/api/Work/MyWorkInfo',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      success(res) {
        that.setData({
          allMoney: res.data.data.surplus
        })
      }
    })
  },
  //全部提现
  allTake:function() {
    this.setData({
      moneyNumber: this.data.allMoney
    })
  },
  allTrue:function() {
    var that = this;
    let baseUrl = app.globalData.baseURL;
    console.log(md5.hexMD5(that.data.moneyPwd))
    if (that.data.moneyPwd==''){
      wx.showToast({
        title: '支付密码不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }
    wx.request({
      url: baseUrl +'/api/Work/Deposit',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data:{
        payPwd: md5.hexMD5(that.data.moneyPwd),
        money: that.data.moneyNumber
      },
      success(res) {
        console.log(res.data.code);
      }
    })
  },
  onLoad: function (options) {
    this.allMoney();
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