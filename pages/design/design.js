// pages/design/design.js
const $http = require('../../utils/config.js');
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    advertisement: {
      topBanner: '/static/img/topBanner.jpg',
      bottomBanner: '/static/img/serviceFlow.jpg'
    },
    freeAppointment: '/static/img/freeAppointment.png',
    phone: '',
    region: {},
    regionStatus: false
  },
  // 选择省市区/县
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail,
      regionStatus: true
    })
  },
  // 输入手机号
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 提交
  handleSub: function () {
    let that = this;
    let phoneReg = /^1[0-9]{10}$/;
    console.log(that.data.region)
    if (!that.data.regionStatus) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (that.data.phone.length == 0) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (!phoneReg.test(that.data.phone)) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    }else {
      // console.log('region',that.data.region);
      // console.log('phone',that.data.phone);
      let Address = that.data.region.value[0] + that.data.region.value[1] + that.data.region.value[2];
      let params = {
        Address: Address,
        LinkPhone: that.data.phone
      }
      console.log(params)
      $http.post('/api/Register/DesignerRegister', params)
        .then( res => {
          console.log(res)
          wx.showToast({
            title: res.message,
            icon: 'none',
            mask: true,
            duration: 1500
          })
        })
        .catch( res => {
          console.log(res)
        })
    }
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