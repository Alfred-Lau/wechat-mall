//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

let userInfo

App({
  /**
 * 页面的初始数据
 */
  data: {
    locationAuthType: UNPROMPTED
  },
  onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
  /* 检查登录状态 */
  checkSession: function ({ success, error }) {
    wx.checkSession({
      success: () => {
        this.getUserInfo({ success, error })
      },
      fail: () => {
        error && error()
      }
    })
  },
    /* 授权登录提示 */
  login({ success, error }) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === false) {
           this.data.locationAuthType=UNAUTHORIZED
          // 已拒绝授权
          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: false
          })
        } else {
            this.data.locationAuthType= AUTHORIZED
          this.doQcloudLogin({ success, error })
        }
      }
    })
  },
  doQcloudLogin: function ({ success, error }) {
    qcloud.login({
      success: result => {
        if (result) {
          let userInfo = result
          success && success({
            userInfo
          })
        } else {
          this.getUserInfo({ success, error })
        }
      },
      fail: result => {
        error && error()
      }
    })
  },
  getUserInfo: function ({ success, error }) {
    qcloud.request({
      login: true,
      url: config.service.requestUrl,
      success: result => {
        let data = result.data
        if (!data.code) {
          let userInfo = data.data
          success && success({ userInfo })
        } else {
          error && error()
        }
      },
      fail: () => {
        console.log('fail')
        error && error()
      }
    })
  },
})