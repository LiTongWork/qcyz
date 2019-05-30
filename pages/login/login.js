// pages/login/login.js
const $http = require('../../utils/config.js');
const md5 = require('../../utils/md5.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: true,
    phone: '',
    code: '',
    pwd: '',
    getCode: '获取验证码',
    getCodeClicked: false,
    countdown: 60
  },
  // 登录注册切换
  tabHandle: function () {
    this.setData({
      status: !this.data.status
    })
    if (this.data.status) {
      wx.setNavigationBarTitle({
        title: '登录'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '注册'
      })
    }
  },
  // 登录
  login: function (e) {
    let that = this;
    let phone = that.data.phone;
    let pwd = that.data.pwd;
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
    }else if (pwd == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    }else if (!app.pwdReg(pwd)) {
      wx.showToast({
        title: '密码不正确',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else {
      // 获取openid
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            // console.log(res.code)
            let params = {
              'userName': phone,
              'password': md5.hexMD5(pwd),
              'wechatcode': res.code
            }
            $http.post('/api/Login/UserLogin', params)
              .then(res => {
                console.log('then', res);
                if (res.code == 200) {
                  wx.showToast({
                    title: '登录成功',
                    icon: 'none',
                    mask: true,
                    duration: 1500
                  })
                  wx.setStorageSync('auth', res.data.token);
                  wx.setStorageSync('loginType', res.data.loginType);
                  wx.setStorageSync('openId', res.data.openId)
                  app.globalData.openId = wx.getStorageSync('openId')
                  setTimeout(function () {
                    if (res.data.loginType == 6) {
                      wx.switchTab({
                        url: '/pages/index/index',
                      })
                    } else if (res.data.loginType == 5) {
                      wx.reLaunch({
                        url: '/pages/masterCenter/masterCenter',
                      })
                    }
                  }, 1500)
                } else {
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
                console.log('catch', res);
              })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  // 注册
  register: function (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let phone = that.data.phone;
    let code = that.data.code;
    let pwd = that.data.pwd;
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
    } else if (pwd == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (!app.pwdReg(pwd)) {
      wx.showToast({
        title: '密码不正确',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (code == '') {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else {
      let params = {};
      // 工人注册
      if (type == 1) {
        params = {
          'userName': phone,
          'password': md5.hexMD5(pwd),
          'authCode': code,
          'loginType': 5
        }
      }
      // 用户注册
      if (type == 2) {
        params = {
          'userName': phone,
          'password': md5.hexMD5(pwd),
          'authCode': code,
          'loginType': 6
        }      
      }
      $http.post('/api/Register/UserRegister', params)
        .then(res => {
          console.log('then', res)
          if (res.code == 200) {
            wx.showToast({
              title: '注册成功',
              icon: 'none',
              mask: true,
              duration: 1500
            })
            setTimeout(function () {
              that.setData({
                status: true
              })
            }, 1500)
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
          console.log('catch', res);
        })

    }

  },

  // 获取验证码
  getCode: function () {
    let that = this;
    let phone = that.data.phone;
    if (phone == ''){
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
    }else {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 判断登录还是注册，显示不同的title
    if(options.type == 'register') {
      that.setData({
        status: false
      })
      wx.setNavigationBarTitle({
        title: '注册'
      })
    } else {
      that.setData({
        status: true
      })
      wx.setNavigationBarTitle({
        title: '登录'
      })
    }
    // // 查看是否授权
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success(res) {
    //           // console.log(res)
    //           app.globalData.userInfo = JSON.parse(res.rawData);
    //           if (!options.from) {
    //             if (wx.getStorageSync("auth") != '' && wx.getStorageSync('openId') != '') {
    //               console.log(wx.getStorageSync('auth'))
    //               console.log(wx.getStorageSync('openId'))
    //               app.globalData.openId = wx.getStorageSync('openId');
    //               if (wx.getStorageSync("loginType") == 6) {
    //                 wx.switchTab({
    //                   url: '/pages/index/index',
    //                 })
    //               } else if (wx.getStorageSync("loginType") == 5) {
    //                 wx.redirectTo({
    //                   url: '/pages/masterCenter/masterCenter',
    //                 })
    //               }
    //             }
    //           }
    //         },
    //         fail(res){
    //           console.log(res)
    //         }
    //       })
    //     } else {
    //       // console.log(res)
    //       wx.redirectTo({
    //         url: '/pages/authorization/authorization',
    //       })
    //     }
    //   },
    //   fail(res){
    //     console.log(res)
    //   }
    // })
  },
  // 跳转
  toForget: function () {
    wx.navigateTo({
      url: '/pages/forget/forget',
    })
  }
})