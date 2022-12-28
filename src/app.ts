/* eslint-disable react/sort-comp */
import { Component } from 'react'
import { login } from '@/service/api/user-api'
import * as Taro from '@tarojs/taro'
import "taro-ui/dist/style/index.scss"  // 全局引入样式
import './app.less'
import { fetchBranchHospital } from './service/api'
import { CardsHealper } from './utils'
import { CARD_ACTIONS } from './enums'
import { modalService } from './service/toast-service'

class App extends Component {
  props: any
  buildTarget: string
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props) {
    super(props)
    this.buildTarget = process.env.TARO_ENV
  }
  componentDidMount () {}

  async onLaunch () {
    // 单页调试时方便使用
    // const token = Taro.getStorageSync('token')
    // if(token) return
    // console.log('onLaunch')
    if(this.buildTarget === 'weapp'){
      console.log('sdk version',Taro.getSystemInfoSync().SDKVersion)
      console.log('platform',Taro.getSystemInfoSync().platform)
    }
    if(this.buildTarget === 'alipay'){
      my.getRunScene({
        success: res => {
          if(res.envVersion !== 'release'){
            modalService({
              content: 'SDKVersion:'+my.SDKVersion+' platform:'+Taro.getSystemInfoSync().platform
            })
          }
        }
      })
    }
    
    this.checkUpdate()
    const res:any = await this.handleGetCode()
    if(res.success){
      login({code: res.data}).then((result:any) => {
        // console.log('login res',result)
        if(result.statusCode === 200) {
          if(result.data.resultCode !== 0){
            throw result.data.message
          }
          const {data: {data}} = result
          Taro.setStorageSync('token', data.token)
          Taro.setStorageSync('openId', data.openId)
          fetchBranchHospital(true).then(resData => {
            if(resData.resultCode !== 0){
              modalService({title: '获取分院信息出错',content: resData.message})
            }
            if(resData.data && resData.data.length === 1){
              Taro.setStorageSync('hospitalInfo',resData.data[0])
            }
            Taro.setStorageSync('branches',resData.data)
            CardsHealper.updateAllCards().then(() => Taro.eventCenter.trigger(CARD_ACTIONS.UPDATE_ALL))
          })
        }
      }).catch((err) => {
        modalService({
          title: '获取token失败',
          content: JSON.stringify(err)
        })
      })
    }
  }
  handleGetCode() {
    return new Promise((resolve) => {
      if(process.env.TARO_ENV === 'weapp'){
        Taro.login({
          success: res => {
            const {code} = res
            resolve({success: true,data: code})
          }
        })
      }
      if(process.env.TARO_ENV === 'alipay'){
        my.getAuthCode({
          success: res => {
            const {authCode} = res
            resolve({success: true, data: authCode})
          }
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
