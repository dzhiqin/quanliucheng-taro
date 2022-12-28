import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import '../cards-list/cards-list.less'
import { AtNoticebar } from 'taro-ui'
import { getImageSrc } from '@/utils/image-src'
import { useState } from 'react'
import { useDidShow } from '@tarojs/taro'
import {custom} from '@/custom/index'
import BkButton from '@/components/bk-button/bk-button'
import Card from './card'
import { loadingService, modalService } from '@/service/toast-service'
import { CardsHealper } from '@/utils/cards-healper'

export default function CardsListAlipay (props: {
  children?: any,
  action: string
}) {
  const [cards,setCards] = useState([])
  useDidShow(() => {
    const temp = Taro.getStorageSync('cards')
    if(temp){
      setCards(temp)
    }
  })
  const navToCreateCard = () => {
    my.getAuthCode({
      scopes: 'auth_user',
      success: res => {
        console.log(res);
        const code = res.authCode
        modalService({
          content: code,
          confirmText: '复制',
          showCancel: true,
          success: data => {
            if(data.confirm){
              my.setClipboard({
                text: code,
                success: () => {
                  Taro.showToast({title: 'copy success'})
                }
              })
            }
          }
        })
      },
      fail: err => {
        console.log(err);
      }
    })
    Taro.navigateTo({url: '/pages/card-pack/create-card/create-card'})
  }
  const handleRefresh = () => {
    loadingService(true)
    CardsHealper.updateAllCards().then(() => {
      loadingService(false)
      let res = Taro.getStorageSync('cards')
      this.setState({cards:res})
    })
  }
  return(
    <View className='cards'>
      <View className='cards-header'>
        <AtNoticebar>点击卡片可查看更多信息</AtNoticebar>
      </View>
      <View className='cards-list'>
        {
          cards.length > 0 
          ?
          cards.map(item => <Card card={item} key={item.id} style='margin-bottom: 40rpx;' action={props.action} />)
          :
          <View className='empty'>
            <Image src={getImageSrc('no_card.png')} className='empty-icon'></Image>
            <View className='empty-txt'>暂无健康卡</View>
          </View>
        }
        <View className='btns-wrap'>
          {
            custom.hospName === 'jszyy' ?
            <View style='color: red;font-size: 26rpx;'>如就诊卡遗失或忘记卡号，请去人工收费窗口办理补卡</View> :
            <View style='color: red;font-size: 26rpx;'>备注：如果不记得卡号，请选择{custom.feat.bindCard.elecHealthCard ? '[添加健康卡]' : '[添加诊疗卡]'}</View> 
          }
          {
            !custom.feat.bindCard.elecHealthCard && 
            <View className='btn' onClick={()=> Taro.navigateTo({url: '/pages/card-pack/bind-card/bind-card'})}>
              <View className='btn-title'>绑卡</View>
              <View className='btn-subtitle'>已有就诊卡用户直接绑定</View>
            </View>
          }
          {/* 特殊处理 金沙洲只用诊疗卡 */}
          <BkButton title={custom.hospName === 'jszyy' ? '添加诊疗卡' : '添加健康卡'} theme='info' onClick={navToCreateCard} style='width: 480rpx; margin-bottom: 20rpx' />
          <BkButton title={custom.hospName === 'jszyy' ? '刷新诊疗卡' : '刷新健康卡'} theme='primary' onClick={handleRefresh} style='width: 480rpx; margin-bottom: 20rpx' />
        </View>
      </View>
    </View>
  )
}