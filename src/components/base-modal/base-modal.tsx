import * as React from 'react'
import { Button } from '@tarojs/components'
import { AtModal,AtModalContent,AtModalHeader,AtModalAction } from 'taro-ui'
import { useState,useEffect } from 'react'
// import "taro-ui/dist/style/components/modal.scss";
interface ModalParams {
  show: boolean,
  confirm?:Function,
  cancel?: Function,
  children?: any,
  closeOutside?: boolean,
  custom?: boolean,
  title?: string
}
export default function BaseModal(props: ModalParams) {
  const [opened,setOpened] = useState(props.show)
  const {confirm,cancel} = props
  const handleClose = () => {
    cancel()
  }
  const handleCancel = () => {
    setOpened(false)
    cancel()
  }
  const handleConfirm = () => {
    setOpened(false)
    confirm()
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
          <Button onClick={handleCancel}>取消</Button> 
          <Button onClick={handleConfirm}>确定</Button> 
        </AtModalAction>
      }
    </AtModal>
  )
}