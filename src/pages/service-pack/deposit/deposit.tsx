import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { Input, View } from '@tarojs/components'
import { useState } from 'react'
import { 
  getRegisterDepositOrderList,
  getRegisterDepositOrderDetail,
  fetchRegisterDepositPayParams,
  cancelRegisterDepositOrder,
  getRegisterDepositOrderStatus,
  TaroRequestPayment,
  fetchCardDetail
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
import { CardsHealper } from '@/utils/cards-healper'

export default function BindingCard() {
  const [resultVisible,setResultVisible] = useState(false)
  const [payResult,setPayResult] = useState(PAY_RESULT.SUCCESS)
  const [card,setCard] = useState(null)
  const [tabValue,setTabValue] = useState('deposit')
  const [money,setMoney] = useState(null)
  const [busy,setBusy] = useState(false)
  const [list,setList] = useState([])
  const [showDetail,setShowDetail] = useState(false)
  // const [orderNo,setOrderNo] = useState('')
  const [balance,setBalance] = useState(null)
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
      title: '挂号费充值',
      value: 'deposit'
    },
    {
      title: '充值记录',
      value: 'record'
    }
  ]
  const moneyTabs = [
    {
      title: '10 元',
      value: 10
    },
    {
      title: ' 20元 ',
      value: 20
    },
    {
      title: ' 50元  ',
      value: 50
    }
  ]
  Taro.useDidShow(() => {
    // 特殊处理 金沙洲医院诊疗卡号和住院卡绑定
    const defaultCard = CardsHealper.getDefault()
    if(defaultCard){
      setCard(defaultCard)
      getAccountBalance(defaultCard)
    }
  })
  const getAccountBalance = (defaultCard) => {
    setBusy(true)
    fetchCardDetail({cardNo: defaultCard.cardNo}).then(res => {
      if(res.resultCode === 0 && res.data){
        const {accountBalance} = res.data
        setBalance(accountBalance)
      }else{
        modalService({title: '获取余额失败',content: res.message})
      }
      setBusy(false)
    })
  }
  
  const getList = () => {
    setBusy(true)
    getRegisterDepositOrderList({cardNo: card.cardNo}).then(res => {
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        toastService({title: res.message})
        setList([])
      }
      setBusy(false)
    })
  }
  
  const onTabChange = (e,value) => {
    // console.log('tabchange',e,value)
    setTabValue(value)
    if(value === 'record'){
      getList()
    }
  }
  const onMoneyChange = (e,value) => {
    setMoney(value)
  }
  const inputMoneyChange = (e) => {
    setMoney(e.detail.value)
  }
  const handlePay = async() => {
    
    if(!money){
      toastService({title: '请输入金额'})
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
        getAccountBalance(card)
        handlePaySuccess()
        loadingService(false)
      }).catch(() => {
        setBusy(false);setResultVisible(true);setPayResult(PAY_RESULT.FAIL)
        loadingService(false)
      })
    }).catch(err => {
      toastService({title: '您已取消支付',onClose:()=>loadingService(false)})
      cancelOrder(response.data.orderNo)
      setBusy(false)
    })
  }
  const cancelOrder = async (orderNo: string) => {
    await cancelRegisterDepositOrder({orderNo})
  }
  const handlePaySuccess = () => {
    setBusy(false); setResultVisible(true);setPayResult(PAY_RESULT.SUCCESS);setMoney(null)
  }
  const checkOrderStatus = (id: string) => {
    return new Promise((resolve,reject) => {
      getRegisterDepositOrderStatus({orderNo:id}).then(res => {
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
      fetchRegisterDepositPayParams({
        cardNo: card.cardNo,
        money: money,
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
    getRegisterDepositOrderDetail({orderNo: data.orderNo as string}).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setDepositItem(res.data[0])
      }
    }).catch(err => {
      loadingService(false)
      modalService({title: '获取详情失败',content: JSON.stringify(err)})
    })
  }
  const onConfirm = () => {
    setShowDetail(false)
  }
  return(
    <View>
      <ResultPage type={payResult} visible={resultVisible}>
        <BkButton title='返回' style='margin: 40rpx;' onClick={() => {setResultVisible(false)}} />
      </ResultPage>
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
          {
            (balance || balance == 0) ?
            <BkPanel >
              <View className='deposit-title'>就诊卡余额：</View>
              <View className='deposit-price'>{balance}元</View>
            </BkPanel>
            :
            <BkLoading loading={busy}></BkLoading>
          }
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
        <View style='padding: 40rpx 40rpx 0;'>
          {
            list.length 
            ? <View>
                {
                  list.map((item,index) => <DepositListItem item={item} key={index} onClickItem={onClickItem}></DepositListItem>)
                }
              </View>
            : <BkLoading loading={busy} msg='暂无记录' />
          }
        </View>
      }
    </View>
  )
}