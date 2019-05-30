// pages/store/storeOrder/storeOrder.js
const app = getApp();
Page({
  data: {
    showFlag: 2,
    page:1,
    rows:6,
    nav: [{
        label: '已接单',
        type: 2
      },
      {
        label: '在执行',
        type: 3
      },
      {
        label: '已完成',
        type: 6
      }
    ],
    masterSuccess: [],
    doingPic: "", //在执行任务的图片
    successList: [],
    showTrue:true,
    doit:"确认订单"
  },
  // 点击导航
  clickNavigation: function(e) {
    let type = e.currentTarget.dataset.type;
    let title = e.currentTarget.dataset.title;
    this.setData({
      showFlag: type,
      masterSuccess:[]
    });
    this.changType(1, 7, type);
    wx.setNavigationBarTitle({
      title: title
    })
  },
  // 订单任务的接口status（2: 已接单; 3: 在执行; 6: 已完成;）
  changType: function(page, rows, status) {
    var that = this;
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl + '/api/Work/WorkTaskPage',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        page: page,
        rows: rows,
        status: status
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data);
          that.setData({
            masterSuccess: that.data.masterSuccess.concat(res.data.data.list)
          })
          for (var i = 0; i < that.data.masterSuccess.length; i++) {
            let createTime = 'masterSuccess[' + i + '].createTime';
            var data = that.data.masterSuccess[i].createTime
            // console.log(app.changeDate(data))
            console.log('status', that.data.masterSuccess[i].status)
            that.setData({
              [createTime]: app.changeDate(data)
            })
          }
        }
      }
    })
  },
  //已接单的确定
  takeTrue(e) {
    let that =this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    console.log(id,index)
    app.changStatus(id, 3)
    let status = 'masterSuccess[' + index + '].status';
    console.log(status);
    that.setData({
      [status]: 0
    })
    wx.showToast({
      title: '订单已确认',
      icon: 'none',
      mask: true,
      duration: 2000
    })
    console.log('this.data.masterSuccess[index].status', that.data.masterSuccess[index].status);
  },
  //已执行的确定
  readyTrue(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    app.changStatus(id, 6)
    let status = 'masterSuccess[' + index + '].status';
    console.log(status);
    this.setData({
      [status]: 0
    })
    wx.showToast({
      title: '订单已确认',
      icon: 'none',
      mask: true,
      duration: 2000
    })
    console.log('status',this.data.masterSuccess[index].status);
  },
  //已完成的确定
  successTrue(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    app.changStatus(id, 6)
    let status = 'masterSuccess[' + index + '].status';
    console.log(status);
    this.setData({
      [status]: 6
    })
    console.log(status);
  },
  //去详情页(已接单)
  goDetail(e){
    let id = e.currentTarget.dataset.id;
    let masterTypeId = e.currentTarget.dataset.masterid;
    let state = this.data.showFlag
    console.log('state', state)
    wx.navigateTo({
      url: '/pages/masterdetailList/masterDetail/masterDetail?id=' + id + '&state=' + state + '&masterTypeId=' + masterTypeId
    })
  },
  //去详情页(在执行)
  detailOfffer(e) {
    let id = e.currentTarget.dataset.id
    let masterTypeId = e.currentTarget.dataset.masterid;
    let state = 3
    wx.navigateTo({
      url: '/pages/masterdetailList/masterDetail/masterDetail?id=' + id + '&state=' + state + '&masterTypeId=' + masterTypeId
    })
    console.log('state', state)
  },
  //生命周期函数--监听页面加载
  onLoad: function(options) {
    this.changType(1, 7, 2);
    // console.log(this.data.masterSuccess)
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
  },

 //页面上拉触底事件的处理函数
  onReachBottom: function(e) {
    let that = this;
    that.setData({
      page: that.data.page + 1,
      // masterSuccess:[]
    })
    console.log('this.data.showFlag', that.data.showFlag)
    that.changType(that.data.page, that.data.rows, that.data.showFlag)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 跳转

})