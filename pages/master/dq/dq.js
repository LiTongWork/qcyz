// pages/master/dq/dq.js
const $http = require('../../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    masterType: '',
    masterTypeId: '',
    content: {},
    itemList: [],
    totalMoney: 0,
    startTime: 1,
    useTime: 1,
    region: {},
    regionStatus: false,
    detailAddress: '',
    tips: '以上不包括打混凝土墙体或梁',//小字注释
    selCouponsId: '',
    remark: ''
  },
  // 项目数量修改
  countInput: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let number = Number(e.detail.value);
    let num = `content[${i}].count`
    let bb = `itemList[${i}].number`;
    that.setData({
      [num]: number,
      [bb]: number
    })
    that.totalMoney();
    console.log(that.data.itemList)
  },
  // 点击添加
  plusInput: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let num = `content[${i}].count`
    let bb = `itemList[${i}].number`;
    that.setData({
      [num]: that.data.content[i].count + 1,
      [bb]: that.data.content[i].count
    })
    that.totalMoney();
    console.log(that.data.itemList)
  },
  // 点击减少
  minusInput: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let num = `content[${i}].count`
    let bb = `itemList[${i}].number`;
    if (that.data.content[i].count > 0) {
      that.setData({
        [num]: that.data.content[i].count - 1,
        [bb]: that.data.content[i].count
      })
    }
    that.totalMoney();
    console.log(that.data.itemList)
  },
  // 总价计算
  totalMoney: function () {
    let that = this;
    let totalMoney = 0;
    for (let i in that.data.content) {
      let count = that.data.content[i].count;
      let pice = that.data.content[i].pice;
      totalMoney = totalMoney + count * pice;
      console.log(count, pice,totalMoney)
    }     
    that.setData({
      totalMoney: totalMoney.toFixed(2)
    })
  },
  // 开工日期
  startTimeInput: function(e) {
    // 输入
    let that = this;
    let startTime = Number(e.detail.value)
    that.setData({
      startTime: startTime
    })
  },
  startTimePlus:function () {
    // 开工日期增加
    let that = this;
    that.setData({
      startTime: that.data.startTime + 1
    })
  },
  startTimeMinus: function () {
    // 开工日期减少
    let that = this;
    if (that.data.startTime > 1) {
      that.setData({
        startTime: that.data.startTime - 1
      })
    }
  },
  // 用工日期
  useTimeInput: function (e) {
    // 输入
    let that = this;
    let startTime = Number(e.detail.value)
    that.setData({
      startTime: startTime
    })
  },
  useTimePlus: function () {
    // 用工日期增加
    let that = this;
    that.setData({
      useTime: that.data.useTime + 1
    })
  },
  useTimeMinus: function () {
    // 用工日期减少
    let that = this;
    if (that.data.useTime > 1) {
      that.setData({
        useTime: that.data.useTime - 1
      })
    }
  },
  // 选择省市区/县
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail,
      regionStatus: true
    })
    console.log(this.data.region)
  },
  // 输入详细地址
  detailAddInput: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
    // console.log(this.data.detailAddress)
  },
  // 下单提交
  sub:function(){
    let that = this;
    if (!(that.data.totalMoney > 0)){
      // 判断价格
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (!(that.data.startTime > 0)){
      // 判断开工日期
      wx.showToast({
        title: '开工日期必须大于0',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (!(that.data.useTime > 0)) {
      // 判断开工日期
      wx.showToast({
        title: '用工日期必须大于0',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (!that.data.region.value) {
      // 选择地区
      wx.showToast({
        title: '请选择地区',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (!that.data.detailAddress) {
      // 详细地址
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }else {
      console.log('coupons', that.data.selCouponsId)
      let parmas = {
        address: that.data.detailAddress,
        area: that.data.region.value[2],
        city: that.data.region.value[1],
        province: that.data.region.value[0],
        startTime: that.data.startTime,
        useTime: that.data.useTime,
        itemList: that.data.itemList,
        masterTypeId: that.data.masterTypeId,
        openId: app.globalData.openId,
        couponsId: that.data.selCouponsId
      }
      console.log(parmas);
      $http.post('/api/User/WorkOrder',parmas)
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          console.log(res);
          if (res.data){
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.prepayId,
              signType: 'MD5',
              paySign: res.data.data.sign,
              success(res) {
                console.log(res);
                wx.switchTab({
                  url: '/pages/mine/mine'
                })
              },
              fail(res) {
                console.log(res)
              }
            })
          }else{
            wx.showToast({
              title: '下单成功',
              icon: 'none',
              mask: true,
              duration: 1500
            })
            setTimeout(function(){
              wx.switchTab({
                url: '/pages/mine/mine',
              })
            },1500)
          }
        }else {
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
    }

  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: options.title
    })
    that.setData({
      masterType: options.title
    })
    
    $http.post('/api/User/WorkItemList', { masterTypeId: options.type})
    .then(res => {
      console.log(res);
      that.setData({
        content: res.data.list,
        masterTypeId: res.data.id,
        remark: res.data.remark
      })
      // 初始化价格
      that.totalMoney();
      // 遍历内容，提取需要的内容
      for (let i in that.data.content) {
        let obj = {
          itemId: that.data.content[i].id,
          number: that.data.content[i].count
        }
        that.data.itemList.push(obj)
      }
      // console.log(that.data.itemList)
    })
    .catch(res => {
      console.log(res)
    })
  },
  onShow: function (){
    let that = this;
    that.setData({
      selCouponsId: app.globalData.selCouponsId
    })
  },
  onUnload: function (){
    let that = this;
    app.globalData.selCouponsId = '';
    that.setData({
      selCouponsId: app.globalData.selCouponsId
    })
  },
// 跳转
  toCoupons: function (e){
    let that = this;
    let money = e.currentTarget.dataset.money;
    console.log('totalMoney',money)
    wx.navigateTo({
      url: `/pages/mine/coupons/coupons?from=dq&meney=${money}`
    })
  }
  
})