// pages/forget/forget.js
const $http = require('../../utils/config.js');
const md5 = require('../../utils/md5.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    pwd: '',
    getCode: '获取验证码',
    getCodeClicked: false,
    countdown: 60
  },


  // 获取验证码
  getCode: function () {
    let that = this;
    let phone = that.data.phone;
    if (phone == '') {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (!app.phoneReg(phone)) {
      wx.showToast({
        title: '手机号码不正确',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else {
      let params = {
        "userName": phone
      }
      $http.post('/api/Register/SendAuthCode', params)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            wx.showToast({
              title: res.message,
              icon: 'none',
              mask: true,
              duration: 1500
            })
            that.setData({
              getCodeClicked: true
            })
            var timer = setInterval(function () {
              console.log(that.data.countdown)
              if (that.data.countdown > 1) {
                that.setData({
                  countdown: that.data.countdown - 1
                })
                that.setData({
                  getCode: `${that.data.countdown}s后重新获取`,
                  getCodeClicked: true
                })
              } else {
                console.log(that.data.countdown)
                clearInterval(timer);
                that.setData({
                  getCode: `获取验证码`,
                  getCodeClicked: false,
                  countdown: 60
                })
              }

            }, 1000)

          } else {
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

  // 输入手机号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  // 输入验证码
  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    });
  },
  // 输入密码
  pwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    });
  },
  // 修改
  sub: function (){
    let that = this;
    let phone = that.data.phone;
    let pwd = that.data.pwd;
    let code = that.data.code;
    let params = {
      'userName': phone,
      'password': md5.hexMD5(pwd),
      'authCode': code
    }
    $http.post('/api/Register/ForgetPwd', params)
    .then(res => {
      console.log(res);
      wx.showToast({
        title: res.message,
        icon: 'none',
        mask: true,
        duration: 1500
      })
      if (res.code == 200) {
        setTimeout(function(){
          wx.redirectTo({
            url: '/pages/login/login',
          })
        },1500)
      }
    })
    .catch(res => {
      console.log(Res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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
    // wx.setStorageSync('countdown', this.data.countdown)
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