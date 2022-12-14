import * as React from 'react'
import { View } from '@tarojs/components'
import { useState } from 'react'
import { AtIcon } from 'taro-ui'
import './bk-title.less'

export default function BkTitle(props: {
  title?: string,
  more?: boolean,
  onClickMore?: any,
  style?: string
}) {
  const [title] = useState(props.title || '')
  const [more] = useState(props.more || false)
  const {onClickMore} = props
  return (
    <View className='bk-title' style={props.style ? props.style : ''}>
      <View className='bk-title-devider'></View>
      <View className='bk-title-name'>{title}</View>
      {
        more 
        ? 
        <View className='bk-title-more' onClick={() => onClickMore()}>
          <text className='bk-title-more-txt'>更多</text>
          <AtIcon value='chevron-right' size='20' color='#D6D6D6'></AtIcon>
        </View> 
        : ''}
    </View>
  )
}