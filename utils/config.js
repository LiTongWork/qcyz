
// 引入全局变量
const app = getApp();

function postData(url, data) {
  let that = this;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.baseURL + url,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "auth": wx.getStorageSync("auth") ? wx.getStorageSync("auth") : ''
      },
      success: function (res) {
        resolve(res.data);
      },
      fail: function (res) {
        reject(res);
      },
    })
  });
}

module.exports = {
  post: postData
}

// function ajax(Type, params, url, successData, errorData, completeData) {
//   //设置默认数据传数格式
//   var methonType = "application/json";
//   //访问的主域名
//   var https = app.globalData.baseURL+'/api'
//   //判断请求方式
//   if (Type === 'PUT') {
//     var p = Object.keys(params).map(function(key) {
//       return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
//     }).join("&");
//     url += '?' + p;
//     params = {}
//   }
//   if (Type == "POST") {
//     methonType = "application/json"
//   }
//   //开始正式请求
//   wx.request({
//     url: https + url,
//     method: Type,
//     header: {
//       'content-type': methonType,
//       'auth': wx.getStorageSync("dataToken") ? wx.getStorageSync("dataToken") : '' // 登录接口的返回值
//     },
//     data: params,
//     //成功回调
//     success: (res) => {
//       successData(res)
//     },
//     //错误回调
//     error(res) {
//       //检测是否传参errorData，如果有则执行回调errorData(res)
//       if (errorData) {
//         errorData(res)
//       }
//     },
//     //检测是否传参completeData，如果有则执行回调completeData(res)
//     complete(res) {
//       if (completeData) {
//         completeData(res)
//       }
//     }
//   })
// }
// module.exports = {
//   push:ajax
// }

