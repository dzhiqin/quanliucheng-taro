import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import crossPng from '@/images/icons/cross.png'
import cardsHealper from '@/utils/cards-healper'
import './cards-list.less'

export default function Card(props: any) {

  const onClickIcon = (e) => {
    console.log('click icon',e);
    e.stopPropagation()
  }
  const onClickCard = (e) => {
    if(props.action === 'switchCard'){
      cardsHealper.setDefault(props.card.id)
      Taro.navigateBack()
    }else{
      Taro.navigateTo({url: `/pages/card-detail/card-detail?card=${JSON.stringify(props.card)}`})
    }
  }
  return (
    <View className='card' style={props.style? props.style : ''} onClick={onClickCard} >
      <View className='card-header'>
        <View className='card-header-organ'>广东省卫生健康委员会</View>
        <View className='card-header-wrap'>
          <Image className='card-header-icon' src={crossPng}></Image>
          <View className='card-header-title'>电子健康卡</View>
        </View>
        
      </View>
      <View className='card-content'>
        <View className='card-content-info'>
          <View className='card-content-name'>{props.card.name}</View>
          <View className='card-content-id'>{props.card.idNOHide}</View>
        </View>
        <View>
          {/* <Image src={crossPng} style='width: 100rpx;height:100rpx' onClick={onClickIcon} /> */}
        </View>
      </View>
      <View className='card-footer'>中华人民共和国国家卫生健康委员会监制</View>
    </View>
  )
}