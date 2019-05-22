// pages/case/case.js
const $http = require('../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    list: [
      {
        img: '/static/img/defaultPhoto.png',
        title: '案例一'
      }
    ],
    page: 1,
    rows: 10
  },
  // 获取列表数据
  getList: function (){
    let that = this;
    let parmas = {
      page: that.data.page,
      rows: that.data.rows
    }
    $http.post('/api/Case/CasePageList', parmas)
      .then(res => {
        console.log(res);
        that.setData({
          list: res.data.list
        })
        wx.stopPullDownRefresh()
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
    that.getList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      page: 1
    })
    that.getList()
 },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let parmas = {
      page: that.data.page + 1,
      rows: that.data.rows
    }
    $http.post('/api/Case/CasePageList', parmas)
      .then(res => {
        console.log(res);
        that.setData({
          list: that.data.list.concat(res.data.list)
        })
        wx.stopPullDownRefresh()
      })
      .catch(res => {
        console.log(res)
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})