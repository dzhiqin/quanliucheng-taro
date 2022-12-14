import * as React from 'react'
import { AtModal,AtModalContent } from 'taro-ui'
import { useState,useEffect } from 'react'
import { fetchRegisterNotice } from '@/service/api/card-api'
import { View, RichText, ScrollView } from '@tarojs/components'
import parse from 'mini-html-parser2';
import './register-notice-modal.less'

export default function RegisterNoticeModal(props: 
  {
    show: boolean,
    onConfirm?:Function,
    onCancel?: Function,
    children?: any
  }) {
  const [opened,setOpened] = useState(props.show)
  const [noticeContent,setNoticeContent] = useState(undefined)
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
  const countdown = React.useCallback((value:number) => {
    return setTimeout(() => {
      value--
      setCount(value)
      if(value > 0) {
        countdown(value)
      }
    },1000)
  },[])
  
  useEffect(() => {
    setOpened(props.show)
    if(props.show){
      countdown(3)
    }
    fetchRegisterNotice().then((res) => {
      if(res.resultCode === 0){
        const notices = res.data
        const noticeItem = notices.find(item => item.typeStr === '预约挂号须知')
        if(noticeItem) {
          parse(noticeItem.content, (err, nodes) => {
            if (!err) {
              setNoticeContent(nodes)
            }
          })
          
        }
      }
    }) 
  },[props.show,countdown])
  useEffect(() => {
    if(count === 0){
      setEnable(true)
    }
  },[count])
  
  return (
    <AtModal
      closeOnClickOverlay={false}
      isOpened={opened}
      onClose={handleClose.bind(this)}
      onCancel={handleCancel.bind(this)}
      onConfirm={handleConfirm.bind(this)}
    >
      <AtModalContent>
        <ScrollView className='register-notice' scrollY>
          <View className='notice-modal-title'>挂号须知</View>
          <View className='notice-modal-content'>
            {
              noticeContent ? 
              <RichText nodes={noticeContent} className='notice-modal-content' /> : 
              <View>暂无内容</View>
            }
          </View>
          <View className={`notice-modal-footer ${enable ? 'enable' : 'disable'}`} onClick={handleConfirm.bind(this)}>
            {enable ? '已阅读并同意' : `阅读${count}秒后同意`}
          </View>
        </ScrollView>
      </AtModalContent>
      
    </AtModal>
  )
}