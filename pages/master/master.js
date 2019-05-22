// pages/master/master.js
const $http = require('../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerUrl: '/static/img/masterBanner.png',
    nav: [],
    listData: [
      {
        img: '/static/img/defaultPhoto.png',
        name: '张师傅',
        add: '广东省深圳市龙岩',
        orderNum: 64,
        rate: 5
      },
      {
        img: '/static/img/defaultPhoto.png',
        name: '李师傅',
        add: '广东省深圳市龙岩',
        orderNum: 60,
        rate: 4
      },
      {
        img: '/static/img/defaultPhoto.png',
        name: '王师傅',
        add: '广东省深圳市龙岩',
        orderNum: 60,
        rate: 4
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取师傅分类列表  
    $http.post('/api/Register/MasterTypeList',{})
    .then(res => {
      // console.log(res);
      that.setData({
        nav: res.data
      })
    })
    .catch(res => {
      console.log(res)
    })
    // 获取季度劳模
    $http.post('/api/Home/Mastermodel',{})
    .then(res => {
      console.log(res);
      that.setData({
        listData: res.data
      })
    })
    .catch(res => {
      console.log(res)
    })
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

  },
  // 跳转链接
  toMaster: function (e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    console.log('id',id);
    wx.navigateTo({
      url: `/pages/master/dq/dq?type=${id}&title=${title}`
    });
  }
})