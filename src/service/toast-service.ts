import * as Taro from '@tarojs/taro'

export const toastService = (props: {title: string,duration?: number,onClose?: Function}) => {
  Taro.showToast({
    icon: 'none',
    title: props.title,
    duration: props.duration || 3000,
    complete: () => {
      if(typeof props.onClose === 'function'){
        setTimeout(() => {
          props.onClose()
        },props.duration || 3000)
      }
    }
  })
}
export const loadingService = (show: boolean, msg?: string) => {
  if(show){
    Taro.showLoading({
      title: msg || '加载中……',
      mask:true
    })
  }else{
    Taro.hideLoading()
  }
}