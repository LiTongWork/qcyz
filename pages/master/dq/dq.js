// pages/master/dq/dq.js
const $http = require('../../../utils/config.js');
const dateTimePicker = require('../../../utils/dateTimePicker.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    masterType: '',
    masterTypeId: '',
    content: [],
    itemList: [],
    totalMoney: 0,
    startTime: 1,
    useTime: 1,
    region: {},
    regionStatus: false,
    detailAddress: '',
    tips: '以上不包括打混凝土墙体或梁',//小字注释
    selCouponsId: '',
    remark: '',
    dateTimeArray1: null,
    dateTime1: '',
    startYear: 2019,
    endYear: 2069
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
      [bb]: that.data.content[i].count + 1
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
        [bb]: that.data.content[i].count - 1
      })
    }
    that.totalMoney();
    console.log(that.data.itemList)
  },
  // 总价计算
  totalMoney: function () {
    let that = this;
    let totalMoney = 0;
    console.log(that.data.content)
    if(that.data.content.length > 0) {
      for (let i in that.data.content) {
        let count = that.data.content[i].count;
        let pice = that.data.content[i].pice;
        totalMoney = totalMoney + count * pice;
        // console.log(count, pice,totalMoney)
      }  
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
    this.getList();
    console.log(this.data.masterType)
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
    console.log(app.globalData.openId)
    if (wx.getStorageSync("auth") != '' && wx.getStorageSync('openId') != '' && wx.getStorageSync('loginType') == 6) {
      if (!(that.data.totalMoney > 0)) {
        // 判断价格
        wx.showToast({
          title: '请选择商品',
          icon: 'none',
          mask: true,
          duration: 1500
        })
        return false
      } else if (that.data.masterType != '清洁工') {
        if (!(that.data.startTime > 0)) {
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
        } else if (app.globalData.openId == '') {
          wx.showToast({
            title: 'openId不能为空，重新登录',
            icon: 'none',
            mask: true,
            duration: 1500
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }, 1500)
          return false
        } else {
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
          $http.post('/api/User/WorkOrder', parmas)
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                console.log(res);
                if (res.data) {
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
                } else {
                  wx.showToast({
                    title: '下单成功',
                    icon: 'none',
                    mask: true,
                    duration: 1500
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/mine/mine',
                    })
                  }, 1500)
                }
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
        }

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
      } else if (app.globalData.openId == '') {
        wx.showToast({
          title: 'openId不能为空，重新登录',
          icon: 'none',
          mask: true,
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }, 1500)
        return false
      } else {
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
        $http.post('/api/User/WorkOrder', parmas)
          .then(res => {
            console.log(res)
            if (res.code == 200) {
              // console.log(res);
              if (res.data) {
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.prepayId,
                  signType: 'MD5',
                  paySign: res.data.data.sign,
                  success(res) {
                    // console.log(res);
                    wx.switchTab({
                      url: '/pages/mine/mine'
                    })
                  },
                  fail(res) {
                    console.log(res)
                  }
                })
              } else {
                wx.showToast({
                  title: '下单成功',
                  icon: 'none',
                  mask: true,
                  duration: 1500
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/mine/mine',
                  })
                }, 1500)
              }
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
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }  
  },
  // 获取列表
  getList: function(){
    let that = this;
    that.setData({
      content: [],
      itemList: []
    })
    let params = {
      masterTypeId: that.data.masterTypeId,
      area: that.data.region.value[2],
      city: that.data.region.value[1],
      province: that.data.region.value[0]
    }
    $http.post('/api/Home/TypeItem', params)
      .then(res => {
        console.log(res);
        if (res.code == 200 && res.data.itemList.length > 0){

          that.setData({
            hasContent: true,
            content: res.data.itemList,
            remark: res.data.remark
          })
          console.log(that.data.content)
          // 遍历内容，提取需要的内容
          for (let i in that.data.content) {
            let obj = {
              itemId: that.data.content[i].id,
              number: that.data.content[i].count
            }
            that.data.itemList.push(obj)
          }
          // 初始化价格
          that.totalMoney();
          console.log('成功获取到的list列表',that.data.content)
        } else if (res.code == 200 && res.data.itemList.length == 0) {
          wx.showToast({
            title: '该地区暂无服务',
            icon: 'none',
            mask: true,
            duration: 1500
          })
          return false
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            mask: true,
            duration: 1500
          })
          return false
        }
      })
      .catch(res => {
        console.log(res)
      })

    console.log(that.data.masterType);
    if (that.data.masterType == '清洁工') {
      // 获取完整的年月日 时分秒，以及默认显示的数组
      var obj1 = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear);
      // 精确到分的处理，将数组的秒去掉
      // console.log(obj1)
      var lastArray = obj1.dateTimeArray.pop();
      obj1.dateTimeArray.pop();
      var lastTime = obj1.dateTime.pop();
      obj1.dateTime.pop();
      that.setData({
        dateTimeArray1: obj1.dateTimeArray,
        dateTime1: obj1.dateTime
      });
      that.setData({
        startTime: that.data.dateTimeArray1[0][that.data.dateTime1[0]] + '-' + that.data.dateTimeArray1[1][that.data.dateTime1[1]] + '-' + that.data.dateTimeArray1[2][that.data.dateTime1[2]] + ' ' + that.data.dateTimeArray1[3][that.data.dateTime1[3]]
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
      masterType: options.title,
      masterTypeId: options.type
    })
    console.log(options)
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
    console.log('totalMoney', money)
    if (wx.getStorageSync("auth") != '' && wx.getStorageSync('openId') != '' && wx.getStorageSync('loginType') == 6) {
      wx.navigateTo({
        url: `/pages/mine/coupons/coupons?from=dq&meney=${money}`
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  // 清洁工时间日期选择
  changeDateTime1(e) {
    let that = this;
    that.setData({ dateTime1: e.detail.value });
    that.setData({
      startTime: that.data.dateTimeArray1[0][that.data.dateTime1[0]] + '-' + that.data.dateTimeArray1[1][that.data.dateTime1[1]] + '-' + that.data.dateTimeArray1[2][that.data.dateTime1[2]] + ' ' + that.data.dateTimeArray1[3][that.data.dateTime1[3]]
    })
    // console.log(that.data.startTime,typeof that.data.startTime)
  },
  changeDateTimeColumn1(e) {
    let that = this;
    var arr = that.data.dateTime1, dateArr = that.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    that.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  }
})