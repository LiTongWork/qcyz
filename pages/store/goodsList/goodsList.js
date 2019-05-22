// pages/store/mc/mc.js
const $http = require('../../../utils/config.js');
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',//分类
    title: '',//分类名
    listData: [],
    page: 1,
    rows: 10
  },
  //调取对应分类列表
  goodsList(type) {
    var that = this
    let baseUrl = app.globalData.baseURL;
    let imgUrl = app.globalData.imgUrl;
    wx.request({
      url: baseUrl +'/api/Store/GoodsPage',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data:{
        oneTypeId: type,
        page:that.data.page,
        rows: that.data.rows
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200){
          for (let i in res.data.data.list) {
            res.data.data.list[i].goodsImg = imgUrl + res.data.data.list[i].goodsImg
          }
          that.setData({
            listData: res.data.data.list
          })
          wx.stopPullDownRefresh()
        }

      }
    })
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      type: options.type,
      title: options.title
    })
    wx.setNavigationBarTitle({
      title: that.data.title
    })
    that.goodsList(that.data.type)
  },
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      page: 1
    })
    that.goodsList(that.data.type)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('reachBottom');
    let that = this;
    that.setData({
      page: that.data.page + 1
    })
    let baseUrl = app.globalData.baseURL;
    let imgUrl = app.globalData.imgUrl;
    wx.request({
      url: baseUrl + '/api/Store/GoodsPage',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        oneTypeId: that.data.type,
        page: that.data.page,
        rows: that.data.rows
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          for (let i in res.data.data.list) {
            res.data.data.list[i].goodsImg = imgUrl + res.data.data.list[i].goodsImg
          }
          that.setData({
            listData: that.data.listData.concat(res.data.data.list)
          })
          // wx.stopPullDownRefresh()
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 跳转
  toGoodsDetail: function (e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/store/goodsDetail/goodsDetail?id=${data.id}&title=${data.title}`
    })
  }
})