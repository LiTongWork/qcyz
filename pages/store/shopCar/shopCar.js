// pages/store/shopCar/shopCar.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddress: "",
    consigneeName: '',
    consigneeMobile: '',
    province: '',
    city: '',
    area: '',
    address: '',
    detailData: [], //购物车列表
    goodsChecked: [], //选中的商品id,number列表
    totalMoney: '0.00',
    totalStatus: false,
    freight: '' //zong运费
  },
  // 选的地址
  addressList(status) {
    let that = this;
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl + '/api/UserCenter/UserAddressList',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        Status: status
      },
      success(res) {
        // console.log(res.data.message)
        if (res.data.message == 1) {
          that.setData({
            showAddress: res.data.message,
            consigneeName: res.data.data[0].consigneeName,
            consigneeMobile: res.data.data[0].consigneeMobile,
            province: res.data.data[0].province,
            city: res.data.data[0].city,
            area: res.data.data[0].area,
            address: res.data.data[0].address
          })
        }else{
          that.setData({
            showAddress: res.data.message
          })
        }
      }
    })
  },
  // 全选
  total: function() {
    let that = this;
    that.setData({
      totalStatus: !that.data.totalStatus
    });
    if (that.data.totalStatus) {
      for (var k in that.data.detailData) {
        let bb = `detailData[${k}].status`;
        that.setData({
          [bb]: true
        });
      }
      that.totalMoney()
    } else {
      for (var k in that.data.detailData) {
        let bb = `detailData[${k}].status`;
        that.setData({
          [bb]: false
        });
      }
      that.totalMoney()
    }
  },
  // 计算总价
  totalMoney: function(e) {
    var that = this
    var allPrice = 0
    //选中的价格
    for (var i = 0; i < that.data.detailData.length; i++) {
      if (that.data.detailData[i].status) {
        allPrice = Number(allPrice) + Number(that.data.detailData[i].money) * Number(that.data.detailData[i].number) + Number(that.data.detailData[i].freight)
      }
    }
    console.log()
    that.setData({
      totalMoney: Number(allPrice).toFixed(2)
    })
    console.log('allPrice', that.data.totalMoney)
  },
  // 选中未选中
  sel: function(e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    console.log('i', i)
    let status = `detailData[${i}].status`;
    that.setData({
      [status]: !that.data.detailData[i].status
    })
    console.log(that.data.detailData[i].status)
    // len 用来记录选中的个数， num 用来重新计算总价
    let len = 0,
      num = 0,
      yunjia = 0
    console.log('that.data.detailData', that.data.detailData)
    for (let i in that.data.detailData) {
      if (that.data.detailData[i].status) {
        len = len + 1;
        yunjia = Number(that.data.detailData[i].freight)
      }
      that.setData({
        freight: Number(yunjia)
      })
      console.log('that.data.freight', that.data.freight)
    }
    // 判断选中的个数，和列表总长度对比，若一致，则为全选
    if (len == that.data.detailData.length) {
      that.setData({
        totalStatus: true
      })
    } else {
      that.setData({
        totalStatus: false
      })
    }
    that.totalMoney(i);
  },
  // 添加商品
  increase: function(e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let aa = `detailData[${i}].number`;
    that.setData({
      [aa]: that.data.detailData[i].number + 1
    })
    that.totalMoney();
  },
  // 减少商品
  reduce: function(e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    if (that.data.detailData[i].number > 0) {
      let aa = `detailData[${i}].number`;
      that.setData({
        [aa]: that.data.detailData[i].number - 1
      })
      that.totalMoney();
    }
    console.log(that.data.totalMoney)
  },
  //删除商品
  delate(e) {
    console.log('e', e)
    let that = this;
    let baseUrl = app.globalData.baseURL;
    let index = e.currentTarget.dataset.num;
    console.log('that.data.detailData[index].status', that.data.detailData[index].status)
    // console.log('index', index)
    wx.request({
      url: baseUrl + '/api/Store/RemoveCar',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        Id: that.data.detailData[index].id
      },
      success(res) {
        console.log(res.data.code)
        that.carList();
      }
    })
  },
  // 调用全部购物车的列表
  carList: function() {
    var that = this
    let baseUrl = app.globalData.baseURL;
    let imgUrl = app.globalData.imgUrl;

    wx.request({
      url: baseUrl + '/api/Store/GetCarGoods',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        goodsId: that.data.id,
        number: 1
      },
      success(res) {
        console.log(res.data)
        var detaiList = res.data.data
        if (res.data.code == 200) {
          for (var i = 0; i < detaiList.length; i++) {
            detaiList[i].goodsImg = imgUrl + detaiList[i].goodsImg;
          }
          that.setData({
            detailData: detaiList
          })
        }
      }
    })
  },
  //提交订单
  orderGoods() {
    var that = this
    let baseUrl = app.globalData.baseURL;
    for (var i = 0; i < that.data.detailData.length; i++) {
      if (that.data.detailData[i].status) {
        let goodsChecked = {
          GoodsId: that.data.detailData[i].goodsId,
          number: that.data.detailData[i].number
        }
        that.data.goodsChecked.push(goodsChecked)
      }
    }
    if (that.data.showAddress == 0) {
      wx.showToast({
        title: "请选择地址",
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }
    else if (that.data.goodsChecked.length == 0) {
      wx.showToast({
        title: "至少选择一种商品支付",
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }else{
      console.log(that.data.goodsChecked)
      wx.request({
        url: baseUrl + '/api/UserCenter/SaveOrder',
        method: "POST",
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
        },
        data: {
          GoodsList: that.data.goodsChecked,
          IsShopping: true, //是否来自购物车
          Freight: that.data.freight, //运费总价
          UserAddressId: that.data.province + that.data.city + that.data.area + that.data.address,
          CouponsId: "",
          openId: app.globalData.openId
        },
        success(res) {
          console.log(res);
          wx.requestPayment({
            timeStamp: res.data.data.data.timeStamp,
            nonceStr: res.data.data.data.nonceStr,
            package: res.data.data.data.prepayId,
            signType: 'MD5',
            paySign: res.data.data.data.sign,
            success(res) {
              wx.showToast({
                title: '商品购买成功',
                icon: 'success',
                mask: true,
                duration: 1500
              })
              wx.switchTab({
                url: '/pages/mine/mine'
              })
            },
            fail(res) { 
              wx.showToast({
                title: '商品购买失败',
                icon: 'none',
                mask: true,
                duration: 1500
              })
              wx.switchTab({
                url: '/pages/mine/mine'
              })
            }
          })
        }
      })
    }
  }, //提交订单
  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.carList();
    this.addressList(-1);
  },
  onShow:function(){
    this.carList();
    this.addressList(-1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  // onReachBottom: function() {
  //   this.setData({
  //     page:this.data.page+1
  //   })
  //   this.carList()
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //没有地址时跳转到添加地址页面
  toNewAddress: function() {
    wx.navigateTo({
      url: '/pages/store/address/address'
    })
  },
  // 跳转
  toAddress: function() {
    // 我的收货地址
    wx.navigateTo({
      url: '/pages/store/address/address'
    })
  }
})