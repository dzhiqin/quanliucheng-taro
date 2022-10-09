import * as Taro from '@tarojs/taro'
import { toastService } from '../toast-service'
import { custom } from '@/custom/index'

type subscribeServiceRes =  {result: boolean, msg: string, data?: any }
export const TaroSubscribeService = (...tempIds) => {
  if(custom.isPrivate) return {result: true}
  if(!tempIds || tempIds.length === 0) {
    return {result: false,msg: '没有订阅任何模板消息'}
  }else if(tempIds.length > 3) {
    return {result: false, msg: '一次最多订阅3条消息'}
  }
  // console.log('tempids',tempIds)
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
          }else if(err.errMsg==='getLocation:fail:system permission denied') {
            Taro.showModal({
              content: '检测到您没有开启系统定位权限，请按以下步骤手动打开。\n返回微信-[我]-[设置]-[个人信息与权限]-[系统权限管理]-[前往系统设置]-[应用权限]-打开位置信息权限',
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
  Taro.navigateToMiniProgram({
    appId: 'wxe1022cca111d18be',
    path: 'pages/cert/bind/bind?from=AAHTx-oeOuLWz2nBYKez06kN&cityid=440100',
    success(res){
      console.log(res)
      callback()
    }
  })
}
export const TaroNavToMiniProgram = (data:{appId: string, path: string}) => {
  return new Promise((resolve,reject)=>{
    Taro.navigateToMiniProgram({
      appId:data.appId,
      path:data.path,
      success: (res) => {resolve(res)},
      fail: (err) => {reject(err)},
      complete: () => {}
    })
  })
}
export const TaroRequestAuth = (authScope: string) => {
  Taro.getSetting({
    success: res => {
      console.log('get setting',res);
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
const handleConfirm = async () => {
  const subsRes = await TaroSubscribeService(
    custom.longtermSubscribe.pendingPayReminder,
    custom.longtermSubscribe.visitReminder,
    custom.longtermSubscribe.checkReminder
  )
  if(subsRes.result){
    Taro.navigateTo({url: '/pages/login/login'})
  }else{
    toastService({title: '由于您没有选择接受订阅消息，导致无法正常使用本小程序，请重新登录'})
    TaroRemindLoginModal()
  }
}
export const TaroRemindLoginModal = () => {
  Taro.showModal({
    content: '请先进行登录',
    confirmText: '确认',
    showCancel:false,
    success: result => {
      if(result.confirm){
        handleConfirm()
      }else{
        Taro.switchTab({url: '/pages/index/index'})
      }
    }
  })
}