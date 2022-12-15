import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import HealthCards from '@/components/health-cards/health-cards'
import { CardsHealper } from '@/utils/cards-healper'
import { modalService } from '@/service/toast-service'
import { fetchPaymentListFromHis } from '@/service/api'
import { useState,useEffect } from 'react'
import BkLoading from '@/components/bk-loading/bk-loading'
import './payment-list.less'
import BkPrice from '@/components/bk-price/bk-price'
import { ORDER_STATUS_EN, PAYMENT_FROM, PAY_STATUS_EN } from '@/enums/index'

export default function PaymentList() {
  const [list, setList] = useState([])
  const [loading,setLoading] = useState(false)
  const onCardChange = (e) => {
    const card = e
    setLoading(true)
    fetchPaymentListFromHis({cardId: card?.id}).then(res => {
      if(res.resultCode === 0){
        setList(res.data.bills)
      }else{
        setList([])
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  
  useEffect(() => {
    const card = CardsHealper.getDefault()
    if(!card){
      // modalService({content: '请先绑卡',success: ()=> {Taro.navigateTo({url: '/pages/card-pack/cards-list/cards-list'})}})
      
      return
    }
  },[])
  const handleClick = (item) => {
    // 缴费单的信息要从列表带过去
    item.payState = PAY_STATUS_EN.unpay  // 默认未支付状态
    item.orderState = ORDER_STATUS_EN.unpay // 默认未支付状态
    Taro.navigateTo({url: `/pages/payment-pack/payment-detail/payment-detail?orderInfo=${JSON.stringify(item)}&from=${PAYMENT_FROM.paymentList}`})
  }
  return(
    <View className='payment-list'>
      <HealthCards switch onCard={onCardChange} />
      <View style='padding: 40rpx'>
        {
          list.length > 0 
          ?
            <View>
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
            <BkLoading msg='暂无缴费单' loading={loading} />
        }
      </View>
    </View>
  )
}