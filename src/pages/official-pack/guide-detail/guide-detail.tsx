import * as Taro from '@tarojs/taro'
import * as React from 'react'
import {View,RichText} from '@tarojs/components'
import BkNone from '@/components/bk-none/bk-none'

export default function GuideDetail() {
  const value = Taro.getStorageSync('content')
  let content = ''
  if(value){
    content = JSON.parse(value)
  }
  return(
    <View style='padding: 40rpx'>
      {
        content !== ''
        ?
        <RichText nodes={content}></RichText>
        :
        <BkNone msg='正在完善……' />
      }
    </View>
  )
}