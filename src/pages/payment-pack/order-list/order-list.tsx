import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import HealthCards from '@/components/health-cards/health-cards'
import { useEffect, useState } from 'react'
import { useDidShow } from '@tarojs/taro'
import { createPaymentOrder, fetchPaymentOrderList , subscribeService , PayOrderParams, handlePayment, cancelPayment, fetchPaymentOrderStatus } from '@/service/api'
import { toastService } from '@/service/toast-service'
import BkNone from '@/components/bk-none/bk-none'
import BkTabs from '@/components/bk-tabs/bk-tabs'
import { orderPayType_CN, orderSearchType_EN , orderStatus_CN, orderStatus_EN } from '@/enums/index'
import BkPanel from '@/components/bk-panel/bk-panel'
import './order-list.less'
import BkPrice from '@/components/bk-price/bk-price'
import BkButton from '@/components/bk-button/bk-button'
import { onetimeTemplates } from '@/utils/templateId'
import SubscribeNotice from '@/components/subscribe-notice/subscribe-notice'
import cardsHealper from '@/utils/cards-healper'
import { Card } from 'src/interfaces/card'
import { requestTry } from '@/utils/retry'

const tabs = [{title: '15日内订单',value: 'current'},{title: '历史订单',value: 'history'}]
export default function OrderList(){
  const [list,setList] = useState([])
  const [busy,setBusy] = useState(false)
  const [showNotice,setShowNotice] = useState(false)
  const [searchType, setSearchType] = useState(orderSearchType_EN.current)
  const [card,setCard] = useState({} as Card)
  useDidShow(() => {
    setCard(cardsHealper.getDefault())
    getList(searchType)
  })
  const getList = (type: string) => {
    Taro.showLoading({title: '加载中……'})
    fetchPaymentOrderList({type}).then(res => {
      console.log(res);
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        toastService({title: res.message})
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }
  const onTabChange = (e,value) => {
    setSearchType(value)
  }
  const dealWithPay = async (type,orderInfo) => {
    const tempIds = onetimeTemplates.payment()
    const subsRes = await subscribeService(tempIds)
    if(!subsRes.result){
      setShowNotice(true)
      return
    }
    setBusy(true)
    createPaymentOrder(buildPaymentParams(type,orderInfo)).then(res => {
      if(res.resultCode === 0){
        payOrderById(res.data.orderId,type)
      }else{
        toastService({title: '创建订单失败' + res.message})
      }
    })
  }
  const payOrderById = (id: string,payType: string) => {
    Taro.showLoading({title: '支付中……',mask:true})
    handlePayment({orderId: id, payType: payType}).then(res => {
      if(res.popUpCode === 3){
        // do nothing
      }else if(res.resultCode === 0 && !res.data){
        toastService({title: '提交订单成功，还未支付', onClose: () => {getList(searchType); setBusy(false)}})
      }else{
        console.log('data',res.data)
        const {nonceStr, paySign, signType, timeStamp, pay_appid, pay_url} = res.data
        if(payType === orderPayType_CN.医保){
          Taro.showLoading({title: '正在打开医保小程序'})
          Taro.navigateToMiniProgram({
            appId: pay_appid,
            path: pay_url,
            success: () => Taro.hideLoading()
          })
        }else{
          Taro.requestPayment({
            nonceStr,
            paySign,
            timeStamp,
            package: res.data.package,
            signType: signType,
            fail: (err) => {
              // 取消缴费
              toastService({title: '您已取消缴费', onClose: ()=> {getList(searchType); setBusy(false)}})
              cancelPayment({orderId:id})
            },
            success: (result) => {
              requestTry(checkOrderStatus.bind(null,id)).then(checkRes => {
                toastService({title: '缴费成功', onClose: () => {getList(searchType); setBusy(false)}})
              }).catch(()=>{
                toastService({title: '缴费失败，所缴金额将原路退回', onClose: () => {getList(searchType); setBusy(false)}})
              })
            }
          })
        }
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }
  const checkOrderStatus = (id: string) => {
    return new Promise((resolve,reject) => {
      fetchPaymentOrderStatus({orderId:id}).then(res => {
        if(res.resultCode === 0 && res.data === orderStatus_EN.paySuccess_and_His_success){
          resolve(res.message)
        }else{
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
  const buildPaymentParams = (type: orderPayType_CN, orderInfo: any) => {
    const paymentParams: PayOrderParams ={
      patientId: card.patientId,
      clinicNo: orderInfo.clinicNo,
      recipeSeq: orderInfo.recipeSeq,
      orderType: type,
      prescFee: orderInfo.prescMoney,
      orderDept: orderInfo.orderDept,
      orderDoctor: orderInfo.orderDoctor,
      orderDate: orderInfo.orderDate,
      payType: type
    }
    return paymentParams
  }
  useEffect(() => {
    Taro.showLoading({title: '加载中……'})
    fetchPaymentOrderList({type: searchType}).then(res => {
      console.log(res);
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        toastService({title: res.message})
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  },[searchType])
  const onClickItem = (item) => {
    console.log(item);
    const { clinicCode, createdTime, orderDate, recipeSeq, prescMoney, orderDept, orderDoctor, orderId, orderType } = item
    const params = {
      clinicNo: clinicCode,
      createdTime,
      orderDate,
      recipeSeq,
      prescMoney,
      orderDept,
      orderDoctor,
      orderId,
      orderType: orderType === '0' ? 'ZiFei' : 'YiBao'  // 订单列表接口后端返回的ordertype为'0'/'1',但缴费列表接口返回的ordertype字段为‘ZiFei’/'YiBao',就╮(╯▽╰)╭……
    }
    Taro.navigateTo({url: '/pages/payment-pack/payment-detail/payment-detail?orderInfo=' + JSON.stringify(params)})
  }
  return (
    <View className='payment-order-list'>
      <HealthCards switch />
      <SubscribeNotice show={showNotice} />
      <BkTabs tabs={tabs} onTabChange={onTabChange} />
      {
        list.length > 0 
        ?
        <View style='padding: 40rpx'>
          {
            list.map((item,index) => 
              <BkPanel key={index} style='margin-bottom: 40rpx' onClick={onClickItem.bind(null,item)}>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>门诊号:</View>
                  <View className='order-list-item-text'>{item.clinicCode}</View>
                </View>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>订单状态:</View>
                  <View className='order-list-item-text'>{orderStatus_CN[item.orderState]}</View>
                </View>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>就诊日期:</View>
                  <View className='order-list-item-text'>{item.createdTime}</View>
                </View>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>就诊科室:</View>
                  <View className='order-list-item-text'>{item.orderDept}</View>
                </View>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>就诊医生:</View>
                  <View className='order-list-item-text'>{item.orderDoctor}</View>
                </View>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>总金额:</View>
                  <BkPrice value={item.prescMoney} symbol style='margin-left: 40rpx' />
                </View>
                <View className='flex-around'>
                  {
                    item.orderState === orderStatus_EN.unpay &&
                    <BkButton theme='info' icon='icons/wechat.png' title='微信支付' disabled={busy} onClick={dealWithPay.bind(null,orderPayType_CN.自费,item)} />
                  }
                  {
                    item.orderState === orderStatus_EN.unpay && item.orderType === orderPayType_CN.医保 &&
                    <BkButton theme='primary' icon='icons/wechat.png' title='医保支付' disabled={busy} onClick={dealWithPay.bind(null,orderPayType_CN.医保,item)} />
                  }
                </View>
              </BkPanel>  
            )
          }
        </View>
        :
        <BkNone msg='暂无缴费单' />
      }
    </View>
  )
}