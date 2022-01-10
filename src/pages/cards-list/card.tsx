import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import crossPng from '@/images/icons/cross.png'
import cardsHealper from '@/utils/cards-healper'
import './cards-list.less'
import { encryptByDES, getBranchId } from '@/utils/tools'
import { toastService } from '@/service/toast-service'
import { TaroNavToMiniProgram } from '@/service/api'

export default function Card(props: {
  action?: string,
  card:any,
  style?: string
}) {
  
  const onClickIcon = (e) => {
    console.log('click icon',e);
    e.stopPropagation()
  }
  const onClickCard = async (e) => {
    if(props.action === 'switchCard'){
      await cardsHealper.setDefault(props.card.id)
      Taro.navigateBack()
    }else if(props.action === 'jumpOut'){
      const params = {
        p_mobile: props.card.cellphone,
        p_name: props.card.name,
        p_identity: props.card.idenNo,
        p_visitCard: props.card.cardNo,
        p_hisPatientId: props.card.patientId
      }
      const alySign = encryptByDES(JSON.stringify(params))
      console.log('alySign',alySign);
      console.log('params',JSON.stringify(params))
      const path = 'https://ivf.gy3y.com/patients/#/SubscribeListNum'
      const branchId = getBranchId()
      TaroNavToMiniProgram({
        appId: 'wx2958acfb26e6b4cd',
        path: `pages/toLogin/toLogin?url=${encodeURIComponent(path)}&type=wxChat&unitId=${branchId}&alySign=${alySign}`
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    }else{
      Taro.setStorageSync('card',props.card)
      Taro.navigateTo({url: `/pages/card-detail/card-detail`})
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