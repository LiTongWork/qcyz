// pages/store/storeOrder/storeOrder.js
const $http = require('../../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      {
        label: '全部',
        type: -1
      },
      {
        label: '未支付',
        type: 0
      },
      {
        label: '已下单',
        type: 1
      },
      {
        label: '已接单',
        type: 2
      },
      {
        label: '在执行',
        type: 3
      },
      {
        label: '待确认',
        type: 6
      },
      {
        label: '待评价',
        type: 4
      }
    ],
    list:[],
    page: 1,
    rows: 10,
    status: -1
  },
  // 点击导航
  clickNavigation: function (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let title = e.currentTarget.dataset.title;
    this.setData({
      page: 1,
      status: type,
      list: []
    });
    wx.setNavigationBarTitle({
      title: title
    })
    // 重新获取列表
    let params = {
      page: that.data.page,
      rows: that.data.rows,
      status: that.data.status
    }
    that.getList(params)
  },
  // 获取订单列表
  getList: function (params) {
    let that = this;
    $http.post('/api/UserCenter/WorkIndentPage', params)
    .then(res => {
      console.log(res);
      if (res.code == 200) {
        for (let i in res.data.list){
          let createTime = res.data.list[i].createTime;
          let arr = createTime.split('T');
          let arr2 = arr[1].split(':');
          createTime = arr[0]+ ' '+ arr2[0] + ':'+ arr2[1];
          res.data.list[i].createTime = createTime;
        }
        that.setData({
          list: that.data.list.concat(res.data.list)        
        })
        wx.stopPullDownRefresh()
      }else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          mask: true,
          duration: 1500
        })
        return false;
      }

    })
    .catch(res => {
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      status: options.type
    })
    // 获取订单列表
    let params = {
      page: that.data.page,
      rows: that.data.rows,
      status: that.data.status
    }
    that.getList(params)
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

  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      page: 1,
      list: []
    })
    let params = {
      page: that.data.page,
      rows: that.data.rows,
      status: that.data.status
    }
    that.getList(params)
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function (e) {
    console.log('reachBottom');
    let that = this;
    that.setData({
      page: that.data.page + 1
    })
    let params = {
      page: that.data.page,
      rows: that.data.rows,
      status: that.data.status
    }
    that.getList(params)
  },


  // 支付
  pay: function (e) {
    console.log(e.currentTarget.dataset.id)
    let that = this;
    let params = {
      id: e.currentTarget.dataset.id,
      openId: app.globalData.openId
    }
    $http.post('/api/User/AgainOrder',params)
    .then(res => {
      console.log(res)
      if (res.code == 200) {
        // console.log(res);
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.prepayId,
          signType: 'MD5',
          paySign: res.data.data.sign,
          success(res) {
            console.log(res);
            // 刷新获取列表
            let params = {
              page: 1,
              rows: that.data.rows,
              status: that.data.status
            }
            that.getList(params)
          },
          fail(res) {
            console.log(res)
          }
        })
      } else {
        console.log(res)
        wx.showToast({
          title: res.message,
          icon: 'none',
          mask: true,
          duration: 1500
        })
      }
    })
    .catch(res => {
      console.log(res)
    })
  },
  // 取消订单/退款
  cancelPay: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    $http.post('/api/UserCenter/CancelWorkIndent',{id: id})
    .then(res => {
      console.log(res);
      wx.showToast({
        title: res.message,
        icon: 'none',
        mask: true,
        duration: 1500
      })
      setTimeout(function () {
        if (res.code == 200) {
          that.setData({
            page: 1,
            list: []
          })
          let params = {
            page: that.data.page,
            rows: that.data.rows,
            status: that.data.status
          }
          that.getList(params)
        }
      }, 1500)

    })
    .catch(res => {
      console.log(res)
    })
  },
  // 确认订单
  confirmOrder: function(e){
    let that = this;
    console.log(e.currentTarget.dataset)
    let id = e.currentTarget.dataset.id;
    let params = {
      id: id,
      status: 4
    }
    $http.post('/api/UserCenter/UserConfirm',params)
    .then(res => {
      console.log(res);
      wx.showToast({
        title: res.message,
        icon: 'none',
        mask: true,
        duration: 1500
      })
      setTimeout(function(){
        if (res.code == 200) {
          that.setData({
            page: 1,
            list: []
          })
          let params = {
            page: that.data.page,
            rows: that.data.rows,
            status: that.data.status
          }
          that.getList(params)
        }
      },1500)
      return false
    })
    .catch(res => {
      console.log(res)
    })
  },
  // 跳转
  toComment: function (e) {
    // console.log(e.currentTarget.dataset);
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/mine/comment/comment?id=${id}&type=${type}&from=work`
    })
  }
})