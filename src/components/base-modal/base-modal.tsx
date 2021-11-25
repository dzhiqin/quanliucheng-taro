import * as React from 'react'
import { AtModal,AtModalContent } from 'taro-ui'
import { useState,useEffect } from 'react'
import "taro-ui/dist/style/components/modal.scss";

export default function BaseModal(props: {show: boolean,confirm?:Function,cancel?: Function,children?: any,closeOutside?: boolean}) {
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
      <AtModalContent>
        {props.children}
      </AtModalContent>
      
    </AtModal>
  )
}