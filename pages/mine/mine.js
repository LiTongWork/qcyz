// pages/mine/mine.js
const $http = require('../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/static/img/defaultPhoto.png',
    name: '猪猪',
    id: '',
    yue: '66.00',
    yongjin: '20.00',
    orderList: [{
        img: '/static/img/icon-pay.png',
        label: '待付款',
        type: 0,
        count: ''
      },
      {
        img: '/static/img/icon-send.png',
        label: '待发货',
        type: 1,
        count: ''
      },
      {
        img: '/static/img/icon-goods.png',
        label: '待收货',
        type: 2,
        count: ''
      },
      {
        img: '/static/img/icon-evaluation1.png',
        label: '待评价',
        type: 3,
        count: ''
      }
      // {
      //   img: '/static/img/icon-refund.png',
      //   label: '退款/退货',
      //   type: 5,
      //   count: ''
      // }
    ],
    workList: [{
        img: '/static/img/icon-pay.png',
        label: '未支付',
        type: 0,
        count: ''
      },
      {
        img: '/static/img/icon-xiadan.png',
        label: '已下单',
        type: 1,
        count: ''
      },
      {
        img: '/static/img/icon-jiedan.png',
        label: '已接单',
        type: 2,
        count: ''
      },
      {
        img: '/static/img/icon-perform.png',
        label: '在执行',
        type: 3,
        count: ''
      },
      {
        img: '/static/img/icon-finshed.png',
        label: '待评价',
        type: 4,
        count: ''
      }
    ]
  },
  // 退出登录
  logOut: function() {
    wx.setStorageSync('auth', '');
    wx.setStorageSync('loginType', '');
    wx.setStorageSync('openId', '');
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(wx.getStorageSync('loginType'))
    let that = this;
    console.log(app.globalData.userInfo)
    that.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      name: app.globalData.userInfo.nickName
    })
    // 用户信息
    $http.post('/api/User/MyLoginInfo', {})
      .then(res => {
        // console.log('MyLoginInfo',res);
        if (res.code == 200) {
          that.setData({
            id: res.data.mobile
          })
        }
      })
      .catch(res => {
        console.log('catch', res)
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    // 订单信息
    $http.post('/api/User/IndentStatis', {})
      .then(res => {
        console.log('IndentStatis',res);
        if (res.code == 200) {
          that.setData({
            'orderList[0].count': res.data.noPay,
            'orderList[1].count': res.data.pay,
            'orderList[2].count': res.data.go,
            'orderList[3].count': res.data.collect,
            // 'orderList[4].count': res.data.quit,
            'workList[0].count': res.data.workNoPay,
            'workList[1].count': res.data.workPay,
            'workList[2].count': res.data.workOrder,
            'workList[3].count': res.data.workBusy,
            'workList[4].count': res.data.workComplete
          })
        }
      })
      .catch(res => {
        console.log('catch', res)
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
  // 跳转
  toEdit: function() {
    // 编辑信息
    wx.navigateTo({
      url: '/pages/mine/edit/edit',
    })
  },
  toCommission: function() {
    // 我的佣金
    wx.navigateTo({
      url: '/pages/mine/commission/commission'
    })
  },
  toStoreall() {
    let type = -1;
    let title = "商城订单";
    wx.navigateTo({
      url: "/pages/mine/storeOrder/storeOrder?type=" + type + '&title=' + title,
    })
  },
  toStoreOrder: function(e) {
    let type = e.currentTarget.dataset.type;
    let title = "商城订单"
    // 商城订单
    wx.navigateTo({
      url: "/pages/mine/storeOrder/storeOrder?type=" + type +'&title=' + title,
    })
  },
  toWorkOrder: function(e) {
    // 施工订单
    let type = e.currentTarget.dataset.type;
    let title = e.currentTarget.dataset.title;

    console.log(type)
    wx.navigateTo({
      url: `/pages/mine/workOrder/workOrder?type=${type}&title=${title}`,
    })
  },
  // 我是师傅
  toRegister: function() {
    // wx.setStorageSync('auth', '');
    // wx.setStorageSync('loginType', '');
    wx.navigateTo({
      url: '/pages/login/login?type=register&from=mine',
    })
  },
  toInstructions: function() {
    // 操作说明
    wx.navigateTo({
      url: '/pages/mine/instructions/instructions',
    })
  },
  toCoupons: function() {
    // 优惠券
    wx.navigateTo({
      url: '/pages/mine/coupons/coupons',
    })
  },
  toChagePwd: function() {
    // 修改密码
    wx.navigateTo({
      url: '/pages/mine/changePwd/changePwd',
    })
  }
})