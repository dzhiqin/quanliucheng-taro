import { useState, useEffect } from "react";
import * as React from 'react'
import { Image, View } from "@tarojs/components"
import { AtIcon } from 'taro-ui'
import './bk-button.less'

/**
 * 
 * @param theme: 'primary' | 'info' | 'cancel'
 * @param disable: boolean
 * @param icon: string
 * @param loading: boolean
 * @param title: string
 * @param onClick: function
 * @returns 
 */
export default function BkButton(props: {
  theme?: 'primary' | 'info' | 'cancel' | 'danger',
  disabled?: boolean,
  icon?: string,
  loading?: boolean,
  title?: string,
  onClick?: any,
  style?: string
}){
  const {onClick} = props
  const [disabled,setDisabled] = useState(props.disabled || false)
  const [loading,setLoading] = useState(props.loading)
  const getIcon = () => {
    const img = require(`../../images/${props.icon}`)
    return img
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
      { props.icon && <Image className='button-icon' src={getIcon()}></Image> }
      { loading && <AtIcon value='loading-2' size='20' color='#ffffff'></AtIcon> }
      { props.title || 'click' }
    </View>
  )
} 