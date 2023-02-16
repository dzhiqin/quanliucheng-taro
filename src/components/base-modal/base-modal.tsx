import * as React from 'react'
import { Button } from '@tarojs/components'
import { AtModal,AtModalContent,AtModalHeader,AtModalAction } from 'taro-ui'
import { useState,useEffect } from 'react'

interface ModalParams {
  show: boolean,
  confirm?:Function,
  cancel?: Function,
  confirmText?: string,
  cancelText?: string,
  children?: any,
  closeOutside?: boolean,
  custom?: boolean,
  title?: string,
  hideCancel?: boolean
}
export default function BaseModal(props: ModalParams) {
  const [opened,setOpened] = useState(props.show)
  const {confirm,cancel} = props
  const handleClose = (e) => {
    setOpened(false)
    if(typeof cancel === 'function'){
      cancel()
    }
  }
  const handleCancel = () => {
    setOpened(false)
    if(typeof cancel === 'function'){
      cancel()
    }
  }
  const handleConfirm = () => {
    setOpened(false)
    if(typeof confirm === 'function'){
      confirm()
    }
  }
  useEffect(() => {
    setOpened(props.show)
  },[props.show])
  return (
    <AtModal
      closeOnClickOverlay={props.closeOutside}
      isOpened={opened}
      cancelText='取消'
      confirmText='确认'
      onClose={handleClose.bind(this)}
      onCancel={handleCancel.bind(this)}
      onConfirm={handleConfirm.bind(this)}
    >
      {
        !props.custom && 
        <AtModalHeader>{props.title || '提示'}</AtModalHeader>
      }
      <AtModalContent>
        {props.children}
      </AtModalContent>
      {
        !props.custom && 
        <AtModalAction> 
          {
            !props.hideCancel && 
            <Button onClick={handleCancel}>{props.cancelText || '取消'}</Button> 
          }
          
          <Button onClick={handleConfirm}>{props.confirmText || '确定'}</Button> 
        </AtModalAction>
      }
    </AtModal>
  )
}