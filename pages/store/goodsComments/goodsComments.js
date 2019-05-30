// pages/store/goodsComments/goodsComments.js
const $http = require('../../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    id: '',
    page: 1,
    rows: 10,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      id: options.id
    })
    console.log(that.data.id);
    that.getList()
  },
  // 获取评价列表
  getList: function(){
    let that = this;
    let params = {
      page: that.data.page,
      rows: that.data.rows,
      goodsid: that.data.id
    }
    $http.post('/api/Home/GoodsReviewPage', params)
    .then(res => {
      console.log(res.data.list);
      if (res.code == 200) {
        for(let i in res.data.list){
          let createTime = res.data.list[i].createTime;
          let arr = createTime.split('T');
          let arr2 = arr[1].split(':');
          res.data.list[i].createTime = arr[0] + ' ' + arr2[0] + ':' + arr2[1];
          res.data.list[i].imgs = res.data.list[i].imgs.split(',')
        }
        that.setData({
          list: that.data.list.concat(res.data.list)
        })
      }
      wx.stopPullDownRefresh()
    })
    .catch(res => {
      console.log(res)
    })
  },
  // 图片预览
  previewImg: function(e){
    let that = this;
    let url = e.currentTarget.dataset.url;
    let urls = e.currentTarget.dataset.urls;
    for (let i in urls) {
      urls[i] = that.data.imgUrl + urls[i]
    }
    console.log(url)
    console.log(urls)
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      page: 1
    })
    that.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      page: that.data.page + 1
    })
    that.getList()
  }
})