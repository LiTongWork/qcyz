// pages/mine/edit/edit.js
const $http = require('../../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.baseURL + '/api/Upload/UploadImg',
    imgUrl: app.globalData.imgUrl,
    avatar: '',
    nickName: '',
    name: '',
    mobile: '',
    tempFilePaths: []
  },
  chooseImg: function () {
    let that = this;
    let count = 1;
    let url = that.data.url;
    wx.chooseImage({
      count: count,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0, arr = [];
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
              that.setData({
                tempFilePaths: arr
              })
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
  },
  nickNameInput: function (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  sub: function () {
    let that = this;
    let headImg = that.data.avatar;
    let nickName = that.data.nickName;
    let name = that.data.name;
    let mobile = that.data.mobile;
    if (name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (mobile == '') {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (!app.phoneReg(mobile)) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else {
      let parmas = {
        headImg: headImg,
        nickName: nickName,
        name: name,
        mobile: mobile
      }
      $http.post('/api/User/UpdateUser', parmas)
      .then(res => {
        console.log(res);
        wx.showToast({
          title: res.message,
          icon: 'none',
          mask: true,
          duration: 1500
        })
        setTimeout(function(){
          wx.navigateBack()
        },1500)
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
    // console.log(app.globalData.userInfo);
    that.setData({
      avatar: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    })
    // 获取个人信息
    $http.post('/api/User/MyLoginInfo',{})
    .then(res => {
      console.log(res);
      if (res.code == 200) {
        that.setData({
          name: res.data.name,
          mobile: res.data.mobile
        })
      }
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