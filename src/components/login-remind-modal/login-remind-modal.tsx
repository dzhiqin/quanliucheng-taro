import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtModal,AtModalContent,AtModalAction } from 'taro-ui'
import { useState, useEffect } from 'react'
import { longtermTemplates } from '@/utils/templateId'
import { subscribeService } from '@/service/api'
import SubscribeNotice from '../subscribe-notice/subscribe-notice'

export default function LoginRemindModal(props:{show: boolean}) {
  const [show,setShow] = useState(props.show)
  const [showNotice,setShowNotice] = useState(false)
  useEffect(() => {
    setShow(props.show)
  },[props.show])
  const handleClose = () => {
    console.log('close');
  }
  const handleCancel = () => {
    Taro.switchTab({url: '/pages/index/index'}) 
  }
  const handleConfirm = async () => {
    const tempIds = longtermTemplates.treatmentAndPayment()
    const subsRes = await subscribeService(tempIds)
    if(!subsRes.result){
      setShowNotice(true)
    }else{
      Taro.navigateTo({url: '/pages/login/login'})
    }
  }
  return (
    <View>
      <SubscribeNotice show={showNotice} />
      <AtModal
        closeOnClickOverlay={false}
        isOpened={show}
        cancelText='取消'
        confirmText='确认'
        onClose={handleClose}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      >
        <AtModalContent>
            <View style='font-size: 36rpx;text-align:center;margin-top:50rpx;font-weight: 500'>
              请先登录
            </View>
        </AtModalContent>
        <AtModalAction> 
          <Button onClick={handleCancel}>取消</Button> 
          <Button onClick={handleConfirm}>确定</Button> 
        </AtModalAction>
      </AtModal>
    </View>
  )
}