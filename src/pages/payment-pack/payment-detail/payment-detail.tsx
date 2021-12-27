import * as React from 'react'
import { View } from '@tarojs/components'
// import HealthCards from '@/components/health-cards/health-cards'
import { useEffect } from 'react'
import { useRouter } from '@tarojs/taro'
import { fetchPaymentDetail } from '@/service/api'

export default function PaymentDetail() {
  const router = useRouter()
  const params = router.params
  useEffect(() => {
    Taro.showLoading({title: '加载中……'})
    fetchPaymentDetail({
      clinicNo: params.clinicNo,
      cardNo: params.cardNo,
      recipeSeq: params.recipeSeq,
      patientId: params.patientId
    }).then(res => {
      if(res.resultCode === 0){
        
      }
    })
  },[params])
  return(
    <View className='payment-detail'>
      
    </View>
  )
}