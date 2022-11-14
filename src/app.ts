/* eslint-disable react/sort-comp */
import { Component } from 'react'
import { login } from '@/service/api/user-api'
import * as Taro from '@tarojs/taro'
import "taro-ui/dist/style/index.scss"  // 全局引入样式
import './app.less'
import { fetchBranchHospital } from './service/api'
import { CardsHealper } from './utils'
import { CARD_ACTIONS } from './enums'

class App extends Component {
  props: any
  componentDidMount () {}

  onLaunch () {
    // 单页调试时方便使用
    // const token = Taro.getStorageSync('token')
    // if(token) return
    this.checkUpdate()
    Taro.login({
      success: res => {
        let { code } = res
        login({code}).then((result:any) => {
          // console.log('login res',result.data.data.openId)
          if(result.statusCode === 200) {
            const {data: {data}} = result
            Taro.setStorageSync('token', data.token)
            Taro.setStorageSync('openId', data.openId)
            fetchBranchHospital().then(resData => {
              if(resData.data && resData.data.length === 1){
                Taro.setStorageSync('hospitalInfo',resData.data[0])
                CardsHealper.updateAllCards().then(() => Taro.eventCenter.trigger(CARD_ACTIONS.UPDATE_ALL))
              }
            })
          }
        }).catch(() => {
          Taro.showToast({
            title: '获取token失败',
            icon: 'none'
          })
        })
      }
    })
  }

  componentDidHide () {}

  componentDidCatchError () {}
  checkUpdate(){
    if(Taro.canIUse('getUpdateManager')){
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        if(res.hasUpdate){
          updateManager.onUpdateReady(() => {
            Taro.showModal({
              title: '更新提示',
              content: '新版本已经准备好，请您重启小程序同步更新~',
              showCancel: false,
              success: (result) => {
                if(result.confirm){
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(() => {
            Taro.showModal({
              title: '更新提示',
              content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开',
              showCancel: false
            })
          })
        }
      })
    }else{
      Taro.showModal({
        title: '更新提示',
        content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开',
        showCancel: false
      })
    }
  }
  render () {
    return this.props.children
  }
}

export default App
