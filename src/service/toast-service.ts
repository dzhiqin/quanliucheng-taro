import * as Taro from '@tarojs/taro'

export const toastService = (
  props: {
    title: string,
    duration?: number,
    onClose?: Function, 
    icon?: 'none' | 'success' | 'loading'
  }) => {
  Taro.showToast({
    icon: props.icon || 'none',
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
export const modalService = (props: {
  cancelText?: string,
  confirmText?: string,
  showCancel?: boolean,
  title?:string,
  content: string,
  success?: any
}) => {
  const {cancelText = '取消',confirmText = '确认',showCancel,title = '提示',content,success} = props
  Taro.showModal({
    cancelText: cancelText,
    confirmText: confirmText,
    showCancel,
    title,
    content,
    success
  })
}