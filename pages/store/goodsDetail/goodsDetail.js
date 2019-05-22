// pages/store/goodsDetail/goodsDetail.js
const $http = require('../../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    topBannerData: {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 800,
      indicatorActiveColor: '#fff',
    },
    detailData: {},
    title:'',//商品名称
    id:''//商品id
  },
  // 加入购物车
  addCar: function () {
    var that = this
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl + '/api/Store/AddCar',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        goodsId: that.data.id,
        number: 1
      },
      success(res) {
        console.log(res.data.code)
        wx.showToast({
          title: '成功加入购物车',
          icon: 'success',
          mask: true,
          duration: 2000
        })
      }
    })
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    let that = this;
    console.log(options);
    that.setData({
      title: options.title,
      id:options.id
    })
    // 获取详情
    $http.post('/api/Store/GetGoodsDetails',{id:options.id})
    .then(res => {
      // console.log(res.data);
      that.setData({
        detailData: res.data
      })
      that.setData({
        'detailData.goodsImg': that.data.detailData.goodsImg.split(',')
      })
    })
    .catch(res => {
      console.log(res)
    })
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  //生命周期函数--监听页面显示
  onShow: function () {

  },

 
 //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

  },

  //页面上拉触底事件的处理函数
  onReachBottom: function () {

  },

  //用户点击右上角分享
  onShareAppMessage: function () {

  },
  // 跳转
  toShopCar: function () {
    // 跳转购物车
    wx.navigateTo({
      url: '/pages/store/shopCar/shopCar',
    })
  },
  toMakeSure: function (e) {
    let goodid = this.data.id
    // 跳转确认订单
    wx.navigateTo({
      url: '/pages/store/makeSure/makeSure?goodid=' + goodid,
    })
  }
})