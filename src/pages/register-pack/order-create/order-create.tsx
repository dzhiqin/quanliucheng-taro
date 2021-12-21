import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import HealthCards from '@/components/health-cards/health-cards'
import './order-create.less'
import { useState } from 'react'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import { AtIcon } from 'taro-ui'
import { fetchOrderFee } from '@/service/api'

export default function OrderCreate() {
  const [order,setOrder] = useState({
    patientName: '',
    deptName:'',
    doctorName: '',
    regDate: '',
    startTime: '',
    endTime: '',
    regFee: '',
    treatFee: '',
    feeType: '',
    patientId: '',
    cardNo: '',
    sourceType: '',
    deptId: '',
    sliceId: '',
    doctorId: '',
    scheduleId: '',
    regTypeId: ''
  })
  const buildOrderParams = () => {
    const orderParams = Taro.getStorageSync('orderParams')
    const { patientId, cardNo, sourceType, regDate, deptId, sliceId, doctorId, scheduleId, regTypeId} = orderParams
    console.log('order',order);
    
    // 接口字段不一致
    const params = {
      patientId,
      cardNo,
      sourceType,
      regDate,
      regDept: deptId,
      sliceId,
      regDoctor: doctorId,
      schemaId: scheduleId,
      regTypeId,
      pactCode: '1'
    }
    return params
  }
  useDidShow(() => {
    const params = Taro.getStorageSync('orderParams')
    console.log('orderparams:',Taro.getStorageSync('orderParams'));
    setOrder(params)
    fetchOrderFee(buildOrderParams()).then(res => {
      console.log('fetch fee',res);
      
    })
  })
  return(
    <View className='order-create'>
      <HealthCards switch />
      <View className='order-create-title'>挂号详情</View>
      <BkPanel>
        <View className='order-create-item'>
          <View className='order-create-item-title'>就诊人</View>
          <View className='order-create-item-value'>{order.patientName}</View>
        </View>
        <View className='order-create-item'>
          <View className='order-create-item-title'>就诊科室</View>
          <View className='order-create-item-value'>{order.deptName}</View>
        </View>
        <View className='order-create-item'>
          <View className='order-create-item-title'>就诊医生</View>
          <View className='order-create-item-value'>{order.doctorName}</View>
        </View>
        <View className='order-create-item'>
          <View className='order-create-item-title'>就诊日期</View>
          <View className='order-create-item-value price-color'>{order.regDate}</View>
        </View>
        <View className='order-create-item'>
          <View className='order-create-item-title'>就诊时间</View>
          <View className='order-create-item-value price-color'>{order.startTime} - {order.endTime}</View>
        </View>
        <View className='order-create-item'>
          <View className='order-create-item-title'>金额</View>
          <View className='order-create-item-value'>{order.patientName}</View>
        </View>
        <View className='order-create-item'>
          <View className='order-create-item-title'>费用类型</View>
          <View className='order-create-item-value'>{order.patientName}</View>
        </View>
      </BkPanel>
      <View className='order-create-title'>挂号须知</View>
      <View className='order-create-notice'>
        <View>
          <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
          <text>1、缴费提供微信支付</text>
        </View>
        <View>
          <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
          <text>2、处方24小时有效</text>
        </View>
        <View>
          <AtIcon value='alert-circle' size='15' color='#FF7C25'></AtIcon>
          <text className='price-color'>3、目前微信支付仅自费缴费和广州医保，如省直、市直、公费记账请移步到窗口人工缴纳</text>
        </View>
        <View>
          <AtIcon value='alert-circle' size='15' color='#FF7C25'></AtIcon>
          <text className='price-color'>4、需要打印发票和费用清单的请到一楼大厅自助机自行打印</text>
        </View>
      </View>
      <View style='padding: 40rpx'>
        <BkButton title='确认挂号' />
      </View>
    </View>
  )
}