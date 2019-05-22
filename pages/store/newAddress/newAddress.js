// pages/store/newAddress/newAddress.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    phone: '',
    region: {},
    regionStatus: false,
    detailAddress: '',
    zip: '',
    status: 0
  },
  //输入姓名
  changeName:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  //输入手机号
  changePhone:function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 选择省市区/县
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail,
      regionStatus: true
    })
  },
  //输入详细地址
  changeAllad(e){
    this.setData({
      detailAddress: e.detail.value
    })
  },
  //邮政编码
  // changeYoubian(e) {
  //   this.setData({
  //     detailAddress: e.detail.value
  //   })
  // },
  // 设置默认地址
  setDefaultAddress: function () {
    this.setData({
      status: 1//默认地址
    })
  },
  //保存地址
  addBtn() {
    let that = this;
    let baseUrl = app.globalData.baseURL;
    if (this.data.name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (!app.phoneReg(this.data.phone)) {
      wx.showToast({
        title: '手机号码错误',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (this.data.regionStatus== false) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (this.data.detailAddress == '') {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }
    wx.request({
      url: baseUrl + '/api/UserCenter/UserAddressEdit',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        ConsigneeName:that.data.name,
        ConsigneeMobile:that.data.phone,
        Status: that.data.status,
        Province: that.data.region.value[0],
        City: that.data.region.value[1],
        Area: that.data.region.value[2],
        Address: that.data.detailAddress
      },
      success(res) {
        console.log(res.data.code)
        wx.navigateTo({
          url: '/pages/store/address/address',
        })
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