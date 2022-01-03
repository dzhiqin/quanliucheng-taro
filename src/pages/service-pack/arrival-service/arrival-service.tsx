import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import manWaitingPng from '@/images/icons/man_time.png'
import arrivalPng from '@/images/icons/note_tick.png'
import './arrival-service.less'

export default function BindingCard() {
  return(
    <View className='arrival-service'>
      <View className='flex-between'>
        <View className='arrival-service-item info-bg' onClick={() => {Taro.navigateTo({url: '/pages/service-pack/arrival/arrival'})}}>
          <Image src={arrivalPng} className='arrival-service-image' />
          <View className='arrival-service-title'>
            自助报到
          </View>
        </View>
        <View className='arrival-service-item primary-bg' onClick={() => {Taro.navigateTo({url: '/pages/service-pack/waiting-list/waiting-list'})}}>
          <Image src={manWaitingPng} className='arrival-service-image' />
          <View className='arrival-service-title'>
            候诊队列
          </View>
        </View>
      </View>
    </View>
  )
}