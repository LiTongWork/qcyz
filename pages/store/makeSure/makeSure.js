// pages/store/makeSure/makeSure.js
const app = getApp();
Page({
  data: {
    showAddress: '',
    consigneeName: '',
    consigneeMobile: '',
    province: '',
    city: '',
    area: '',
    address: '',
    merchantName: '',
    goodsContent: '',
    goodsImg: '',
    freight: '',
    money: '',
    number: '',
    goodid: "",
    allPrice: 0, //合计
    goodsChecked:[]
  },
  // 选的地址
  addressList(status) {
    let that = this;
    let baseUrl = app.globalData.baseURL;
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
        console.log(res.data.message)
        if (res.data.message == 1) {
          that.setData({
            showAddress: res.data.message,
            consigneeName: res.data.data[0].consigneeName,
            consigneeMobile: res.data.data[0].consigneeMobile,
            province: res.data.data[0].province,
            city: res.data.data[0].city,
            area: res.data.data[0].area,
            address: res.data.data[0].address
          })
        } else {
          that.setData({
            showAddress: res.data.message
          })
        }
      }
    })
  },
  // 订单列表
  goodList() {
    let that = this;
    let baseUrl = app.globalData.baseURL;
    let imgUrl = app.globalData.imgUrl;
    wx.request({
      url: baseUrl + '/api/Store/GetGoodsDetails',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        id: that.data.goodid
      },
      success(res) {
        console.log(res.data.data)
        that.setData({
          merchantName: res.data.data.merchantName,
          goodsImg: imgUrl + res.data.data.goodsImg,
          goodsContent: res.data.data.goodsName,
          freight: res.data.data.freight,
          money: res.data.data.money,
          number: res.data.data.number
        })
        that.allPrice()
      }
    })
  },
  // 添加商品
  increase: function() {
    this.setData({
      number: this.data.number + 1
    })
    this.allPrice();
  },
  // 减少商品
  reduce: function() {
    if (this.data.number > 1) {
      this.setData({
        number: this.data.number - 1
      })
    }
    this.allPrice();
  },
  //总价
  allPrice() {
    var that = this;
    var all = 0
    console.log('that.data.money', that.data.money)
    all = Number(that.data.money) * Number(that.data.number) + Number(that.data.freight)
    console.log('all', all)
    that.setData({
      allPrice: all.toFixed(2)
    })

  },
  //生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      goodid: options.goodid
    })
    console.log('goodid', this.data.goodid)
    this.addressList(1);
    this.goodList();
  },
  //提交订单
  orderGoods() {
    var that = this
    let baseUrl = app.globalData.baseURL;
    console.log('that.data.number', that.data.number)
    let goodsChecked = {
      GoodsId: that.data.goodid,
      number: that.data.number
    }
    that.data.goodsChecked.push(goodsChecked)
    wx.request({
      url: baseUrl + '/api/UserCenter/SaveOrder',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        GoodsList: that.data.goodsChecked,
        IsShopping: true, //是否来自购物车
        Freight: that.data.freight, //运费总价
        UserAddressId: that.data.province + that.data.city + that.data.area + that.data.address,
        CouponsId: "",
        openId: app.globalData.openId
      },
      success(res) {
        console.log(res);
        wx.requestPayment({
          timeStamp: res.data.data.data.timeStamp,
          nonceStr: res.data.data.data.nonceStr,
          package: res.data.data.data.prepayId,
          signType: 'MD5',
          paySign: res.data.data.data.sign,
          success(res) {
            console.log("=====")
          },
          fail(res) {}
        })
      }
    })
  }, //提交订单
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  toAddress: function() {
    // 我的收货地址
    wx.navigateTo({
      url: '/pages/store/address/address'
    })
  },
  toNewAddress: function() {
    // 新增地址
    wx.navigateTo({
      url: '/pages/store/newAddress/newAddress',
    })
  }
})