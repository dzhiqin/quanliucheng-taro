import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import HealthCards from '@/components/health-cards/health-cards'
import { useEffect, useState } from 'react'
import { createPaymentOrder, fetchPaymentOrderList , TaroSubscribeService , PayOrderParams, handlePayment, cancelPayment, fetchPaymentOrderStatus, TaroAliPayment, AlipaySubscribeService } from '@/service/api'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import { PAY_TYPE_CN, ORDER_SEARCH_TYPE_EN , ORDER_STATUS_CN, ORDER_STATUS_EN, PAYMENT_FROM } from '@/enums/index'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import BkTabs from '@/components/bk-tabs/bk-tabs'
import BkLoading from '@/components/bk-loading/bk-loading'
import BkPrice from '@/components/bk-price/bk-price'
import SubscribeNotice from '@/components/subscribe-notice/subscribe-notice'
import { Card } from 'src/interfaces/card'
import { custom } from '@/custom/index'
import { requestTry } from '@/utils/retry'
import './order-list.less'
import { getQueryValue } from '@/utils/index'

const tabs = [{title: '15日内订单',value: 'current'},{title: '历史订单',value: 'history'}]
export default function OrderList(){
  const [list,setList] = useState([])
  const [busy,setBusy] = useState(false)
  const [showNotice,setShowNotice] = useState(false)
  const [searchType, setSearchType] = useState(ORDER_SEARCH_TYPE_EN.current)
  const [card,setCard] = useState({} as Card)
  const onCardChange = (_card) => {
    setCard(_card)
    getList(searchType)
  }
  const getList = (type: string) => {
    setBusy(true)
    fetchPaymentOrderList({type}).then(res => {
      setBusy(false)
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        setList([])
        modalService({content: res.message})
      }
    })
  }
  const onTabChange = (e,value) => {
    setSearchType(value)
  }
  const dealWithPay = async (type,orderInfo) => {
    let subRes
    if(process.env.TARO_ENV === 'weapp'){
      subRes = await TaroSubscribeService(custom.subscribes.paySuccessNotice,custom.subscribes.refundNotice)
      if(!subRes.result){
        setShowNotice(true)
        return
      }
    }
    if(process.env.TARO_ENV === 'alipay'){
      subRes = await AlipaySubscribeService(custom.subscribes.paySuccessNotice,custom.subscribes.orderCancelReminder)
      if(!subRes.result){
        modalService({content: subRes.msg})
        return
      }
    }
    setBusy(true)
    createPaymentOrder(buildPaymentParams(type,orderInfo)).then(res => {
      if(res.resultCode === 0){
        payOrderById(res.data.orderId,type)
      }else{
        modalService({title: '创建订单失败',content: res.message})
      }
    })
  }
  const payOrderById = (id: string,payType: string) => {
    loadingService(true,'支付中……')
    handlePayment({orderId: id, payType: payType}).then(res => {
      if(res.data.jumpUrl && res.data.appid){
        loadingService(false)
        if(process.env.TARO_ENV === 'weapp'){
          Taro.navigateToMiniProgram({
            appId: res.data.appid,
            path: res.data.jumpUrl
          })
        }else{
          modalService({content: '请手动跳转到外部小程序'})
        }
        
        return
      }else if(res.resultCode === 0 && !res.data){
        toastService({title: '提交订单成功，还未支付', onClose: () => {getList(searchType);loadingService(false); setBusy(false)}})
      }else{
        const {nonceStr, paySign, signType, timeStamp, pay_appid, pay_url} = res.data
        if(payType === PAY_TYPE_CN.医保){
          if(process.env.TARO_ENV === 'weapp'){
            Taro.showLoading({title: '正在打开医保小程序'})
            Taro.navigateToMiniProgram({
              appId: pay_appid,
              path: pay_url,
              success: () => Taro.hideLoading()
            })
          }else{
            modalService({content: '请手动跳转到医保小程序'})
          }
          loadingService(false)
        }else{
          if(process.env.TARO_ENV === 'weapp'){
            handleWeappPay({nonceStr,paySign,timeStamp,package: res.data.package,signType,orderId:id})
          }
          if(process.env.TARO_ENV === 'alipay'){
            const tradeNo = getQueryValue(res.data.package, 'trade_no')
            handleAliPay({tradeNo, orderId: id})
          }
          
        }
      }
    })
  }
  const handleAliPay = (options: {tradeNo: string, orderId: string}) => {
    TaroAliPayment({tradeNo: options.tradeNo}).then(payRes => {
      const data = JSON.parse(payRes.data)
      if(data.resultCode === '9000'){
        requestTry(checkOrderStatus.bind(null,options.orderId)).then(() => {
          toastService({title: '缴费成功',onClose: () => {getList(searchType);loadingService(false);setBusy(false)}})
        }).catch(() => {
          toastService({title: '缴费失败，所缴金额将原路退回', onClose: () => {getList(searchType);loadingService(false); setBusy(false)}})
        })
      }else{
        modalService({title: '支付失败',content: '错误码：'+data.resultCode+data.memo})
        loadingService(false);setBusy(false)
      }
    }) 
  }
  const handleWeappPay = (options: {nonceStr: string, paySign: string, timeStamp: string, package: string, signType:'HMAC-SHA256' | 'MD5',orderId: string }) => {
    Taro.requestPayment({
      nonceStr: options.nonceStr,
      paySign: options.paySign,
      timeStamp: options.timeStamp,
      package: options.package,
      signType: options.signType,
      fail: (err) => {
        // 取消缴费
        toastService({title: '您已取消缴费', onClose: ()=> {getList(searchType); loadingService(false);setBusy(false)}})
        cancelPayment({orderId:options.orderId})
      },
      success: (result) => {
        requestTry(checkOrderStatus.bind(null,options.orderId)).then(checkRes => {
          toastService({title: '缴费成功', onClose: () => {getList(searchType);loadingService(false); setBusy(false)}})
        }).catch(()=>{
          toastService({title: '缴费失败，所缴金额将原路退回', onClose: () => {getList(searchType);loadingService(false); setBusy(false)}})
        })
      }
    })
  }
  const checkOrderStatus = (id: string) => {
    return new Promise((resolve,reject) => {
      fetchPaymentOrderStatus({orderId:id}).then(res => {
        if(res.resultCode === 0 && res.data === ORDER_STATUS_EN.paySuccess_and_His_success){
          resolve(res.message)
        }else{
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
  const buildPaymentParams = (type: PAY_TYPE_CN, orderInfo: any) => {
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
    setBusy(true)
    fetchPaymentOrderList({type: searchType}).then(res => {
      setBusy(false)
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        modalService({content: res.message})
      }
    })
  },[searchType])
  const onClickItem = (item) => {
    // console.log(item);
    const { serialNo, clinicCode, createdTime, orderDate, recipeSeq, prescMoney, orderDept, orderDoctor, orderId, orderType, payState } = item
    const params = {
      serialNo,
      clinicNo: clinicCode,
      createdTime,
      orderDate,
      recipeSeq,
      prescMoney,
      orderDept,
      orderDoctor,
      orderId,
      payState,
      // orderType: orderType === '0' ? 'ZiFei' : 'YiBao'  // 订单列表接口后端返回的ordertype为'0'/'1',但缴费列表接口返回的ordertype字段为‘ZiFei’/'YiBao',就╮(╯▽╰)╭……
      orderType
    }
    Taro.navigateTo({url: `/pages/payment-pack/payment-detail/payment-detail?orderInfo=${JSON.stringify(params)}&from=${PAYMENT_FROM.orderList}`})
  }
  return (
    <View className='payment-order-list'>
      <View className='payment-order-list-header'>
        <HealthCards switch onCard={onCardChange} />
        <BkTabs tabs={tabs} onTabChange={onTabChange} />
      </View>
      
      <SubscribeNotice show={showNotice} />
      
      {
        list.length > 0 
        ?
        <View style='padding: 40rpx;margin-top: 300rpx'>
          {
            list.map((item,index) => 
              <BkPanel key={index} style='margin-bottom: 40rpx' onClick={onClickItem.bind(null,item)} arrow>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>门诊号:</View>
                  <View className='order-list-item-text'>{item.clinicCode}</View>
                </View>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>订单状态:</View>
                  <View className='order-list-item-text'>{ORDER_STATUS_CN[item.orderState]}</View>
                </View>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>就诊日期:</View>
                  <View className='order-list-item-text'>{item.createdTime}</View>
                </View>
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>就诊科室:</View>
                  <View className='order-list-item-text'>{item.orderDept}</View>
                </View>
                {
                  item.orderDoctor && 
                  <View className='order-list-item'>
                    <View className='order-list-item-title flat-title'>就诊医生:</View>
                    <View className='order-list-item-text'>{item.orderDoctor}</View>
                  </View>
                }
                <View className='order-list-item'>
                  <View className='order-list-item-title flat-title'>总金额:</View>
                  <BkPrice value={item.prescMoney} symbol style='margin-left: 40rpx' />
                </View>
                <View className='flex-around'>
                  {
                    item.orderState === ORDER_STATUS_EN.unpay && process.env.TARO_ENV === 'weapp' &&
                    <BkButton theme='info' icon='icons/wechat.png' title='微信支付' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.微信,item)} />
                  }
                                    {
                    item.orderState === ORDER_STATUS_EN.unpay && process.env.TARO_ENV === 'alipay' &&
                    <BkButton theme='primary' icon='icons/alipay.png' title='支付宝支付' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.支付宝,item)} />
                  }
                  {
                    item.orderState === ORDER_STATUS_EN.unpay && item.orderType === PAY_TYPE_CN.医保 &&
                    <BkButton theme='primary' icon='icons/wechat.png' title='医保支付' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.医保,item)} />
                  }
                </View>
              </BkPanel>  
            )
          }
        </View>
        :
        <BkLoading style='margin-top: 300rpx' loading={busy} msg='暂无缴费单' />
      }
    </View>
  )
}