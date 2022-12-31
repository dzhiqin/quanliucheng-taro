import { View,Image } from '@tarojs/components'
import { useState } from 'react'
import * as React from 'react'
import './function-boxes.less'
import { custom } from '@/custom/index'
import GreenTextPng from '@/images/icons/green-energy-text.png'

export default function BoxItem(props) {
  const {onClick} = props
  const [item] = useState(props.item || {})
  const onItemClick = () => {
    onClick(item)
  }
  return (
    <View className='box-item' onClick={onItemClick}>
      {
        process.env.TARO_ENV === 'alipay' && custom.feat.greenTree && item.tag === 'green' &&
        <Image src={GreenTextPng} className='box-item-tag'></Image>
      }
      <Image src={item.icon} className='box-item-image'></Image>
      <View className='box-item-title'>{item.title}</View>
      <View className='box-item-desc'>{item.desc}</View>
    </View>
  )
}
