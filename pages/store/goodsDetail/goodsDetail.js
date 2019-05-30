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
    id:'',//商品id
    goodsContent: '',
    html: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'font-size:20px; background-color:#666;'
      },
      children: [{
        type: 'text',
        text: ''
      }]
    }],
  },
  // 加入购物车
  addCar: function () {
    var that = this
    let baseUrl = app.globalData.baseURL;
    if (wx.getStorageSync("auth") != '' && wx.getStorageSync('openId') != '' && wx.getStorageSync('loginType') == 6) {
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
          console.log(res)
          wx.showToast({
            title: res.message,
            icon: 'success',
            mask: true,
            duration: 2000
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
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
    $http.post('/api/Home/GetGoodsDetails',{id:options.id})
    .then(res => {
      // console.log(res.data);
      that.setData({
        detailData: res.data
      })
      res.data.goodsContent = res.data.goodsContent
        .replace(/\\/g, "").replace(/<img/g, "<img class='rich-img' mode='widthFix'")
        .replace(/<section/g, '<div')
        .replace(/\/section>/g, '\div>');
      let aa = `html[0].children[0].text`
      that.setData({
        'detailData.goodsImg': that.data.detailData.goodsImg.split(','),
        goodsContent: res.data.goodsContent,
        [aa]: res.data.goodsContent
      })
      // console.log(that.data.goodsContent)
    })
    .catch(res => {
      console.log(res)
    })
  },
  // 跳转
  toGoodsComments: function(e) {
    // 跳转商品评论
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/store/goodsComments/goodsComments?id=${id}`,
    })
  },
  toShopCar: function () {
    // 跳转购物车
    if (wx.getStorageSync("auth") != '' && wx.getStorageSync('openId') != '' && wx.getStorageSync('loginType') == 6) {
      wx.navigateTo({
        url: '/pages/store/shopCar/shopCar',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  toMakeSure: function (e) {
    let that = this;
    if (wx.getStorageSync("auth") != '' && wx.getStorageSync('openId') != '' && wx.getStorageSync('loginType') == 6) {
      let goodid = this.data.id
      // 跳转确认订单
      wx.navigateTo({
        url: '/pages/store/makeSure/makeSure?goodid=' + goodid,
      })
    }else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  }
})