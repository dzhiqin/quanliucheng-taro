import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtModal,AtModalContent,AtModalAction } from 'taro-ui'
import { useState, useEffect } from 'react'

export default function SimpleModal(props:{
  show: boolean,
  msg: string,
  onCancel?: Function,
  onConfirm?: Function
}) {
  const [show,setShow] = useState(props.show)
  const {onCancel,onConfirm} = props
  useEffect(() => {
    setShow(props.show)
  },[props.show])
  const handleClose = () => {
    console.log('close');
  }
  const handleCancel = () => {
    setShow(false)
    if(typeof onCancel === 'function'){
      onCancel()
    }
  }
  const handleConfirm = async () => {
    setShow(false)
    if(typeof onConfirm === 'function'){
      onConfirm()
    }
  }
  return (
    <View>
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
            {props.msg}
          </View>
        </AtModalContent>
        <AtModalAction> 
          {
            props.onCancel &&
            <Button onClick={handleCancel}>取消</Button> 
          }
          <Button onClick={handleConfirm}>确定</Button> 
        </AtModalAction>
      </AtModal>
    </View>
  )
}