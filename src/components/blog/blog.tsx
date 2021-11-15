import * as React from 'react'
import { View, Image } from '@tarojs/components'

import './blog.less';

export default function Blog(props: any) {
  return (
    <View className='blog'>
      <Image src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/card_back.png' className='blog-banner'></Image>
      <View className='blog-info'>
        <View className='blog-info-title'>这是很长很长的标题这是很长很长的标题这是很长很长的标题</View>
        <View className='blog-info-desc'>这是很长很长的内容内容内容这是很长很长的内容内容内容这是很长很长的内容内容内容</View>
        <View className='blog-info-date'>2021-11-20</View>
      </View>
    </View>
  )
}