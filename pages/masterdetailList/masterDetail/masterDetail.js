// pages/masterdetailList/masterDetail/masterDetail.js
const $http = require('../../../utils/config.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [], //项目列表
    itemList: [], //全部的数据
    trueMoney: "", //总数
    datailShow: "工人自带工具",
    kaiTime: "",
    yongTime: "",
    worker: '7d648f65-8d73-431e-8b8b-095e7ecfa134', //维修工id
    id: '',
    masterTypeId: '', //用户id
    state: '', //判断是从哪里点击过来了，1订单大厅，2已接单，3在执行，6已完成
    onloadPic: "", //上传的图片显示
    arr: []
  },
  //调列表的接口数据
  detail: function () {
    var that = this;
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl + '/api/Work/TaskDetails',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        id: that.data.id
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          that.setData({
            detailList: res.data.data.itemList,
            itemList: res.data.data,
            trueMoney: res.data.data.payMoney,
            kaiTime: res.data.data.startTime,
            yongTime: res.data.data.useTime,
            province: res.data.data.province,
            city: res.data.data.city,
            area: res.data.data.area,
            headerAd: res.data.data.address,
            headerPhone: res.data.data.mobile,
            headerTime: app.changeDate(res.data.data.createTime),
            remark: res.data.data.remark,
            arr: res.data.data.executeImgs ? res.data.data.executeImgs.split(',') : []
          })

        }
      }
    })
  },
  // 抢单
  orderDan(e) {
    app.changStatus(this.data.id, 2);
    this.setData({
      state: 2
    })
  },
  // 保存图片
  sub: function (){
    let that = this;
    console.log(that.data.id)
    console.log(that.data.arr.join(','));
    let params = {
      id: that.data.id,
      executeImgs: that.data.arr.join(',')
    }
    if (that.data.arr.length > 0) {
      $http.post('/api/Order/UpdateExecuteImgs', params)
      .then(res => {
        console.log(res)
        wx.showToast({
          title: res.message,
          icon: 'none',
          mask: true,
          duration: 1500
        })
        return false
      })
      .catch(res => {
        console.log(res)
      })
    }else {
      wx.showToast({
        title: '请选择图片',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    }

  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    this.setData({
      masterTypeId: options.masterTypeId,
      id: options.id,
      state: options.state
    })
    console.log(options.id, options.state, options.masterTypeId)
    this.detail();
  },
  goLoad(e) {
    let imgUrl = app.globalData.baseURL + '/api/Upload/UploadImg'
    var that = this
    let arr = [];
    wx.chooseImage({
      count: 3, //最多可以选择的图片总数  
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
            url: imgUrl,
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
              arr.push(app.globalData.imgUrl+data.data.fileName);
              that.setData({
                arr:arr
              })
              console.log(arr)
              // that.data.arr.push(data.data.fileName);
              console.log('that.data.arr', that.data.arr)
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
    })
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