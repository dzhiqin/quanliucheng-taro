import * as path from 'path'
import { useState, useEffect } from "react";
import * as React from 'react'
import { AtButton, AtIcon } from "taro-ui";
import "taro-ui/dist/style/components/icon.scss";
import { Image, View } from "@tarojs/components"
import imageUrl from '@/images/wechat.png'
import { useReady } from '@tarojs/taro';
import './bk-button.less'


export default function BkButton(props){
  const [name, setName] = useState(props.name || "click")
  const {setSubmit} = props
  const [icon, setIcon] = useState(props.icon || "")
  const [theme,setTheme] = useState(props.theme || "primary")
  const getIcon = () => {
    return `../../images/${icon}`
  }
  
  const getName = () => {
    return name
  }
  useReady(() => {
    console.log('ready')
  })
  return (
    <View className={`button ${theme}`} onClick={() => {setSubmit()}}>
      { icon !== ""? <Image className='button-icon' src={getIcon()}></Image> : null}
    {name}
    </View>
  )
} 