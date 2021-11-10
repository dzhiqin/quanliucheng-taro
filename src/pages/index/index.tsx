import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import * as React from 'react'
import BkButton from '@/components/bk-button/bk-button'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.less'

export default function Index() {
  const onSubmit = (e) => {
    console.log('onSubmit',e)
  }
  return (
    <View className='index'>
      <BkButton name='click me!'  setSubmit={onSubmit} theme='danger'></BkButton>
      {/* <BkButton name='click here' icon='wechat.png' setSubmit={this.onSubmit.bind(this)} theme='info'></BkButton> */}
    </View>
  )
}