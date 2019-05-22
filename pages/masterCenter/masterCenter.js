// pages/masterCenter/masterCenter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    masterPic: '',
    masterNumber: '',
    masterAddress: '',
    masterPhone: '',
    type: '',
    province: "",
    city: "",
    area: "",
    status:''//审核状态，2是通过
  },
  //接单的状态 type(1:接单  0:工作)
  changType: function(type) {
    console.log('type', type)
    var that = this
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl + '/api/Work/SetWork',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        isWork: type
      },
      success(res) {
        console.log('res.data.code', res.data.code)
      }
    })
  },
  //接单中
  doIt() {
    this.changType(1);
    this.setData({
      type: 1
    })
  },
  //工作中
  doing() {
    this.changType(0)
    this.setData({
      type: 0
    })
  },
  //加载个人信息数据
  onShow: function() {
    var that = this;
    that.setData({
        masterPic: app.globalData.userInfo.avatarUrl,
        name: app.globalData.userInfo.nickName
      }),
      console.log("app.globalData.userInfo", app.globalData.userInfo.nickName)
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl + '/api/Work/MyWorkInfo',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      success(res) {
        console.log('status', res.data.data.status)
        if (res.data.code == 200) {
          console.log(res.data.code);
          that.setData({
            masterNumber: res.data.data.haveNumber,
            masterAddress: res.data.data.address,
            masterPhone: res.data.data.mobile,
            type: res.data.data.isWork,
            province: res.data.data.province,
            city: res.data.data.city,
            area: res.data.data.area,
            status:res.data.data.status
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 跳转到我的余额
  masterMoney: function() {
    wx.navigateTo({
      url: '/pages/masterdetailList/masterMoney/masterMoney'
    })
  },
  masterList: function() {
    if (this.data.status == 0) {
      wx.showToast({
        title: '请点击图像完善信息',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }
    if (this.data.status == 1) {
      wx.showToast({
        title: '正在审核中',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }
    if (this.data.status == 3) {
      wx.showToast({
        title: '审核不通过，请重新完善信息',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }
    var province = this.data.province;
    var city = this.data.city;
    var area = this.data.area;
    wx.navigateTo({
      url: '/pages/masterdetailList/masterList/masterList?province=' + province + '&city=' + city + '&area=' + area
    })
  },
  masterOrder: function() {
    wx.navigateTo({
      url: '/pages/masterdetailList/masterOrder/masterOrder'
    })
  },
  //跳转到编辑信息页面
  toedit: function() {
    let status=this.data.status;
    // console.log('status',status)
    wx.navigateTo({
      url: '/pages/masterdetailList/masterEdit/masterEdit?status='+status
    })
  },
  //设置
  masterSet: function() {
    wx.navigateTo({
      url: '/pages/masterdetailList/masterSet/masterSet'
    })
  }
})