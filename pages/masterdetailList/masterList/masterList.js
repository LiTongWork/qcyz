// pages/masterdetailList/masterList/masterList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    masterList: [],
    province:"",
    city:"",
    area:"",
    page:1,
    state: 1 //未接单
    // type:1,//进入详情页的状态如果被点击接单了，那么对应的状态也要变化
  },
  // 抢单
  orderDan(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    this.changState(id,2);

    let state = 'masterList[' + index + '].status';
    console.log(state);
    this.setData({
      [state]: 2
    })
  },
  //接单数据列表
  masterList: function (province, city, area, page) {
    var that = this
    let baseUrl = app.globalData.baseURL;
    let imgUrl = app.globalData.imgUrl;
    wx.request({
      url: baseUrl + '/api/Work/TaskHall',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        page: page,
        rows: 8,
        province: province,
        city: city,
        area: area
      },
      success(res) {
        if (res.data.code == 200) {
          console.log('masterList', res.data)
          // console.log('masterList', that.data.masterList.masterTypeId)
          that.setData({
            masterList: that.data.masterList.concat(res.data.data.list),
          })
          for (var i = 0; i < that.data.masterList.length; i++) {
            let createTime = 'masterList[' + i + '].createTime';
            var data = that.data.masterList[i].createTime
            // console.log(app.changeDate(data))
            that.setData({
              [createTime]: app.changeDate(data),
              // [that.data.masterList[i].headImg]: imgUrl+ res.data.data.list[i].headImg
            })
          }
        }
      }
    })
  },
  //去详情页
  masterDetail: function(e) {
    console.log(e.currentTarget.dataset)
    let id = e.currentTarget.dataset.id;
    let masterTypeId = e.currentTarget.dataset.masterid;
    let state = 1;
    wx.navigateTo({
      url: '/pages/masterdetailList/masterDetail/masterDetail?id=' + id + '&state=' + state + '&masterTypeId=' + masterTypeId
    })
  },
  // 更新施工状态=师傅端
  changState: function (id, status) {
    var that = this
    let baseUrl = app.globalData.baseURL;
    console.log('baseUrl', baseUrl);
    wx.request({
      url: baseUrl + '/api/Work/UpdateWorkStatus',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        id: id,
        status: status
      },
      success(res) {
      }
    })
  },
  //生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      province: options.province,
      city: options.city,
      area: options.area
    })
    console.log(options.province, options.city, options.area)
    this.masterList(this.data.province,this.data.city,this.data.area,this.data.page);
  },

  
   //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      page:this.data.page + 1
    })
    this.masterList(this.data.province, this.data.city, this.data.area,this.data.page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})