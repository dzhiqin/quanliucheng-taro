import * as React from 'react'
import { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import './subscribe-notice.less'
import { getImageSrc } from '@/utils/image-src'

export default function SubscribeNotice(props: {show: boolean}) {
  const [show,setShow] = useState(false)
  useEffect(() => {
    setShow(props.show)
  },[props.show])
  if(show) {
    return (
      <View className='subscribe-notice'>
        <Image src={getImageSrc('subscribe_notice.png')} className='subscribe-notice-image'></Image>
      </View>
    )
  }else{
    return (null)
  }
}