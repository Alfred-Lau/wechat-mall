// pages/user/user.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo:userInfo
        })
      },
      error: () => {

      }
    })
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
  /* 
    按钮登录
   */
  onTapLogin: function () {
    this.doQcloudLogin({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      },
      error:()=>{
        
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
    qcloud.setLoginUrl(config.service.loginUrl)
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