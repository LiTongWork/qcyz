//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    // hasAuthorization: false,
    userInfo: {},
    // baseURL: 'http://47.94.172.208:1009',
    baseURL: 'https://xwxapi.itknow.cn',
    imgUrl: 'http://47.94.172.208:1009/File/ShowImg?fileName=',
    regionString: null,
    appid: 'wx7c61a7b28c2f5b54',
    appSecret: '97df9132df8506bc25c9caaebc6916c2',
    openId: null,
    selCouponsId: ''
  },
  phoneReg: function (phone) {
    return /^1[34578]\d{9}$/.test(phone)
  },
  pwdReg: function (pwd) {
    return /^[a-zA-Z0-9]{6,18}$/.test(pwd)
  },
  getRandom: function () {
    let num = '';
    for (let i = 0; i < 7; i++) {
      num += Math.floor(Math.random() * 10);
    }
    return num;
  },
  uploadImg: function (url,count) {
    let arr = [];
    wx.chooseImage({
      count: count,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths.length)
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: url,
            filePath: tempFilePaths[i],
            name: 'fileName',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              arr.push(data.data.fileName);
              console.log(arr)
              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },

            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }

      }
    });
    // console.log(arr)
  },
// 更新施工状态=师傅端
  changStatus: function(id, status) {
    var that = this
    let baseUrl = that.globalData.baseURL;
    console.log('baseUrl', baseUrl);
    wx.request({
      url: baseUrl + '/api/Work/UpdateWorkStatus',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        id: id,
        status: status
      },
      success(res) {
        console.log("施工状态已更新")
      }
    })
  },
  changeDate: function (deta) {
    var result = deta.replace("T", " ")
    return result
    console.log('deta', result)
  }

})