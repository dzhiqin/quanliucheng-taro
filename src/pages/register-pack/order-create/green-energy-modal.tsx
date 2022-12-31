import * as React from 'react'
import BaseModal from '@/components/base-modal/base-modal'
import { useState } from 'react'
import { View,Image } from '@tarojs/components'
import GreenEnergyBanner from '@/images/green-energy-banner.png'
import './order-create.less'

export default function GreenEnergyModal(
  props: {
    show: boolean,
    onCancel: Function
  }) {
  const [isOpen,setOpen] = useState(props.show)
  
  React.useEffect(() => {
    setOpen(props.show)
  },[props.show])
  const handleClick = () => {
    if(typeof props.onCancel === 'function'){
      props.onCancel()
    }
  }
  return(
    <BaseModal custom show={isOpen} >
      <View className='energy-modal'>
        <Image src={GreenEnergyBanner} className='energy-modal-banner' />
        
        <View className='energy-modal-title'>预约挂号、查报告得绿色能量</View>
        <View style='padding: 20rpx'>
          <View className='energy-modal-item'>
            <text className='point'></text>
            <text>完成预约挂号得绿色能量277g/笔，每月上限5笔(取消挂号失效)</text>
          </View>
          <View className='energy-modal-item'>
            <text className='point'></text>
            <text>完成报告查询得绿色能量2g/笔，每月上限10次</text>
          </View>
          <View className='energy-modal-item'>
            <text className='point'></text>
            <text>得到的绿色能量可以前往【蚂蚁森林】用来种树，改善我们的环境</text>
          </View>
        </View>
      </View>
      <View className='energy-modal-footer' onClick={handleClick}>知道了</View>
    </BaseModal>
  )
}