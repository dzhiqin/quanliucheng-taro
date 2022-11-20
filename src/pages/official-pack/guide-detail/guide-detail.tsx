import * as Taro from '@tarojs/taro'
import * as React from 'react'
import {View,RichText} from '@tarojs/components'
import BkLoading from '@/components/bk-loading/bk-loading'
import parse from 'mini-html-parser2'

export default function GuideDetail() {
  const value = Taro.getStorageSync('content')
  let content = ''
  if(value){
    content = JSON.parse(value)
    parse(content,(err,nodes) => {
      if(!err){
        content = nodes
      }
    })
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