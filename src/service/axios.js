/*
 * @Descripttion:
 * @version:
 * @Author: huangyueshi
 * @Date: 2020-07-20 12:04:59
 * @LastEditors: huangyueshi
 * @LastEditTime: 2020-07-21 15:14:30
 */
import axios from 'axios'
import store from './../store/index'
var qs = require('qs')

class HTTP {
  // 公开函数
  // eslint-disable-next-line no-unused-vars
  request ({
    url,
    data = {},
    method = 'GET'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }
  // http请求函数封装
  // 把resolve，reject传入请求中（必填参数必须在可选参数之前）
  // eslint-disable-next-line no-unused-vars
  _request (url, resolve, reject, data = {}, method = 'get') {
    /**
       * url ：请求路径 —— 由配置文件中config的域名路径 与 传入参数params中的接口路径相结合
       * data：请求参数 —— 调用传入参数params中的data数据
       * method：请求类型 —— 调用传入参数params中的method数据，默认为GET
       * header：请求头
       * success：请求成功的回调函数 —— 返回码为2**时，则把请求结果传入resolve中
       *          否则就调用reject，关闭请求流程, 然后调用 _show_error 内部函数做出提醒,
       * fail：请求失败时的回调函数（常用于网络超时）
       * */
    store.commit('updateLoadingStatus', { isLoading: true }) // 设置全局loading状态
    axios({
      url: url,
      data: method === 'post' || method === 'put' ? qs.stringify(data) : null,
      params: method === 'get' || method === 'delete' ? qs.stringify(data) : null,
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      responseType: 'json',
      baseURL: ''
    })
      .then(res => {
        this._successCallback(res, resolve, reject)
      })
      // eslint-disable-next-line handle-callback-err
      .catch(err => {
        store.commit('updateLoadingStatus', { isLoading: false })
        reject(err) // 调用reject，关闭请求流程
      })
  };

  // 请求成功的回调函数
  // eslint-disable-next-line no-unused-vars
  _successCallback (res, resolve, reject) {
    const statusCode = res.status // http返回状态码
    store.commit('updateLoadingStatus', { isLoading: false }) // 设置全局loading状态
    if (String(statusCode).startsWith('2')) {
      resolve(res.data) // 若请求成功，则把请求结果传入resolve中
    } else {
      reject(res.data) // 调用reject，关闭请求流程
      this._handleError(statusCode) // 调用异常处理函数，展示错误码指定的错误提示
    }
  }
}

// 返回在vue模板中的调用接口
export default HTTP
