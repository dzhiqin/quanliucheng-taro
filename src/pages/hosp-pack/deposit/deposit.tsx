import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { Input, View } from '@tarojs/components'
import { useState,useEffect } from 'react'
import { fetchInHospCards, getInHospInfo, getDepositOrderList,
  fetchDepositPayParams, 
  TaroRequestPayment,
  getDepositOrderStatus,
  getDepositOrderDetail
} from '@/service/api'
import SimpleModal from '@/components/simple-modal/simple-modal'
import BkTabs from '@/components/bk-tabs/bk-tabs'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import { loadingService, toastService } from '@/service/toast-service'
import BkNone from '@/components/bk-none/bk-none'
import './deposit.less'
import { ORDER_STATUS_EN } from '@/enums/index'
import { requestTry } from '@/utils/retry'
import DepositListItem from './deposit-list-item'
import BaseModal from '@/components/base-modal/base-modal'

const inHospStatusObj = {
  1: '在院',
  0: '不在院'
}
export default function BindingCard() {
  const [inCard,setInCard] = useState(null)
  const [tabValue,setTabValue] = useState('deposit')
  const [showModal,setShowModal] = useState(false)
  const [money,setMoney] = useState(null)
  const [busy,setBusy] = useState(false)
  const [list,setList] = useState([])
  const [showDetail,setShowDetail] = useState(false)
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
  Taro.useReady(() => {
    let card = Taro.getStorageSync('inCard')
    if(inCard){
      setInCard(card)
      getData(card)
    }else{
      fetchInHospCards().then(res => {
        if(res.resultCode === 0){
          if(res.data && res.data.length > 0){
            setShowModal(false)
            const defaultCard = res.data.find(i => i.isDefault) 
            Taro.setStorageSync('inCard',defaultCard)
            setInCard(defaultCard)
            getData(defaultCard)
          }else{
            setShowModal(true)
          }
        }
      })
    }
  })
  useEffect(() => {
    let card = Taro.getStorageSync('inCard')
    if(tabValue === 'deposit') return
    if(card){
      getList()
    }else{
      setShowModal(true)
    }
  },[tabValue])
  
  const getList = () => {
    getDepositOrderList({cardNo: inCard.cardNo}).then(res => {
      // console.log('order list',res);
      if(res.resultCode===0){
        setList(res.data)
      }
    })
  }
  const getData = (card) => {
    getInHospInfo({inCardNo: card.cardNo}).then(res => {
      if(res.resultCode ===  0){
        const {inDate, dateCount, inpStatus, inDept, payCount, inpBalance, registerId} = res.data
        setInfo({
          inDate,dateCount,
          inHospStatus: inHospStatusObj[inpStatus],
          inDept,payCount,inpBalance,registerId
        })
      }
    })
  }
  const handleConfirm = () => {
    Taro.navigateTo({url: '/pages/hosp-pack/binding-card/binding-card'})
  }
  const onTabChange = (e,value) => {
    // console.log('tabchange',e,value)
    setTabValue(value)
  }
  const onMoneyChange = (e,value) => {
    setMoney(value)
  }
  const inputMoneyChange = (e) => {
    setMoney(e.detail.value)
  }
  const handlePay = async() => {
    if(info.inHospStatus === '不在院'){
      toastService({title: '已出院，无法充值'})
      return
    }
    if(!money){
      toastService({title: '请输入金额'})
      return
    }
    let card = Taro.getStorageSync('inCard')
    if(!card){
      setShowModal(true)
      return
    }
    loadingService(true)
    setBusy(true)
    const response:any = await getDepositPayParams()
    if(!response.success) {
      toastService({title: '支付失败'+response.message})
      setBusy(false)
      return
    }
    // setOrderNo(response.data.orderNo)
    TaroRequestPayment(response.data.unifiedOrderResponse).then(res => {
      // console.log('payment res:',res);
      requestTry(checkOrderStatus.bind(null,response.data.orderNo)).then(checkRes => {
        toastService({title: '充值成功', onClose: () => {getData(card); setBusy(false)}})
      }).catch(() => {
        toastService({title: '充值失败，所缴金额将原路退回', onClose: () => {setBusy(false)}})
      })
    }).catch(err => {
      toastService({title: '您已取消支付'})
      setBusy(false)
    })
  }
  const checkOrderStatus = (id: string) => {
    return new Promise((resolve,reject) => {
      getDepositOrderStatus({orderNo:id}).then(res => {
        // console.log('getorderstatus',res);
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
        inCardNo: inCard.cardNo,
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
  return(
    <View>
      <SimpleModal msg='请先绑卡' show={showModal} onCancel={() => setShowModal(false)} onConfirm={handleConfirm} />
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
          <BkTabs block onTabChange={onMoneyChange} tabs={moneyTabs} style='margin: 20rpx 0;'></BkTabs>
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
            : <BkNone msg='暂无记录' />
          }
        </View>
      }
    </View>
  )
}