import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import subscribeNoticeImg from '@/images/subscribe_notice.png'

import './subscribe-notice.less'

export default function SubscribeNotice(props: {show: boolean}) {
  const [show,setShow] = useState(false)
  useEffect(() => {
    setShow(props.show)
  },[props.show])
  if(show) {
    return (
      <View className='subscribe-notice'>
        <Image src={subscribeNoticeImg} className='subscribe-notice-image'></Image>
      </View>
    )
  }else{
    return (null)
  }
}