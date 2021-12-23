import * as React from 'react'
import { View, Image } from '@tarojs/components'
import successPng from '@/images/icons/success_circle.png'
import failPng from '@/images/icons/fail_circle.png'
import './result-page.less'

export default function ResultPage(props:{
  title?: string,
  type: 'success' | 'fail' | '',
  remark?: string,
  children?: any
}){
  const successMsg = props.title || '缴费成功'
  const failMsg = props.title || '缴费失败'
  return(
    <View className='result-page'>
      <View className='result-page-header'>
        {
          props.type === 'success' 
          ?
          <Image src={successPng} className='result-page-image' />
          :
          <Image src={failPng} className='result-page-image' />
        }
        <View className={`${props.type === 'success' ? 'result-page-title-success' : 'result-page-title-fail'}`}>{props.type === 'success' ? successMsg : failMsg}</View>
        {
          props.remark &&
          <View className='result-page-remark'>{props.remark}</View>
        }
      </View>
      {props.children}
    </View>
  )
}