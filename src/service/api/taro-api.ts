import * as Taro from '@tarojs/taro'

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

export const getSetting = () => {
  Taro.getSetting({
    success: (res) => {
      console.log('getsetting:',res)
    }
  })
}

