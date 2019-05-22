//index.js
const $http = require('../../utils/config.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    positioning: '定位',
    imgUrl: app.globalData.imgUrl,
    swiperData: {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration:800,
      indicatorActiveColor: '#fff'
    },
    topBannerData: [],
    adData: {},
    bottomBannerData: [],
    masterType: [],
    searchName: ''
  },
  onLoad: function () {
    let that = this;
    // 图片轮播广告信息
    $http.post('/api/Home/AdvList',{})
      .then(res => {
        console.log(res);
        if(res.code == 200){
          that.setData({
            topBannerData: res.data.headList,
            adData: res.data.center,
            bottomBannerData: res.data.footList
          })
        }
      })
      .catch(res => {
        console.log('catch', res);
      })
    // 家政保洁信息 
    $http.post('/api/Register/MasterTypeList', {})
      .then(res => {
        // console.log(res);
        that.setData({
          masterType: res.data
        })
        // console.log(that.data.masterType)
      })
      .catch(res => {
        console.log(res)
      })
  },
  // 下拉刷新 
  onPullDownRefresh: function (){
    let that = this;
    // 图片轮播广告信息
    $http.post('/api/Home/AdvList', {})
      .then(res => {
        console.log(res);
        if (res.code == 200) {
          that.setData({
            topBannerData: res.data.headList,
            adData: res.data.center,
            bottomBannerData: res.data.footList
          })
        }
      })
      .catch(res => {
        console.log('catch', res);
      })
    // 家政保洁信息 
    $http.post('/api/Register/MasterTypeList', {})
      .then(res => {
        // console.log(res);
        that.setData({
          masterType: res.data
        })
        // console.log(that.data.masterType)
      })
      .catch(res => {
        console.log(res)
      })

      // 停止下拉动作
      setTimeout(function(){
        wx.stopPullDownRefresh()
      },1000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '七彩云装',
      path: '/pages/index/index',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  // 搜索框输入
  searchInput: function (e){
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
  toCity: function () {
    // wx.navigateTo({
    //   url: '/pages/city/city',
    // })
  },
  toShopCar: function () {
    wx.navigateTo({
      url: '/pages/store/shopCar/shopCar',
    })
  },
  toMaster: function () {
    wx.navigateTo({
      url: '/pages/master/master'
    })
  },
  toStore: function () {
    wx.switchTab({
      url: '/pages/store/store'
    })
  },
  toDesign: function () {
    wx.navigateTo({
      url: '/pages/design/design',
    })
  },
  // toDecorateKeeper: function () {
  //   wx.navigateTo({
  //     url: '/pages/decorateKeeper/decorateKeeper',
  //   })
  // },
  toMasterDq: function(e){
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    console.log('id', id);
    wx.navigateTo({
      url: `/pages/master/dq/dq?type=${id}&title=${title}`
    });
  },
  toCase: function () {
    wx.navigateTo({
      url: '/pages/case/case',
    })
  },
  toClean: function (e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: `/pages/master/dq/dq?type=${id}&title=${title}`
    });
  },
  toRegister: function (e) {
    let type = e.currentTarget.dataset.type;
    let from = e.currentTarget.dataset.from;
    wx.navigateTo({
      url: `/pages/login/login?type=${type}&from=${from}`
    })
  }
})
