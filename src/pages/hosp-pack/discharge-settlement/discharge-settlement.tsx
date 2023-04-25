import * as React from 'react'
import { View } from '@tarojs/components'
import HospCards from '@/components/hosp-cards/hosp-cards'
import { fetchDischargeInfo,notifyHisToDischarge,handleDisChangeSettlement,fetchDischargeOrderStatus } from '@/service/api'
import BkLoading from '@/components/bk-loading/bk-loading'
import { useState,useEffect } from 'react'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import { requestTry } from '@/utils/retry'
import { ORDER_STATUS_EN } from '@/enums/index'

export default function DischargeSettlement() {
  const [busy,setBusy] = useState(true)
  const [list,setList] = useState([])
  const [hospCard,setHospCard] = useState({
    cardNo: '',id:'',isDefault: false,name:''
  })
  const onCardReady = (_hospCard) => {
    setHospCard(_hospCard)
  }
  const getList = React.useCallback(() => {
    setBusy(true)
    fetchDischargeInfo({inCardNo: hospCard.cardNo}).then(res => {
      setBusy(false)
      if(res.resultCode === 0){
        setList(res.data.outPatientList)
      }else{
        modalService({content: res.message})
      }
    })
  },[hospCard.cardNo])
  useEffect(() => {
    if(!hospCard.cardNo) return
    getList()
  },[hospCard.cardNo,getList])
  const handleSettlement = (item) => {
    if(item.oweMoney<0){
      modalService({title: '无法自助结算',content: '请前往医院窗口办理'})
      return
    }
    if(item.oweMoney == 0){
      handleDischarge(item.cardNo,item.registerId)
      return
    }
    handleDisChangeSettlement({money: parseInt(item.oweMoney), inCardNo:item.cardNo, registerId:item.registerId}).then(res => {
      if(res.resultCode ===0){
        const payParams = res.data.unifiedOrderResponse
        handleWechatPay({payParams,cardNo:item.cardNo,registerId: item.registerId, orderNo: res.data.orderNo})
      }
    })
  }
  const handleWechatPay = (options:{payParams:any,cardNo: string, registerId: string, orderNo: string}) => {
    loadingService(true,'支付中')
    const {nonceStr, paySign, timeStamp, signType} = options.payParams
    Taro.requestPayment({
      nonceStr,paySign,timeStamp,signType,
      package: options.payParams.package,
      fail: (err) => {
        modalService({content:'您已取消支付'})
      },
      success: payRes => {
        loadingService(true, '查询支付结果')
        requestTry(checkOrderStatus.bind(null,options.orderNo))
          .then(checkRes => {
            toastService({title: '查询支付成功'})
            handleDischarge(options.cardNo,options.registerId)
          })
          .catch(err => {
            modalService({title: '查询订单状态失败',content: JSON.stringify(err)})
          })
      }
    })
  }
  const checkOrderStatus = (orderNo: string) => {
    return new Promise((resolve,reject) => {
      fetchDischargeOrderStatus({orderNo}).then(res => {
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
  const handleDischarge = (inCardNo,registerId) => {
    notifyHisToDischarge({inCardNo,registerId}).then(res => {
      if(res.resultCode === 0){
        modalService({content:'结算成功',showCancel:false,success: () => {
          getList()
        }})
      }else{
        modalService({content: res.message,title: '结算失败'})
      }
    })
  }
  return(
    <View className='settlement'>
      <HospCards onCard={onCardReady} />
      <BkLoading msg={busy ? '加载中' : '暂未查询到出院订单'} loading={busy} />
      {
        list.map((item:any,index) => <BkPanel key={index} style='margin: 20rpx 40rpx;'>
          <View className='panel-item'>
            <View className='flat-title'>姓名</View>
            <View>{item.patientName}</View>
          </View>
          <View className='panel-item'>
            <View className='flat-title'>住院号</View>
            <View>{item.inPatientNo}</View>
          </View>
          <View className='panel-item'>
            <View className='flat-title'>剩余押金</View>
            <View>{item.prePaidMoney}</View>
          </View>
          <View className='panel-item'>
            <View className='flat-title'>待缴金额</View>
            <View>{item.oweMoney}</View>
          </View>
          <View className='panel-item'>
            <View className='flat-title'>总费用</View>
            <View>{item.totalCosts}</View>
          </View>
          
          <BkButton style='margin-top: 40rpx;' title='自费结算' onClick={handleSettlement.bind(null,item)} />
        </BkPanel>)
      }
      {
        list.length>0 &&
        <View className='sub-text-color'><text className='price-color'>温馨提示：</text>若有需要费用清单及电子发票请移步自助机进行打印。</View>
      }
    </View>
  )
}