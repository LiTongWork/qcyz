// pages/mine/comment/comment.js
const $http = require('../../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    url: app.globalData.baseURL + '/api/Upload/UploadImg',
    indentId: '',
    masterId: '',
    headImg: '/static/img/defaultPhoto.png',
    title: '',
    rate: 0,
    text: '',
    picList: [],
    isReview: false,
    type: '',
    from: ''
  },

  // 点击星星评价
  clickStar: function (e) {
    let that = this;
    console.log(typeof that.data.isReview)
    if (that.data.isReview == 'false'){
      that.setData({
        rate: e.currentTarget.dataset.id
      })
      console.log(that.data.rate)
    }
    
  },
  // 评价输入
  textInput: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  // 拍照选择图片
  uploadImage: function () {
    let that = this;
    let url = that.data.url;
    let arr = [];
    if (that.data.isReview == 'false'){
      wx.chooseImage({
        count: 3,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
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
                that.setData({
                  picList: arr
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
        },
      })
    }
  },
  // 发表评价
  sub: function () {
    let that = this;
    if (that.data.rate == 0) {
      wx.showToast({
        title: '请选择评分',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (that.data.text == ''){
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else if (that.data.text.length < 5) {
      wx.showToast({
        title: '评价内容最少五个字',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false;
    } else {
      console.log(';;')
      if (that.data.from == 'work') {
        let params = {
          workIndentId: that.data.indentId,
          content: that.data.text,
          imgs: that.data.picList.join(','),
          star: that.data.rate,
          masterId: that.data.masterId
        }
        console.log(params);
        $http.post('/api/UserCenter/AddWorkReview', params)
          .then(res => {
            console.log(res)
            wx.showToast({
              title: res.message,
              icon: 'none',
              mask: true,
              duration: 1500
            })
            if (res.code == 200) {
              wx.switchTab({
                url: `/pages/mine/mine`
              })
            }
          })
          .catch(res => {
            console.log(res)
          })
      } else if (that.data.from == 'store') {
        let params = {
          indentId: that.data.indentId,
          content: that.data.text,
          imgs: that.data.picList.join(','),
          star: that.data.rate
        }
        console.log(params);
        $http.post('/api/UserCenter/AddReview', params)
          .then(res => {
            console.log(res)
            wx.showToast({
              title: res.message,
              icon: 'none',
              mask: true,
              duration: 1500
            })
            if (res.code == 200) {
              wx.switchTab({
                url: `/pages/mine/mine`
              })
            }
          })
          .catch(res => {
            console.log(res)
          })

      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    let type = options.type ? options.type : '';
    that.setData({
      indentId: id, // 设置订单的id
      type: type,
      from: options.from
    })
    if(options.from == 'work') {
      // 施工评价
      $http.post('/api/Work/WorkIndentDetails', { id: id })
        .then(res => {
          console.log(res.data);
          if(res.code == 200){
            if (!res.data.name){
              res.data.name = ''
            }
            that.setData({
              headImg: res.data.headImg ? res.data.headImg : '/static/img/defaultPhoto.png',
              title: res.data.name + `(${type})`,
              masterId: res.data.masterId,
              isReview: res.data.isReview.toString()
            })
            if (that.data.isReview != 'false') {
              $http.post('/api/Home/WorkReviewObject', { WorkIndentId: that.data.indentId})
              .then(res => {
                console.log(res);
                if(res.code == 200){
                  that.setData({
                    rate: res.data.star,
                    picList: res.data.imgs.split(','),
                    text: res.data.content
                  })
                }
              })
              .catch(res => {
                console.log(res)
              })
            }
          }else {
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
    }else if(options.from == 'store') {
      console.log(options.isreview)
      that.setData({
        isReview: options.isreview
      })
      // 商品评价
      if (that.data.isReview != 'false') {
        $http.post('/api/UserCenter/ReviewDetails', { indentId: id })
          .then(res => {
            console.log(res);
            if (res.code == 200) {
              that.setData({
                rate: res.data.star,
                picList: res.data.imgs.split(','),
                text: res.data.content
              })
            }
          })
          .catch(res => {
            console.log(res)
          })
        }

      }
  
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