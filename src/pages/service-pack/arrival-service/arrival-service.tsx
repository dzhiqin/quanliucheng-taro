import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import manWaitingPng from '@/images/icons/man_time.png'
import arrivalPng from '@/images/icons/note_tick.png'
import { custom } from '@/custom/index'
import './arrival-service.less'
import { TaroNavigateService } from '@/service/api'

export default function BindingCard() {
  return(
    <View className='arrival-service'>
      <View className='flex-between'>
        {
          custom.feat.arrivalService.arrival && 
          <View className='arrival-service-item info-bg' onClick={() => {TaroNavigateService('service-pack','arrival') }}>
            <Image src={arrivalPng} className='arrival-service-image' />
            <View className='arrival-service-title'>
              自助报到
            </View>
          </View>
        }
        {
          custom.feat.arrivalService.waitingList && 
          <View className='arrival-service-item primary-bg' onClick={() => {TaroNavigateService('service-pack','waiting-list')}}>
            <Image src={manWaitingPng} className='arrival-service-image' />
            <View className='arrival-service-title'>
              候诊队列
            </View>
          </View>
        }
        
      </View>
    </View>
  )
}