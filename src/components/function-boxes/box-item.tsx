import { View,Image } from '@tarojs/components'
import { useState } from 'react'
import * as React from 'react'

import './box-item.less'

export default function BoxItem(props) {
  
  const [item] = useState(props.item || {})
  const onClick = () => {
    console.log('on click',item.event)

  }
  return (
    <View className='box-item' onClick={onClick}>
      <Image src={item.icon} className='box-item-image'></Image>
      <View className='box-item-title'>{item.title}</View>
      <View className='box-item-desc'>{item.desc}</View>
    </View>
  )
}
