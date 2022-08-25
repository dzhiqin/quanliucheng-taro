import * as Taro from '@tarojs/taro'
import * as React from 'react'
import {View,RichText} from '@tarojs/components'
import BkLoading from '@/components/bk-loading/bk-loading'

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
        <BkLoading msg='正在完善……' />
      }
    </View>
  )
}