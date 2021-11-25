import { View,Image } from '@tarojs/components'
import { useState } from 'react'
import * as React from 'react'
import './function-boxes.less'

export default function BoxItem(props) {
  const {onClick} = props
  const [item] = useState(props.item || {})
  const onItemClick = () => {
    onClick(item.event)
  }
  return (
    <View className='box-item' onClick={onItemClick}>
      <Image src={item.icon} className='box-item-image'></Image>
      <View className='box-item-title'>{item.title}</View>
      <View className='box-item-desc'>{item.desc}</View>
    </View>
  )
}
