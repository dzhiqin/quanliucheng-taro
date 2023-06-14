import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { fetchRecoveryFee,TaroSubscribeService,fetchRecoveryPayParams, TaroRequestPayment, AlipaySubscribeService } from '@/service/api'
import BkPanel from '@/components/bk-panel/bk-panel'
import './recovery.less'
import BkButton from '@/components/bk-button/bk-button'
import SubscribeNotice from '@/components/subscribe-notice/subscribe-notice'
import { custom } from '@/custom/index'
import { modalService } from '@/service/toast-service'
import { useState } from 'react'
import BkLoading from '@/components/bk-loading/bk-loading'
import BkPrice from '@/components/bk-price/bk-price'
import { WEAPP, ALIPAYAPP } from '@/utils/tools'

export default function Recovery() {
  const [data,setData] = useState({
    patientName: '',
    cardNo: '',
    totalFee: '',
    relatedOrderNo: '',
    orderDate: ''
  })
  const [showNotice,setShowNotice] = useState(false)
  const [busy,setBusy] = useState(false)
  const [result,setResult] = useState(false)
  React.useEffect(() => {
    fetchRecoveryFee().then(res => {
      if(res.resultCode === 0){
        setData(res.data)
      }
      setResult(!res.resultCode)
    })
  },[])
  const handlePaySuccess = () => {
    setBusy(false)
    modalService({
      content:'支付成功',
      showCancel: false,
      confirmText: '返回首页',
      success: res => {
        if(res.confirm){
          Taro.switchTab({url: '/pages/index/index'})
        }
      }
    })
  }
  const handlePayFail = (err) => {
    setBusy(false)
    let errMsg
    if(err.data.errMsg === 'requestPayment:fail cancel') errMsg = '您已取消支付'
    
    modalService({
      content: errMsg || err.data.errMsg,
      cancelText: '返回首页',
      confirmText: '重试',
      success: res => {
        if(res.cancel){
          Taro.switchTab({url: '/pages/index/index'})
        }
      }
    })
    
  }
  const dealWithPay = async() => {
    let subRes
    if(WEAPP){
      subRes = await TaroSubscribeService(custom.subscribes.paySuccessNotice, custom.subscribes.refundNotice)
      if(!subRes.result){
        setShowNotice(true)
        return
      }
    }
    if(ALIPAYAPP){
      subRes = await AlipaySubscribeService(custom.subscribes.paySuccessNotice, custom.subscribes.orderCancelReminder)
      if(!subRes.result){
        modalService({content: subRes.msg})
        return
      }
    }
    
    setBusy(true)
    fetchRecoveryPayParams().then(res => {
      if(res.resultCode===0){
        const { nonceStr, package:_package, paySign, signType, timeStamp} = res.data
        TaroRequestPayment({
          nonceStr,
          package: _package,
          paySign,
          timeStamp,
          signType
        }).then(() => {
          handlePaySuccess()
        }).catch((err) => {
          handlePayFail(err)
        })
      }else{
        modalService({
          content: '获取支付参数失败'+res.message,
          showCancel: false
        })
      }
    }).catch(err => {
      modalService({
        content: '获取支付参数失败'+err,
        showCancel: false
      })
    })
  }
  if(!result){
    return(
      <BkLoading msg='补缴单不存在或您已补缴' />
    )
  }else{
    return(
      <View className='recovery'>
        <SubscribeNotice show={showNotice}></SubscribeNotice>
        <View className='recovery-title'>&#12288;&#12288;尊敬的用户您好，{data.orderDate}因发票系统故障导致您的缴费订单自动退费，给您造成了不便。为不影响您后续到{custom.hospitalName}就诊，请您进行手工补缴，谢谢配合。</View>
        <BkPanel>
          <View className='flex'>
            <View className='flat-title'>姓名：</View>
            <View>{data.patientName}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>卡号：</View>
            <View>{data.cardNo}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>补缴金额：</View>
            {/* <View>{data.totalFee}元</View> */}
            <BkPrice value={data.totalFee} />
          </View>
          <View className='flex'>
            <View className='flat-title'>关联单号：</View>
            <View style='word-break: break-all;'>{data.relatedOrderNo}</View>
          </View>
        </BkPanel>
        <View style='padding: 40rpx'>
          <BkButton loading={busy} title='补缴支付' onClick={dealWithPay.bind(this)} />
        </View>
      </View>
    )
  }
  
}