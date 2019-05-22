// pages/mine/refund/refund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFlag: 0,
    nav: [
      {
        label: '全部',
        type: 0
      },
      {
        label: '待付款',
        type: 1
      },
      {
        label: '待发货',
        type: 2
      },
      {
        label: '待收货',
        type: 3
      },
      {
        label: '待评价',
        type: 4
      }
    ],
    user: {
      name: '猪猪',
      phone: 13912341234,
      address: '安徽省合肥市蜀山区荷叶地街道'
    },
    detailData: [
      {
        store: '七彩云装店铺1',
        id: '111',
        title: '【吊顶实木】护墙板杉木免漆扣板樟子松室内阳台板材墙裙板111 ',
        imgUrl: [
          {
            url: '/static/img/defaultPhoto.png'
          }
        ],
        oldPrice: 8960.00,
        newPrice: 3980.00,
        freight: 0,
        count: 1,
        status: false
      },
      {
        store: '七彩云装店铺2',
        id: '112',
        title: '【吊顶实木】护墙板杉木免漆扣板樟子松室内阳台板材墙裙板112 ',
        imgUrl: [
          {
            url: '/static/img/defaultPhoto.png'
          }
        ],
        oldPrice: 8960.00,
        newPrice: 3980.00,
        freight: 0,
        count: 1,
        status: false
      }
    ]
  },
  // 点击导航
  clickNavigation: function (e) {
    let type = e.currentTarget.dataset.type;
    let title = e.currentTarget.dataset.title;
    this.setData({
      showFlag: type
    });
    wx.setNavigationBarTitle({
      title: title
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      showFlag: options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 跳转

})