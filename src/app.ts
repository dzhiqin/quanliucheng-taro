/* eslint-disable react/sort-comp */
import { Component } from 'react'
import { login } from '@/service/api/user-api'
import * as Taro from '@tarojs/taro'
import "taro-ui/dist/style/index.scss"  // 全局引入样式
import './app.less'
import { fetchBranchHospital, fetchInHospCards } from './service/api'
import { CardsHealper,setGlobalData,WEAPP,ALIPAYAPP } from './utils'
import { CARD_ACTIONS } from './enums'
import { modalService } from './service/toast-service'
import monitor from '@/utils/alipayLogger'
import { custom } from './custom'

class App extends Component {
  props: any
  buildTarget: string
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props) {
    super(props)
    this.buildTarget = process.env.TARO_ENV
  }
  componentDidMount () {}
  componentDidShow(options) {
    console.log('app on show',options.scene);
    setGlobalData('scene',options.scene)
    if(options.scene === 1038){
      setGlobalData('authCode',options.referrerInfo?.extraData?.authCode)
    }
  }
  async onLaunch (options) {
    // 单页调试时方便使用
    // const token = Taro.getStorageSync('token')
    // if(token) return
    // console.log('onLaunch')
    if(this.buildTarget === 'weapp'){
      console.log('sdk version',Taro.getSystemInfoSync().SDKVersion)
      console.log('platform',Taro.getSystemInfoSync().platform)
      // 开发版develop；体验版trial；正式版release
      Taro.setStorageSync('envVersion',__wxConfig.envVersion)
    }
    if(this.buildTarget === 'alipay'){
      my.getRunScene({
        success: res => {
          Taro.setStorageSync('envVersion',res.envVersion)
          // modalService({
          //   content: 'SDKVersion:'+my.SDKVersion+' platform:'+Taro.getSystemInfoSync().platform+' envVersion:'+res.envVersion
          // })
          // 开发版develop；体验版trial；正式版release;灰度版gray
        }
      })
      // 接入光华平台监控
      if(custom.feat.guangHuaMonitor.enable){
        monitor.init({
          pid: custom.feat.guangHuaMonitor.pid,      // TODO,
          options: options,
          sample: 1,
          autoReportApi: true,
          // autoReportApi: false,
          autoReportPage: false,
          // autoReportPage: false,
          // Http请求返回数据中状态码字段名称
          code: ["code"],
          // Http返回数据中的error message字段名称
          msg: ["msg"],
          miniVersion: custom.feat.guangHuaMonitor.miniVersion
        });
      }
      
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
            if(custom.feat.inHospCard){
              fetchInHospCards().then(cardsRes => {
                if(cardsRes.resultCode === 0){
                  cardsRes.data && Taro.setStorageSync('hospCard',cardsRes.data.find(i => i.isDefault))
                  !cardsRes.data && Taro.setStorageSync('hospCard','')
                  CardsHealper.updateAllCards().then(() => Taro.eventCenter.trigger(CARD_ACTIONS.UPDATE_ALL))  
                }else{
                  if(cardsRes.message === '暂无数据') {
                    CardsHealper.updateAllCards().then(() => Taro.eventCenter.trigger(CARD_ACTIONS.UPDATE_ALL))  
                  }else{
                    modalService({content: cardsRes.message})
                  }
                }
                
              })
            }else{
              CardsHealper.updateAllCards().then(() => Taro.eventCenter.trigger(CARD_ACTIONS.UPDATE_ALL))
            }
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
      if(WEAPP){
        Taro.login({
          success: res => {
            const {code} = res
            resolve({success: true,data: code})
          }
        })
      }
      if(ALIPAYAPP){
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
