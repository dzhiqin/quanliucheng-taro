import * as Taro from '@tarojs/taro'
import { modalService, toastService } from '../toast-service'
import { custom } from '@/custom/index'
import { compareVersion,WEAPP,ALIPAYAPP } from '@/utils/tools'

type subscribeServiceRes =  {result: boolean, msg: string, data?: any }
export const TaroGetSubscribeSettings = (...ids) => {  
  if(ALIPAYAPP) return ({result: true})
  return new Promise(resolve => {
    Taro.getSetting({
      withSubscriptions: true,
      success: res => {
        console.log(res);
        
        const itemSettings = res.subscriptionsSetting?.itemSettings || {}
        const mainSwitch = res.subscriptionsSetting?.mainSwitch
        const keys = Object.keys(itemSettings)
        if(keys.length === 0){
          resolve({result:true, data: {},mainSwitch})
        }else{
          resolve({result: true, data: itemSettings,mainSwitch})
        }
      },
      fail: err => {
        resolve({result: false, data: err})
      }
    })
  })
}
export const AlipaySubscribeService = (...tempIds) =>{
  if(WEAPP) return {result: true}
  tempIds = tempIds.filter(i => i && i.trim())
  if(tempIds.length === 0) {
    return {result: false,msg: '没有订阅任何模板消息'}
  }else if(tempIds.length > 3) {
    return {result: false, msg: '一次最多订阅3条消息'}
  }
  return new Promise((resolve) => {
    my.requestSubscribeMessage({
      entityIds: tempIds,
      success: res => {
        if(res.success){
          if(res.result.unsubscribedEntityIds.length){
            resolve({result: false, msg:'没有全部订阅',data: {subscribedEntityIds: res.result.unsubscribedEntityIds}})
          }else{
            resolve({result: true, msg: '订阅成功'})
          }
        }else{
          resolve({result: false, msg: '您已取消'})
        }
      },
      fail: err => {
        resolve({result: false, msg: err.errorMessage})
      }
    })
  })
}
export const TaroSubscribeService = (...tempIds) => {
  if(custom.isPrivate) return {result: true}
  if(ALIPAYAPP) return {result: true}
  if(!tempIds || tempIds.length === 0) {
    return {result: false,msg: '没有订阅任何模板消息'}
  }else if(tempIds.length > 3) {
    return {result: false, msg: '一次最多订阅3条消息'}
  }
  const version = Taro.getSystemInfoSync().SDKVersion
  if(compareVersion('2.8.3',version) >= 0){
    // 低版本基础库2.4.4~2.8.3，仅支持传入一个 tmplId
    tempIds = tempIds.splice(0,1)
  }
  return new Promise<subscribeServiceRes>((resolve) => {
    Taro.requestSubscribeMessage({
      tmplIds: tempIds,
      success: (res) => {
        const valid = Object.values(res).every(i => i !== 'reject')
        if(valid){
          resolve({result: true,data: res, msg: 'success'})
        }else{
          resolve({result: false,msg: '有消息未订阅'})
        }
      },
      fail: err=>{
        resolve({result: false,data: err, msg: err.errMsg})
      }
    })
  })
}

export const getSetting = () => {
  Taro.getSetting({
    success: (res) => {
      console.log('getsetting:',res)
    }
  })
}
export const TaroAliPayment = (data:{tradeNo: string}) => {
  return new Promise((resolve) => {
    my.tradePay({
      tradeNO: data.tradeNo,
      success: res => {
        resolve({success: true,data: JSON.stringify(res)})
      },
      fail: err => {
        resolve({success: false,data: JSON.stringify(err)})
      }
    })
  })
  
}
interface paymentParams {
  nonceStr: string,
  package: string,
  paySign: string,
  timeStamp: string,
  signType?: 'HMAC-SHA256' | 'MD5',
}
export const TaroRequestPayment = (params: paymentParams) => {
  return new Promise((resolve,reject) => {
    Taro.requestPayment({
      ...params,
      fail: (err) => {reject({result: 'fail',data:err})},
      success: (res) => {resolve({result: 'success', data: res})}
    })
  })
}
export const TaroGetLocation = (option:{type: 'gcj02' | 'wgs84'}) => {
  return new Promise((resolve,reject) => {
    try{
      Taro.getLocation({
        type: option.type,
        isHighAccuracy: true,
        success: (res) => {resolve(res)},
        fail: (err) => {
          if(err.errMsg==='getLocation:fail auth deny'){
            Taro.showModal({
              content: '检测到您没有打开小程序的定位授权，是否手动打开？',
              confirmText: '确认',
              cancelText: '取消',
              success: result => {
                if(result.confirm){
                  Taro.openSetting({
                    success: openRes => {}
                  })
                }else{
                  Taro.navigateBack()
                }
              }
            })
          }else if(err.errMsg==='getLocation:fail:system permission denied' || err.errMsg==='getLocation:fail:ERROR_NOCELL&WIFI_LOCATIONSWITCHOFF') {
            Taro.showModal({
              // wechat version >= 8.0.16
              content: '检测到您没有开启系统定位权限，请先更新微信到最新版本，再按以下步骤手动打开。\n返回微信-[我]-[设置]-[个人信息与权限]-[系统权限管理]-[前往系统设置]-[应用权限]-打开位置信息权限',
              confirmText: '确认',
              cancelText: '取消',
              success: result => {
                Taro.navigateBack()
              }
            })
          }else if(err.errMsg === 'getLocation:fail:timeout'){
            Taro.showModal({
              content: '定位超时'
            })
          }else if(err.errMsg === 'getLocation:fail:ERROR_NETWORK'){
            Taro.showModal({
              title: '网络异常'
            })
          }else{
            Taro.showModal({
              title: err.errMsg
            })
          }
          reject(err.errMsg)
        }
      })
    }catch(err){
      
      reject(err)
    }
    
  })
}
export const TaroNavToZhongXun = (execRoom) => {
  // 跳转到众寻导航小程序
  Taro.navigateToMiniProgram({
    appId: 'wx8735a8a39cf58b5e',
    path: `pages/index?id=t6KedvW21W&appKey=xnyabeAZzP&poi=${execRoom}`,
    success(res) {
      // 打开成功
      console.log(res);
    }
  })
}
export const TaroNavToYiBao = (callback) => {
  // 跳转到医保小程序
  if(WEAPP){
    Taro.navigateToMiniProgram({
      appId: 'wxe1022cca111d18be',
      path: 'pages/cert/bind/bind?from=AAHTx-oeOuLWz2nBYKez06kN&cityid=440100',
      success(res){
        console.log(res)
        callback()
      }
    })
  }
  if(ALIPAYAPP){
    Taro.navigateToMiniProgram({
      appId: '77700284',
      path: 'pages/medical/index/',
      success: () => {
        callback()
      }
    })
  }
}
export const TaroNavToMiniProgram = (data:{appId: string, path: string, envVersion?: 'trial' | 'release' | 'develop'}) => {
  return new Promise((resolve,reject)=>{
    Taro.navigateToMiniProgram({
      appId:data.appId,
      path:data.path,
      envVersion: data.envVersion || 'release',
      success: (res) => {resolve(res)},
      complete: () => {}
    }).catch(err => {
      toastService({title: '您已取消跳转'})
      reject('failed')
    })
  })
}
export const TaroRequestAuth = (authScope: string) => {
  Taro.getSetting({
    success: res => {
      // console.log('get setting',res);
      if(Object.keys(res.authSetting).includes(authScope) && !res.authSetting[authScope]){
        // 第一次请求授权是首次进入页面时自动发起
        // 如果用户有拒绝过授权才进行第二次请求
        Taro.authorize({
          scope: authScope,
          success: authRes => {
            console.log('授权成功',authRes);
          },
          fail: () => {
            Taro.showModal({
              content: '检测到您没有打开小程序的相关授权，是否手动打开？',
              confirmText: '确认',
              cancelText: '取消',
              success: result => {
                if(result.confirm){
                  Taro.openSetting({
                    success: openRes => {}
                  })
                }else{
                  Taro.navigateBack()
                }
              }
            })
          }
        })
      }
    }
  })
}

const subscribeOneByOne = async (...ids) => {
  if(ids.length === 0) return 
  const id = ids[0]
  let subsRes = await TaroSubscribeService(id)
  if(subsRes.result){
    if(ids.length > 1){
      modalService({
        content: '需要您继续授权',
        success: () => {
          ids.shift()
          subscribeOneByOne(...ids)
        }
      })
    }else{
      Taro.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}
const handleSubscribe = async () => {
  const sysInfo = Taro.getSystemInfoSync()
  const version = sysInfo.SDKVersion
  if(compareVersion('2.8.3',version) >= 0){
    // 低版本基础库2.4.4~2.8.3，仅支持传入一个 tmplId
    subscribeOneByOne(
      custom.subscribes.visitReminder,
      custom.subscribes.pendingPayReminder,
      custom.subscribes.checkReminder,
    )
  }else{
    const subsRes = await TaroSubscribeService(
      custom.subscribes.visitReminder,
      custom.subscribes.pendingPayReminder,
      custom.subscribes.checkReminder
    )
    if(!subsRes.result){
      // setShowNotice(true)
    }else{
      Taro.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}

export const TaroRemindAuthModal = async() => {
  const res:any = await TaroGetSubscribeSettings()
  if(!res.result) return
  const settings = res.data
  const isAcceptAll = Object.values(settings).every(i => i !== 'reject')
  if(!isAcceptAll || !res.mainSwitch){
    modalService({content: '您有消息未接收，请到[通知管理]中手动开启接收',success: () => {
      Taro.openSetting({
        success: result => {
        }
      })
    }})
    return
  }
  let acceptedIds = []
  for(let i in settings){
    if(settings[i] === 'accept'){
      acceptedIds.push(i)
    }
  }
  console.log('acceptedIds',acceptedIds);
  // 公立医院默认订阅3条长期消息
  if(acceptedIds.length <= 0 && !custom.isPrivate){
    Taro.showModal({
      content: '请先进行绑卡/授权',
      confirmText: '确认',
      showCancel:false,
      success: () => {
        handleSubscribe()
      },
      fail: err => {
        modalService({title: '订阅失败',content: JSON.stringify(err), success: () => Taro.navigateTo({url: '/pages/login/login'})})
      }
    })
  }
}
export const TaroNavigateService = (pack: string,page?: string,params?: string,env?:boolean,) => {
  let busy
  return (() => {
    if(busy) return
    let url
    if(pack && !page){
      url = pack
    }else{
      if(pack === 'main'){
        pack = ''
      }
      if(env){
        const envVersion = process.env.TARO_ENV
        if(envVersion !== 'weapp'){
          page = page + '-' +envVersion
        }
      }
      url = ['/pages',pack,page,page].filter(i => i).join('/')
      params && (url = url + '?'+params)
    }
    Taro.navigateTo({
      url,
      complete: () => {
        busy = false
      }
    })
  })()
}
