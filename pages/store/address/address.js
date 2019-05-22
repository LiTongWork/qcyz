// pages/store/address/address.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: {},
    list: []
  },
  // 选择地址 
  choose: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    for (let i in that.data.list) {
      let dd = `list[${i}].status`;
      if (index == i) {
        that.setData({
          [dd]: true,
          selected: that.data.list[i]
        })
      }else {
        that.setData({
          [dd]: false
        })
      }
    }
  },
  // 加载地址列表
  addressList:function(status){
    let that = this;
    let baseUrl = app.globalData.baseURL;
    // console.log('index', index)
    wx.request({
      url: baseUrl + '/api/UserCenter/UserAddressList',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        Status: status
      },
      success(res) {
        console.log(res.data)
        that.setData({
          list:res.data.data
        })
      }
    })
  },
 //生命周期函数--监听页面加载
  onLoad: function (options) {
    let that = this;
    that.addressList(-1);
    for (let i in that.data.list) {
      let dd = `list[${i}].status`;
      if (that.data.list[i].status) {
        that.setData({
          selected: that.data.list[i]
        })
      }
    }
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
  // 跳转
  toEditAddress: function (e) {
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    // 编辑收货地址
    wx.navigateTo({
      url: '/pages/store/editAddress/editAddress?id='+id +'&status='+status,
    })
  },
  toNewAddress: function (e) {
    // 新增地址
    wx.navigateTo({
      url: '/pages/store/newAddress/newAddress',
    })
  }
})