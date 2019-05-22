// pages/store/storeOrder/storeOrder.js
const app = getApp();
Page({
  data: {
    showFlag: 0,
    nav: [{
        label: '已接单',
        type: 0
      },
      {
        label: '在执行',
        type: 1
      },
      {
        label: '已完成',
        type: 2
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
      showFlag: type
    });
    if (this.data.showFlag==0){
      this.changType(1, 10, 2);
    }
    if (this.data.showFlag == 1) {
      this.changType(1, 10, 3);
    }
    if (this.data.showFlag == 2) {
      this.changType(1, 10, 4);
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },
  // 订单任务的接口status（2: 已接单; 3: 在执行; 4: 已完成;）
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
            masterSuccess: res.data.data.list
          })
          for (var i = 0; i < that.data.masterSuccess.length; i++) {
            let createTime = 'masterSuccess[' + i + '].createTime';
            var data = that.data.masterSuccess[i].createTime
            console.log(app.changeDate(data))
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
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    app.changStatus(id, 3)
    let status = 'masterSuccess[' + index + '].status';
    console.log(status);
    this.setData({
      [status]: 3
    })
    console.log(status);
  },
  //已执行的确定
  readyTrue(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    app.changStatus(id, 4)
    let status = 'masterSuccess[' + index + '].status';
    console.log(status);
    this.setData({
      [status]: 4
    })
  },
  //已完成的确定
  successTrue(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    app.changStatus(id, 4)
    let status = 'masterSuccess[' + index + '].status';
    console.log(status);
    this.setData({
      [status]: 4
    })
  },
  //去详情页(已接单)
  goDetail(e){
    let id = e.currentTarget.dataset.id;
    let masterTypeId = e.currentTarget.dataset.masterid;
    let state = 2
    console.log('id',id)
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
    this.changType(1, 10, 2);
    console.log(this.data.masterSuccess)
  },
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

})