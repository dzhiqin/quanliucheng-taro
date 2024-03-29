import { View } from '@tarojs/components'
import { custom } from '@/custom/index'
import * as React from 'react'
import { AtIcon } from 'taro-ui'
import { WEAPP } from '@/utils/tools'

export default function RegisterNotice () {
  const payButtonText = WEAPP ? '微信支付' : '支付宝支付'
  const PaymentTips = () => {
    switch(custom.hospName){
      case 'gy3yhp': return null;
      default: return(
        <View className='flex-center'>
          <AtIcon value='alert-circle' size='15' color='#FF7C25'></AtIcon>
          <text className='price-color'>目前{payButtonText}仅自费缴费{custom.feat.YiBaoCard ? '和广州医保' : ''}，如省直、市直、公费记账请移步到窗口人工缴纳</text>
        </View>
      )
    }
  }
  if(custom.hospName === 'gy3ylw'){
    return(
      <View>
        <View className='order-create-title'>挂号须知</View>
        <View className='order-create-notice'>
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
            <text>微信挂号需要挂号收据报销的，请当班时间在挂号窗口打印</text>
          </View>
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
            <text className='price-color'>内科不接诊14周岁以下的患者</text>
          </View>
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
            <text className='price-color'>儿科门诊仅限14周岁以下患者凭本人诊疗卡进行预约挂号</text>
          </View>
        </View>
      </View>
    )
  }else{
    return(
      <View>
        <View className='order-create-title'>挂号须知</View>
        <View className='order-create-notice'>
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
            <text>缴费提供{payButtonText}</text>
          </View>
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
            <text>处方24小时有效</text>
          </View>
          {/* {
            // 特殊处理
            custom.hospName !== 'gy3yhp' &&
            <View className='flex-center'>
              <AtIcon value='alert-circle' size='15' color='#FF7C25'></AtIcon>
              <text className='price-color'>目前{payButtonText}仅自费缴费{custom.feat.YiBaoCard ? '和广州医保' : ''}，如省直、市直、公费记账请移步到窗口人工缴纳</text>
            </View>
          } */}
          <PaymentTips />
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#FF7C25'></AtIcon>
            <text className='price-color'>需要打印发票和费用清单的请到一楼大厅自助机自行打印</text>
          </View>
          {/* {
            custom.hospName === 'jszyy' &&
            <View className='flex-center'>
              <AtIcon value='alert-circle' size='15' color='#FF7C25'></AtIcon>
              <text className='price-color'>备注：六岁（含）以下儿童的诊查费上浮30%，先预收上浮后的金额，若是六岁以上儿童，就诊时会退还上浮30%的金额至患者的诊疗卡内。</text>
            </View>
          } */}
        </View>
      </View>
    )
  }
  
}