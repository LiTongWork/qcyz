//index.js
const $http = require('../../utils/config.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    swiperData: {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 800,
      indicatorActiveColor: '#fff'
    },
    topBannerData: [],
    storeNav: [],
    adData: {
      storeAd01: '/static/img/storeAd-01.jpg'
    },
    listData: [],
    searchName: ''
  },
  onLoad: function () {
    let that = this;
    // 轮播
    $http.post('/api/Home/AdvList', {})
      .then(res => {
        console.log(res);
        if (res.code == 200) {
          that.setData({
            topBannerData: res.data.headList
          })
        }
      })
      .catch(res => {
        console.log('catch', res);
      })
    // nav导航分类
    $http.post('/api/Store/GoodsType',{})
      .then( res => {
        let all = {
          id: '00000000-0000-0000-0000-000000000000',
          dicName: '全部',
          typeCode: 'A001',
          parentId: '00000000-0000-0000-0000-000000000000',
          sort: res.data.length + 1
        }
        res.data.push(all)
        that.setData({
          storeNav: res.data
        })
      })
      .catch( res => {
        console.log(res)
      })

  },
  onShow: function (){
    let that = this;
    // 推荐爆款
    let goodsPage = {
      isHot: 1,
      page: 1,
      rows: 10
    }
    $http.post('/api/Store/GoodsPage', goodsPage)
      .then(res => {
        console.log(res);
        that.setData({
          listData: res.data.list
        })
        for (let i in that.data.listData) {
          let dd = `listData[${i}].goodsImg`
          that.setData({
            [dd]: that.data.listData[i].goodsImg.split(',')
          })
        }

      })
      .catch(res => {
        console.log(res)
      })
  },
  // 搜索框输入
  searchInput: function (e) {
    let that = this;
    that.setData({
      searchName: e.detail.value
    })
  },
  // 搜索商品
  listSearch: function () {
    let that = this;
    if (that.data.searchName == '') {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else {
      wx.navigateTo({
        url: `/pages/search/search?searchName=${that.data.searchName}`
      })
    }

  },
  // 跳转
  toShopCar: function () {
    // 跳转购物车
    wx.navigateTo({
      url: '/pages/store/shopCar/shopCar',
    })
  },
  toList: function (e) {
    // 商品列表跳转到列表页
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/store/goodsList/goodsList?type=${data.type}&title=${data.title}`
    })
  },
  toGoodsDetail: function (e) {
    // 商品详情
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/store/goodsDetail/goodsDetail?id=${data.id}&title=${data.title}`
    })
  },
  toTenants: function () {
    // 商家入驻
    wx.navigateTo({
      url: '/pages/store/tenants/tenants',
    })
  }
})
