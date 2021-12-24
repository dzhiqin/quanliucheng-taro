import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import HealthCards from '@/components/health-cards/health-cards'
import { useDidShow } from '@tarojs/taro'
import cardsHealper from '@/utils/cards-healper'
import { toastService } from '@/service/toast-service'
import { fetchPaymentList } from '@/service/api'
import { useState } from 'react'
import BkNone from '@/components/bk-none/bk-none'
import './payment-list.less'
import BkPrice from '@/components/bk-price/bk-price'

export default function PaymentList() {
  const [list, setList] = useState([])
  useDidShow(() => {
    const card = cardsHealper.getDefault()
    if(!card){
      toastService({title: '请先绑卡'})
      return
    }
    fetchPaymentList({cardId: card.id}).then(res => {
      if(res.resultCode === 0){
        setList(res.data.bills)
      }
    })
  })
  const handleWechatPay = (item) => {
    console.log('wx pay', item);
    
  }
  const handleYiBaoPay = (item) => {
    console.log('yb pay',item);
    
  }
  const handleClick = (item) => {
    console.log(item);
    Taro.navigateTo({url: '/pages/payment-pack/payment-detail/payment-detail'})
  }
  return(
    <View className='payment-list'>
      <HealthCards switch />
      <View style='padding: 40rpx'>
        {
          list.length > 0 
          ?
            <View>
              {/* {
                list.map((item) => 
                  <View key={item.clinicNo} className='box-shadow-radius' style='margin-bottom: 40rpx'>
                    <View className='flex'>
                      <View className='flat-title'>订单编号：</View>
                      <View className='sub-text-color'>{item.clinicNo}</View>
                    </View>
                    <View className='dashed-devider'></View>
                    <View className='flex'>
                      <View className='flat-title'>开单科室：</View>
                      <View className='sub-text-color'>{item.orderDept}</View>
                    </View>
                    <View className='flex'>
                      <View className='flat-title'>开单医生：</View>
                      <View className='sub-text-color'>{item.orderDoctor}</View>
                    </View>
                    <View className='flex'>
                      <View className='flat-title'>就诊时间：</View>
                      <View className='sub-text-color'>{item.orderDate}</View>
                    </View>
                    <View className='flex'>
                      <View className='flat-title'>总金额：</View>
                      <View className='sub-text-color price-color'>{item.prescMoney} 元</View>
                    </View>
                    <View className='flex-around' style='margin-top: 20rpx'>
                      {
                        item.orderType = 'YiBao' &&
                        <BkButton title='医保支付' theme='primary' icon='icons/card.png' onClick={handleYiBaoPay.bind(null, item)} />
                      }
                      <BkButton title='微信支付' theme='info' icon='icons/wechat.png' onClick={handleWechatPay.bind(null, item)} />
                    </View>
                  </View>
                )
              } */}
              {
                list.map((item) => 
                  <View key={item.clinicNo} className='box-shadow-radius flex' style='margin-bottom: 40rpx' onClick={handleClick.bind(null,item)}>
                    <View style='flex:1'>
                      <text className='text-color'>{item.orderDept}</text>
                      <text className='sub-text-color'>{item.orderDate}</text>
                    </View>
                    <View>
                      <BkPrice symbol value={item.prescMoney} />
                    </View>
                  </View>
                )
              }
            </View>
          :
            <BkNone />
        }
      </View>
    </View>
  )
}