import * as Taro from '@tarojs/taro'

export const toastService = (props: {title: string,duration?: number,onClose?: Function}) => {
  Taro.showToast({
    icon: 'none',
    title: props.title,
    duration: props.duration || 2000,
    complete: () => {
      if(typeof props.onClose === 'function'){
        setTimeout(() => {
          props.onClose()
        },props.duration || 2000)
      }
    }
  })
}