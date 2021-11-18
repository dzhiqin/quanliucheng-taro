import { useState } from "react";
import * as React from 'react'
import "taro-ui/dist/style/components/icon.scss";
import { Image, View } from "@tarojs/components"
// import imageUrl from '@/images/wechat.png'

import './bk-button.less'


export default function BkButton(props){
  const [name] = useState(props.name || "click")
  const {onClick} = props
  const [icon] = useState(props.icon || "")
  const [theme] = useState(props.theme || "primary")
  const [disabled] = useState(props.disabled || false)
  const [style] = useState(props.style || '')
  const getIcon = () => {
    return `../../images/${icon}`
  }
 
  return (
    <View style={style} className={`button ${theme} ${disabled ? 'disabled' : ''}`} onClick={() => {onClick()}}>
      { icon !== ""? <Image className='button-icon' src={getIcon()}></Image> : null}
    {name}
    </View>
  )
} 