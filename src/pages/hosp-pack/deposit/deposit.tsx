import * as React from 'react'
import { Input, View } from '@tarojs/components'
import { useState } from 'react'
import { getInHospInfo, getDepositOrderList,
  fetchDepositPayParams, 
  TaroRequestPayment,
  getDepositOrderStatus,
  getDepositOrderDetail
} from '@/service/api'
import BkTabs from '@/components/bk-tabs/bk-tabs'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import BkLoading from '@/components/bk-loading/bk-loading'
import './deposit.less'
import { ORDER_STATUS_EN, PAY_RESULT } from '@/enums/index'
import { requestTry } from '@/utils/retry'
import DepositListItem from './deposit-list-item'
import BaseModal from '@/components/base-modal/base-modal'
import ResultPage from '@/components/result-page/result-page'
import PatientCard from '../components/patient-card/patient-card'

const inHospStatusObj = {
  1: '在院',
  0: '不在院'
}

export default function BindingCard() {
  const [resultVisible,setResultVisible] = useState(false)
  const [payResult,setPayResult] = useState(PAY_RESULT.SUCCESS)
  const [patientCard,setPatientCard] = useState(null)
  const [tabValue,setTabValue] = useState('deposit')
  const [money,setMoney] = useState(null)
  const [busy,setBusy] = useState(false)
  const [list,setList] = useState([])
  const [showDetail,setShowDetail] = useState(false)
  const [errMsg,setErrMsg] = useState('')
  // const [orderNo,setOrderNo] = useState('')
  const [info,setInfo] = useState({
    inDate: '',
    dateCount: '',
    inHospStatus: '',
    inDept: '',
    payCount: '',
    inpBalance: '',
    registerId: ''
  })
  const [depositItem,setDepositItem] = useState({
    orderNo: '',
    orderStatus: '',
    payTime: '',
    payType: '',
    prePayMoney: '',
    wxTransactionId: ''
  })
  const tabs = [
    {
      title: '住院押金充值',
      value: 'deposit'
    },
    {
      title: '充值记录',
      value: 'record'
    }
  ]
  const moneyTabs = [
    {
      title: '500元',
      value: 500
    },
    {
      title: '1000元',
      value: 1000
    },
    {
      title: '1500元',
      value: 1500
    }
  ]
  const getList = (card) => {
    getDepositOrderList({cardNo: card.cardNo}).then(res => {
      if(res.resultCode===0){
        setList(res.data)
      }
    })
  }
  const getData = (card) => {
    getInHospInfo({inCardNo: card.cardNo}).then(res => {
      if(res.resultCode === 0 && res.data){
        const {inDate, dateCount, inpStatus, inDept, payCount, inpBalance, registerId} = res.data
        setInfo({
          inDate,dateCount,
          inHospStatus: inHospStatusObj[inpStatus],
          inDept,payCount,inpBalance,registerId
        })
      }else{
        modalService({content: '没有住院信息'})
      }
    })
  }
  
  const onTabChange = (e,value) => {
    setTabValue(value)
    if(value === 'record'){
      patientCard && getList(patientCard)
    }
  }
  const onMoneyChange = (e,value) => {
    setMoney(value)
  }
  const inputMoneyChange = (e) => {
    setMoney(e.detail.value)
  }
  const handlePay = async() => {
    if(info.inHospStatus === '不在院'){
      modalService({content: '已出院，无法充值'})
      return
    }
    if(!money){
      toastService({title: '请输入金额'})
      return
    }
    if(!patientCard){
      toastService({title: '您还未绑卡'})
      return
    }
    loadingService(true)
    setBusy(true)
    const response:any = await getDepositPayParams()
    if(!response.success) {
      loadingService(false)
      modalService({title: '支付失败',content: response.message})
      setBusy(false)
      return
    }
    TaroRequestPayment(response.data.unifiedOrderResponse).then(res => {
      requestTry(checkOrderStatus.bind(null,response.data.orderNo)).then(checkRes => {
        getData(patientCard)
        handlePaySuccess()
        loadingService(false)
      }).catch((err) => {
        console.error('retry err',err);
        loadingService(false)
        setBusy(false);setResultVisible(true);setPayResult(PAY_RESULT.FAIL)
        if(err.data === 5){
          setErrMsg('缴费失败，所缴金额将自动退回')
        }
      })
    }).catch(err => {
      toastService({title: '您已取消支付',onClose:()=>loadingService(false)})
      setBusy(false)
    })
  }
  const handlePaySuccess = () => {
    setBusy(false); setResultVisible(true);setPayResult(PAY_RESULT.SUCCESS);setMoney(null)
  }
  const checkOrderStatus = (id: string) => {
    return new Promise((resolve,reject) => {
      getDepositOrderStatus({orderNo:id}).then(res => {
        if(res.resultCode ===0 && res.data === ORDER_STATUS_EN.paySuccess_and_His_success){
          resolve(res.message)
        }else{
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
  const getDepositPayParams = () => {
    return new Promise((resolve,reject) => {
      fetchDepositPayParams({
        inCardNo: patientCard.cardNo,
        money: money,
        registerId: info.registerId
      }).then(res => {
        if(res.resultCode === 0){
          resolve({success: true,data: res.data})
        }else{
          resolve({success: false, message: res.message})
        }
      }).catch(err => {
        resolve({success: false, message: 'error',data: err})
      })
    })
  }
  const onClickItem = (data) => {
    setShowDetail(true)
    loadingService(true)
    getDepositOrderDetail({orderNo: data.orderNo}).then(res => {
      if(res.resultCode === 0){
        loadingService(false)
        setDepositItem(res.data[0])
      }
    })
  }
  const onConfirm = () => {
    setShowDetail(false)
  }
  const onPatientCard = (_card) => {
    setPatientCard(_card)
    getData(_card)
  }
  return(
    <View>
      <ResultPage type={payResult} visible={resultVisible}>
        {
          errMsg && 
          <View style='text-align:center; color: #bbb;'>{errMsg}</View>
        }
        <BkButton title='返回' style='margin: 40rpx;' onClick={() => {setResultVisible(false)}} />
      </ResultPage>
      <PatientCard onCard={onPatientCard} />
      <BaseModal show={showDetail} confirm={onConfirm} cancel={() => setShowDetail(false)} title='订单详情'>
        <View className='flex-between'>
          <text>订单号</text>
          <text>{depositItem.orderNo}</text>
        </View>
        <View className='flex-between'>
          <text>订单状态</text>
          <text>{depositItem.orderStatus}</text>
        </View>
        <View className='flex-between'>
          <text>支付时间</text>
          <text>{depositItem.payTime}</text>
        </View>
        <View className='flex-between'>
          <text>支付方式</text>
          <text>{depositItem.payType}</text>
        </View>
        <View className='flex-between'>
          <text>支付金额</text>
          <text>{depositItem.prePayMoney}元</text>
        </View>
        {/* <View className=''>
          <text>交易流水号</text>
          <text>{depositItem.wxTransactionId}</text>
        </View> */}
      </BaseModal>
      <BkTabs onTabChange={onTabChange} tabs={tabs} ></BkTabs>
      {
        tabValue === 'deposit' &&
        <View style='padding: 40rpx'>
          <BkPanel >
            <View className='card-item'>
              <View>入院日期：</View>
              <View>{info.inDate}</View>
            </View>
            <View className='card-item'>
              <View>住院天数：</View>
              <View>{info.dateCount}</View>
            </View>
            <View className='card-item'>
              <View>住院状态：</View>
              <View>{info.inHospStatus}</View>
            </View>
            <View className='card-item'>
              <View>住院科室：</View>
              <View>{info.inDept}</View>
            </View>
            <View className='card-item'>
              <View>预缴金余额：</View>
              <View>{info.inpBalance}</View>
            </View>
          </BkPanel>
          <View style='margin-top: 40rpx'>选择或输入充值金额：</View>
          <BkTabs block onTabChange={onMoneyChange} tabs={moneyTabs} style='margin: 40rpx 0;'></BkTabs>
          <View className='flex'>
            <View>手动输入金额：</View>
            <Input type='number' value={money} placeholder='' onInput={inputMoneyChange} style='border-bottom: 1rpx solid #ccc;'></Input>
            <View>元</View>
          </View>
          <View style='padding: 40rpx'>
            <BkButton title='缴纳押金' onClick={handlePay} disabled={busy}></BkButton>
          </View>
        </View>
      }
      {
        tabValue === 'record' &&
        <View style='padding: 0 40rpx;'>
          {
            list.length 
            ? <View>
                {
                  list.map((item,index) => <DepositListItem item={item} key={index} onClickItem={onClickItem}></DepositListItem>)
                }
              </View>
            : <BkLoading msg='暂无记录' />
          }
        </View>
      }
    </View>
  )
}