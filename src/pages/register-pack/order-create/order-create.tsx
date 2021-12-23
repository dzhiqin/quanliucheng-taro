import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Picker } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import HealthCards from '@/components/health-cards/health-cards'
import './order-create.less'
import { useState,useEffect } from 'react'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import { AtIcon } from 'taro-ui'
import { createRegOrder, fetchOrderFee, fetchRegFeeType, fetchRegOrderStatus, TaroRequestPayment } from '@/service/api'
import cardsHealper from '@/utils/cards-healper'
import { toastService } from '@/service/toast-service'
import { requestTry } from '@/utils/retry'
import ResultPage from '@/components/result-page/result-page'

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
  enum resultEnum {
    default = '',
    success = 'success',
    fail = 'fail'
  }
  // 后端字段没统一，导致有2个金额字段 ╮(╯▽╰)╭
  const [regFee,setRegFee] = useState('')
  const [treatFee,setTreatFee] = useState('')
  const [feeTypes,setFeeTypes] = useState([])
  const [feeType,setCurrentFeeType] = useState('')
  const [result,setResult] = useState(resultEnum.default)
  const [feeOptions,setFeeOptions] = useState([])
  const buildOrderParams = () => {
    const orderParams = Taro.getStorageSync('orderParams')
    const card = cardsHealper.getDefault()
    const params = {
      ...orderParams,
      cardNo: card.cardNo,
      patientId: card.patientId,
      regFee,
      treatFee
    }
    return params
  }
  const buildFeeParams = () => {
    const card = cardsHealper.getDefault()
    const orderParams = Taro.getStorageSync('orderParams')
    const { sourceType, regDate, deptId, sliceId, doctorId, scheduleId, regTypeId} = orderParams
    // 接口字段不一致，导致字段要变
    const params = {
      patientId:card.patientId,
      cardNo:card.cardNo,
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
  const onFeeTypeChange = (e) => {
    const index = e.detail.value
    const value = feeOptions[index]
    setCurrentFeeType(value)
  }
  const checkOrderStatus = (orderId: string) => {
    return new Promise((resolve,reject) => {
      fetchRegOrderStatus({orderId}).then(res => {
        console.log('orderstatus',res);
        if(res.resultCode === 0 && res.data.isSuccess){
          resolve(res.message)
        }else{
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
  const handleSubmit = () => {
    if( (!regFee && !treatFee) || feeTypes.length === 0 ) {
      toastService({title: '正在获取费用信息，请稍后……'})
      return
    }
    createRegOrder(buildOrderParams()).then(res => {
      console.log('build order:',res);
      if(res.resultCode === 0){
        const {nonceStr, orderId, paySign, signType, payString, timeStamp} = res.data
        TaroRequestPayment({
          nonceStr,
          paySign,
          timeStamp,
          package: payString,
          signType      
        }).then(taroRes => {
          console.log('tarores',taroRes);
          requestTry(checkOrderStatus.bind(null,orderId)).then(checkRes => {
            setResult(resultEnum.success)
          }).catch(checkErr=>{
            setResult(resultEnum.fail)
          })
          // checkOrderStatus(orderId)
        }).catch(taroErr => {
          if(taroErr.data.errMsg === 'requestPayment:fail cancel'){
            toastService({title: '您已取消缴费'})
            // navigate to regiter order list
            Taro.navigateTo({url: '/pages/register-pack/order-list/order-list'})
          }else{
            console.log('支付失败:',taroErr.data);
          }
          
        })
      }else{
        toastService({title: res.message})
      }
    })
  }
  useEffect(() => {
    fetchRegFeeType().then(res => {
      if(res.resultCode == 0){
        setFeeTypes(res.data)
        let arr = []
        res.data.forEach(i => {
          arr.push(i.feeName)
        })
        setFeeOptions(arr)
        setCurrentFeeType(arr[0])
      }
    })
  },[])
  useDidShow(() => {
    const params = Taro.getStorageSync('orderParams')
    const card = cardsHealper.getDefault()
    const orderParams = {
      ...params,
      cardNo: card.cardNo,
      patienttId: card.patientId,
      patientName: card.name
    }
    setOrder(orderParams)
    fetchOrderFee(buildFeeParams()).then(res => {
      if(res.resultCode === 0){
        setRegFee(res.data.regFee)
        setTreatFee(res.data.treatFee)
      }
    })
  })
  if(result === ''){
    return(
      <View className='order-create'>
        <HealthCards switch />
        <View className='order-create-title'>挂号详情</View>
        <BkPanel style='margin: 40rpx'>
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
            <View className='order-create-item-value price-color'>{regFee ? regFee : treatFee}元</View>
          </View>
          <View className='order-create-item'>
            <View className='order-create-item-title'>费用类型</View>
            <View className='order-create-item-value'>
              <Picker mode='selector' range={feeOptions} onChange={onFeeTypeChange} >
                <View className='flex-between'>
                  <View>{feeType}</View>
                  <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>
                </View>
              </Picker>
            </View>
  
          </View>
        </BkPanel>
        <View className='order-create-title'>挂号须知</View>
        <View className='order-create-notice'>
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
            <text>1、缴费提供微信支付</text>
          </View>
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
            <text>2、处方24小时有效</text>
          </View>
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#FF7C25'></AtIcon>
            <text className='price-color'>3、目前微信支付仅自费缴费和广州医保，如省直、市直、公费记账请移步到窗口人工缴纳</text>
          </View>
          <View className='flex-center'>
            <AtIcon value='alert-circle' size='15' color='#FF7C25'></AtIcon>
            <text className='price-color'>4、需要打印发票和费用清单的请到一楼大厅自助机自行打印</text>
          </View>
        </View>
        <View style='padding: 40rpx'>
          <BkButton title='确认挂号' onClick={handleSubmit} />
        </View>
      </View>
    )
  }else{
    return(
      <ResultPage type={result} >
        <View className='order-result'>
          <BkPanel>
            <View className='order-result-item'>
              <View className='order-result-title'>开单科室：</View>
              <View className='order-result-value'>{order.deptName}</View>
            </View>
            <View className='order-result-item'>
              <View className='order-result-title'>开单医生：</View>
              <View className='order-result-value'>{order.doctorName}</View>
            </View>
            <View className='order-result-item'>
              <View className='order-result-title'>就诊时间：</View>
              <View className='order-result-value'>{order.regDate} / {order.startTime}-{order.endTime}</View>
            </View>
            <View className='order-result-item'>
              <View className='order-result-title'>总金额：</View>
              <View className='order-result-price'>{regFee ? regFee : treatFee} 元</View>
            </View>
          </BkPanel>
          <View style='padding-top: 80rpx'>
            <BkButton title='返回' onClick={() => Taro.navigateBack()} />
          </View>
        </View>
       
      </ResultPage>
    )
  }
  
}