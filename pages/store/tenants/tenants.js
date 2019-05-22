// pages/store/tenants/tenants.js
const $http = require('../../../utils/config.js');
const md5 = require('../../../utils/md5.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    GoodsTypeId: '',
    category: [
      {
        id: '12D2E476-66CE-4E9B-B754-9085F3542374',
        label: '木材',
        status: false
      },
      {
        id: 2,
        label: '瓷砖',
        status: false
      },
      {
        id: 3,
        label: '卫浴',
        status: false
      },
      {
        id: 4,
        label: '沙发',
        status: false
      },
      {
        id: 5,
        label: '桌椅',
        status: false
      },
      {
        id: 6,
        label: '窗帘',
        status: false
      },
      {

        id: 7,
        label: '墙纸',
        status: false
      },
      {
        id: 8,
        label: '其他',
        status: false
      }
    ]
  },
  // 选择商品类别
  choose: function (e) {
    let that = this;
    that.setData({
      GoodsTypeId: e.currentTarget.dataset.id
    })
    console.log(that.data.GoodsTypeId)
    let i = e.currentTarget.dataset.index;
    for (let k in that.data.category) {
      let aa = `category[${k}].status`;
      if (i == k) {
        that.setData({
          [aa]: !that.data.category[k].status
        })
      }else {
        that.setData({
          [aa]: false
        })
      }
    }
  },
  // 输入事件
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 提交审核
  sub: function () {
    let that = this;
    let MerchantName = that.data.name;
    let LinkPhone = that.data.phone;
    let GoodsTypeId = that.data.GoodsTypeId;
    if (MerchantName == '') {
      wx.showToast({
        title: '请填写商家名称',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    }else if (LinkPhone == '') {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (!app.phoneReg(LinkPhone)) {
      console.log(LinkPhone)
      wx.showToast({
        title: '手机号码不正确',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (GoodsTypeId == '') {
      wx.showToast({
        title: '请选择商品类别',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else {
      let params = {
        MerchantName: MerchantName,
        LinkPhone: LinkPhone,
        GoodsTypeId: GoodsTypeId
      }
      
      $http.post('/api/Register/MerchantRegister', params)
        .then(res => {
          wx.showToast({
            title: res.message,
            icon: 'none',
            mask: true,
            duration: 1500
          })
          return false;
        })
        .catch(res => {
          console.log(res)
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // nav导航
    $http.post('/api/Store/GoodsType', {})
      .then(res => {
        let other = {
          id: '00000000-0000-0000-0000-000000000000',
          dicName: '其他',
          typeCode: 'A001',
          parentId: '00000000-0000-0000-0000-000000000000',
          sort: res.data.length + 1
        }
        res.data.push(other)
        console.log(res.data);
        
        that.setData({
          category: res.data
        })
      })
      .catch(res => {
        console.log(res)
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

  }
})