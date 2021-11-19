import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import subscribeNoticeImg from '@/images/subscribe_notice.png'

import './subscribe-notice.less'

export default function SubscribeNotice(props: any) {
  if(props.show) {
    return (
      <View className='subscribe-notice'>
        <Image src={subscribeNoticeImg}></Image>
      </View>
    )
  }else{
    return (null)
  }
}