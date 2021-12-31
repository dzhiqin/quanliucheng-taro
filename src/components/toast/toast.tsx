import * as React from 'react'
import { View } from '@tarojs/components'
import { AtToast } from 'taro-ui'
import { useState, useEffect } from 'react'

export default function Toast(props) {
  const [isOpen,setIsOpen] = useState(false)
  useEffect(() => {
    setIsOpen(props.isOpen)
  },[props.isOpen])
  return (
    <AtToast text={props.text || ''} status={props.status} isOpened={isOpen} duration={props.duration || 3000} hasMask={!!props.hasMask}></AtToast>
  )
}