// pages/mine/logistics/logistics.js
const $http = require('../../../utils/config.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: {
      one: 0
    },
    company: '',
    number: '',
    tel: ''
  },
  // 复制单号
  copyNumber: function (e) {
    // console.log(e.currentTarget.dataset.id)
    wx.setClipboardData({
      data: e.currentTarget.dataset.id,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    $http.post('/api/UserCenter/CheckLogistics', { id: id})
    .then(res => {
      // console.log(res)
      if (res.code == 200) {
        that.setData({
          company: res.data.logisticsName,
          number: res.data.logisticsCode

        })
      }
    })
    .catch(res => {
      console.log(res)
    })
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