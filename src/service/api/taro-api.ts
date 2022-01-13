import { longtermTemplates } from '@/utils/templateId'
import * as Taro from '@tarojs/taro'
import { toastService } from '../toast-service'

export const taroSubscribeMessage = (tempIds, successCallback, failCallback) => {
  if(!tempIds || tempIds.length === 0) {
    return failCallback('没有订阅任何模板消息')
  }else if(tempIds.length > 3) {
    return failCallback('一次最多订阅3条消息')
  }else{
    Taro.requestSubscribeMessage({
      tmplIds: tempIds,
      success: (res) =>{
        console.log('reqeust subscribe :',res)
        if(Object.values(res).includes('reject')){
          failCallback('未授权')
        }else{
          successCallback()
        }
      },
      fail: res => {
        failCallback(res)
      }
    })
    
  }
}
type subscribeServiceRes =  {result: boolean, msg: string }
export const subscribeService = (tempIds) => {
  if(!tempIds || tempIds.length === 0) {
    return {result: false,msg: '没有订阅任何模板消息'}
  }else if(tempIds.length > 3) {
    return {result: false, msg: '一次最多订阅3条消息'}
  }
  return new Promise<subscribeServiceRes>((resolve,reject) => {
    Taro.requestSubscribeMessage({
      tmplIds: tempIds,
      success: (res) =>{
        // console.log('reqeust subscribe :',res)
        if(Object.values(res).includes('reject')){
          resolve({result: false, msg: '未授权'})
        }else{
          resolve({result: true, msg: 'ok'})
        }
      },
      fail: res => {
        reject({result: false, msg: '授权失败:'+res})
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
export const TaroGetLocation = () => {
  return new Promise((resolve,reject) => {
    try{
      Taro.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        success: (res) => {resolve(res)},
        fail: (res) => {reject(res)}
      })
    }catch(e){
      reject(e)
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
  const tempIds = longtermTemplates.treatmentAndPayment()
  const subsRes = await subscribeService(tempIds)
  if(subsRes.result){
    Taro.navigateTo({url: '/pages/login/login'})
  }else{
    toastService({title: '由于您没有选择接受订阅消息，导致无法正常使用本小程序，请重新登录'})
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