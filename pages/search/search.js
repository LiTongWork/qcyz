// pages/search/search.js
const $http = require('../../utils/config.js');
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',//分类
    title: '',//分类名
    listData: [],
    page: 1,
    rows: 10,
    searchName: ''
  },
  //调取对应分类列表
  goodsList(type) {
    var that = this
    let baseUrl = app.globalData.baseURL;
    let imgUrl = app.globalData.imgUrl;
    wx.request({
      url: baseUrl + '/api/Home/GoodsPage',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        seachName: type,
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
            listData: res.data.data.list
          })
          wx.stopPullDownRefresh()
        }

      }
    })
  },
  // 搜索框输入
  searchInput: function (e) {
    let that = this;
    that.setData({
      searchName: e.detail.value
    })
    if (that.data.searchName == '') {
      that.goodsList(that.data.searchName)
    }
  },
  // 搜索商品
  listSearch: function () {
    let that = this;
    that.setData({
      page: 1
    })
    that.goodsList(that.data.searchName)

  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    this.setData({
      searchName: options.searchName
    })
    this.goodsList(this.data.searchName)
  },
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('pullDown')
    let that = this;
    that.setData({
      page: 1
    })
    that.goodsList(that.data.searchName)
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
        searchName: that.data.searchName,
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