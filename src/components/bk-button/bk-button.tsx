import { useState, useEffect } from "react";
import * as React from 'react'
import "taro-ui/dist/style/components/icon.scss";
import { Image, View } from "@tarojs/components"
// import imageUrl from '@/images/wechat.png'
import { AtIcon } from 'taro-ui'

import './bk-button.less'


export default function BkButton(props){
  const {onClick} = props
  const [icon] = useState(props.icon || "")
  const [disabled,setDisabled] = useState(props.disabled || false)
  const [loading,setLoading] = useState(props.loading)
  const getIcon = () => {
    return `../../images/${icon}`
  }
  useEffect(() => {
    setLoading(props.loading)
  },[props.loading])
  useEffect(() => {
    setDisabled(props.disabled)
  },[props.disabled])
  const handleClick = () => {
    if(typeof onClick === 'undefined' || loading || disabled) return
    onClick()
  }
  return (
    <View style={props.style} className={`button ${props.theme || 'primary'} ${disabled ? 'disabled' : ''}`} onClick={handleClick}>
      { icon !== "" && <Image className='button-icon' src={getIcon()}></Image> }
      { loading && <AtIcon value='loading-2' size='20' color='#ffffff'></AtIcon> }
      { props.title || 'click' }
    </View>
  )
} 