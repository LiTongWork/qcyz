// pages/store/storeOrder/storeOrder.js
const $http = require('../../../utils/config.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    showFlag: -1,
    nav: [{
        label: '全部',
        type: -1
      },
      {
        label: '待付款',
        type: 0
      },
      {
        label: '待发货',
        type: 1
      },
      {
        label: '待收货',
        type: 2
      },
      {
        label: '待评价',
        type: 3
      }
    ],
    user: {},
    storeData: [],
    indentList: [],
    orderList: [], //订单列表
    goodsChecked: [], //选中的商品id,number列表
    page: 1,
    rows: 3
  },
  //列表的调取 状态(0:未支付;1:已支付;2:已发货;3:已签收;4:已评价;5:已退回;-1:全部)
  changeList(page, rows, type) {
    var that = this
    let baseUrl = app.globalData.baseURL;
    let imgUrl = app.globalData.imgUrl;
    wx.request({
      url: baseUrl + '/api/UserCenter/IndentHall',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        page: page,
        rows: rows,
        status: type
      },
      success(res) {
        console.log(res.data)
        that.setData({
          storeData: that.data.storeData.concat(res.data.data.list), //店铺信息
        })
      }
    })
  },
  // 点击导航
  clickNavigation: function(e) {
    let type = e.currentTarget.dataset.type;
    let title = e.currentTarget.dataset.title;
    this.setData({
      showFlag: type,
      page: 1
    });
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      storeData: []
    })
    this.changeList(this.data.page, this.data.rows, type);
  },
  //点击付款
  payMoney(e) {
    var that = this
    let baseUrl = app.globalData.baseURL;
    let index = e.currentTarget.dataset.index;
    let indentId = that.data.storeData[index].indentId;
    console.log("indentId", indentId)
    wx.request({
      url: baseUrl + '/api/UserCenter/AgainOrder',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        indentid: indentId,
        openId: app.globalData.openId
      },
      success(res) {
        console.log('code', res.data.code);
        wx.requestPayment({
          timeStamp: res.data.data.data.timeStamp,
          nonceStr: res.data.data.data.nonceStr,
          package: res.data.data.data.prepayId,
          signType: 'MD5',
          paySign: res.data.data.data.sign,
          success(res) {
            that.setData({
              page: 1
            });
            that.setData({
              storeData: []
            })
            that.changeList(that.data.page, that.data.rows, that.data.showFlag);
          },
          fail(res) {}
        })
      }
    })
  },
  // 确认收货
  confimGoods: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      success(res) {
        if (res.confirm) {
          $http.post('/api/UserCenter/ConfirmTake', {
              id: id
            })
            .then(res => {
              console.log(res);
              wx.showToast({
                title: res.message,
                icon: 'none',
                mask: true,
                duration: 1500
              })
              if (res.code == 200) {
                that.setData({
                  page: 1,
                  storeData:[]
                })
                that.changeList(that.data.page, that.data.rows,that.data.showFlag);
              }
            })
            .catch(res => {
              console.log(res)
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //评价
  pinjia(e) {
    let id = e.currentTarget.dataset.id;
    let type = "store";
    let isreview = e.currentTarget.dataset.isreview;

    console.log(isreview)
    wx.navigateTo({
      url: "/pages/mine/comment/comment?id=" + id + '&from=' + type + '&isreview=' + isreview,
      // url: `/pages/mine/comment/comment?id= ${id} &form= ${type} &isreview=${isreview}`
    })
  },
  //生命周期函数--监听页面加载
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      showFlag: options.type
    })
    console.log(this.data.showFlag)
    this.changeList(this.data.page, this.data.rows, this.data.showFlag);
  },
  //生命周期函数--监听页面显示
  onShow: function() {

  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    let that = this;
    that.setData({
      showFlag: that.data.showFlag,
      page: 1
    });
    that.setData({
      storeData: []
    })
    that.changeList(that.data.page, that.data.rows, that.data.showFlag);
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function(e) {
    let that = this;
    this.setData({
      page: that.data.page + 1
    })
    this.changeList(this.data.page, this.data.rows, this.data.showFlag);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 跳转
  toLogistics: function(e) {
    console.log(e.currentTarget.dataset)
    // 查看物流
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/mine/logistics/logistics?id=${id}`
    })
  }
})