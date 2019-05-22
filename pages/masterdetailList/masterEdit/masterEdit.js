// pages/masterdetailList/masterEdit/masterEdit.js
const app = getApp();
const carNumber = require('../../../utils/carNumber.js');
const md5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editHeader: '',
    name: '',
    loginPwd: '', //登陆密码
    pwd: '', //支付密码
    regionCode: "", //地址code
    loginName: "", //输入姓名
    loginPhone: "", //输入手机号
    region: "", //输入地址
    regionString: "", //地址的拼接字符串
    bankNumber: "", //输入卡号
    bankName: '',

    loginZheng: "", //输入身份号
    num: '', //银行卡种类的序列
    worker: [], //工种种类
    id: "", //工种类型id
    status: "" //审核的转态
  },
  //银行卡号直接匹配到哪个银行
  getUserIdCardNumber: function(e) {
    var that = this;
    that.setData({
      bankNumber: e.detail.value
    })
    var temp = carNumber.bankCardAttribution(e.detail.value)
    console.log(temp)
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
    } else {
      that.setData({
        cardType: temp.bankName + temp.cardTypeName,
        bankName: temp.bankName,
      })
      console.log(that.data.bankName)
    }
  },
  //输入姓名
  changeName(e) {
    this.setData({
      loginName: e.detail.value
    })
  },
  //输入电话
  changePhone(e) {
    this.setData({
      loginPhone: e.detail.value
    })
  },
  // 支付密码
  changePwd(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  // 登陆密码
  changeLoginPwd(e) {
    this.setData({
      loginPwd: e.detail.value
    })
  },
  //点击的选择的工种
  clickBtn(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index);
    for (var i = 0; i < this.data.worker.length; i++) { //点击出现选中状态
      let group = 'worker[' + i + '].check';
      this.setData({
        [group]: false
      })
    }
    let croup = 'worker[' + index + '].check';
    console.log(croup);
    this.setData({
      [croup]: true,
      id: this.data.worker[index].id
    })
    console.log('id', this.data.id)
  },
  //选择地址
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      region: e.detail.value,
      regionCode: e.detail.code,
      regionString: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    })
  },
  //全部工种的调用
  worker: function() {
    var that = this;
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl + '/api/Register/MasterTypeList',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      success(res) {
        // console.log(res.data);
        var workerList = res.data.data
        that.setData({
          worker: workerList
        })
        console.log('that.data.worker',that.data.worker)
      }
    })
  },
  //保存按钮调用接口
  trueBtn: function() {
    var that = this
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl + '/api/Work/UpdateWork',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      data: {
        masterTypeId: that.data.id,
        name: that.data.loginName,
        nickName: that.data.name,
        address: that.data.regionString,
        province: that.data.region[0],
        city: that.data.region[1],
        area: that.data.region[2],
        bankName: that.data.bankName,
        bankCode: that.data.bankNumber,
        idCard: that.data.loginZheng,
        mobile: that.data.loginPhone,
        headImg: that.data.editHeader,
        payPwd: md5.hexMD5(that.data.pwd),
        loginPwd: md5.hexMD5(that.data.loginPwd)
      },
      success(res) {
        console.log('res.data', res.data)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            mask: true,
            duration: 2000
          })
          that.setData({
            status: 1
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            mask: true,
            duration: 2000
          })
        }
        app.globalData.regionString = that.data.regionString
        console.log('app.globalData.regionString', app.globalData.regionString) //地址全称
      }
    })
  },
  //调取师傅编辑后的个人信息
  editSelf:function(){
    var that = this
    let baseUrl = app.globalData.baseURL;
    wx.request({
      url: baseUrl + '/api/work/MyWorkInfo',
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      success(res) {
        console.log('res.data', res.data)
        that.setData({
          loginName:res.data.data.name,
          loginPhone: res.data.data.mobile,
          id: res.data.data.masterTypeId,
          'region[0]': res.data.data.province,
          'region[1]': res.data.data.city,
          'region[2]': res.data.data.area,
          regionString: res.data.data.province + res.data.data.city + res.data.data.area,
          bankName: res.data.data.bankName,
          bankNumber: res.data.data.bankCode,
          loginZheng: res.data.data.idCard
        })
        console.log('res.data.data.bankCode', res.data.data.bankCode)
        // console.log('that.data.worker', that.data.worker)
        for(var i = 0; i<that.data.worker.length;i++){
          // console.log('that.data.worker[i].id', that.data.worker[i].id)
          if (that.data.worker[i].id==that.data.id){
            var index = i
            console.log('index',index)
            let croup = 'worker[' + index + '].check';
            console.log(croup);
            that.setData({
              [croup]: true
            })
          }
        }
      }
    })
  },
  //输入身份证卡号
  changeZheng(e) {
    this.setData({
      loginZheng: e.detail.value
    })
  },
  //提交审核按钮
  holdBtn() {
    console.log('支付密码', md5.hexMD5(this.data.pwd))
    if (this.data.status == 1) {
      wx.showToast({
        title: '正在审核中，请不要重复提交审核',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (this.data.loginName == '') {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (!app.phoneReg(this.data.loginPhone)) {
      wx.showToast({
        title: '手机号码不正确',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (this.data.address == '') {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (this.data.id == '') {
      wx.showToast({
        title: '请选择工种',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (this.data.bankNumber == '') {
      wx.showToast({
        title: '请输入正确的银行卡号',
        icon: 'none',
        mask: true,
        duration: 1500
      })
      return false
    } else if (!carNumber.verifyIDCard(this.data.loginZheng)) {
      return wx.showToast({
        title: "请输入正确的身份号",
        icon: "none",
        mask: true,
        duration: 1500
      });
    } else if (this.data.pwd == '') {
      return wx.showToast({
        title: "请输入支付密码",
        icon: "none",
        mask: true,
        duration: 1500
      });
    } else if (this.data.loginPwd == '') {
      return wx.showToast({
        title: "请输入登录密码",
        icon: "none",
        mask: true,
        duration: 1500
      });
    }
    this.trueBtn() //调用保存接口
  },
  onLoad: function(options) {
    this.setData({
      status: options.status
    })
    console.log('status', options.status)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    this.worker() //调用工种
    this.editSelf();
    this.setData({
      editHeader: app.globalData.userInfo.avatarUrl,
      name: app.globalData.userInfo.nickName
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})