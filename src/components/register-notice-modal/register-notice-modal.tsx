import * as React from 'react'
import { AtModal,AtModalContent } from 'taro-ui'
import { useState,useEffect } from 'react'
import "taro-ui/dist/style/components/modal.scss";
import { fetchRegisterNotice } from '@/service/api/card-api'
import { View, RichText } from '@tarojs/components'

import './register-notice-modal.less'

export default function RegisterNoticeModal(props: {show: boolean,onConfirm?:Function,onCancel?: Function,children?: any}) {
  const [opened,setOpened] = useState(props.show)
  const [noticeContent,setNoticeContent] = useState()
  const [enable,setEnable] = useState(false)
  const [count,setCount] = useState(3)
  const {onConfirm,onCancel} = props
  const handleClose = () => {
    onCancel()
  }
  const handleCancel = () => {
    setOpened(false)
    onCancel()
  }
  const handleConfirm = () => {
    setOpened(false)
    setEnable(false)
    setCount(3)
    
    onConfirm()
  }
  const countdown = (value:number) => {
    return setTimeout(() => {
      value--
      setCount(value)
      if(value > 0) {
        countdown(value)
      }
    },1000)
  }
  useEffect(() => {
    setOpened(props.show)
    if(props.show){
      countdown(3)
    }
  },[props.show])
  useEffect(() => {
    if(count === 0){
      setEnable(true)
    }
  },[count])
 
  useEffect(() => {
    fetchRegisterNotice().then((res) => {
      if(res.resultCode === 0){
        setNoticeContent(res.data)
      }
    })   
  },[])
  
  return (
    <AtModal
      closeOnClickOverlay={false}
      isOpened={opened}
      onClose={handleClose.bind(this)}
      onCancel={handleCancel.bind(this)}
      onConfirm={handleConfirm.bind(this)}
    >
      <AtModalContent>
        <View className='register-notice'>
          { 
            noticeContent ? 
            <RichText nodes={noticeContent} /> : 
            <View className='notice-modal-content'>加载中……</View>
          }
          <View className={`notice-modal-footer ${enable ? 'enable' : 'disable'}`} onClick={handleConfirm.bind(this)}>
            {enable ? '已阅读并同意' : `阅读${count}秒后同意`}
          </View>
        </View>
      </AtModalContent>
      
    </AtModal>
  )
}