import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View,Image } from '@tarojs/components'
import { useRouter , useDidShow, useReady } from '@tarojs/taro'
import { 
  createPaymentOrder, 
  fetchPaymentDetail, 
  subscribeService, 
  PayOrderParams, 
  handlePayment, 
  fetchPaymentOrderStatus, 
  cancelPayment, 
  fetchPaymentOrderDetailByQRCode,
  fetchPaymentOrderInvoice,
  TaroNavToZhongXun,
  handleHeSuanRefund
} from '@/service/api'
import cardsHealper from '@/utils/cards-healper'
import './payment-detail.less'
import BkPanel from '@/components/bk-panel/bk-panel'
import { useState } from 'react'
import BkButton from '@/components/bk-button/bk-button'
import sighPng from '@/images/icons/sigh.png'
import { onetimeTemplates } from '@/utils/templateId'
import SubscribeNotice from '@/components/subscribe-notice/subscribe-notice'
import { orderPayType_CN, orderStatus_EN, pactCode_EN, payStatus_EN } from '@/enums/index'
import { toastService } from '@/service/toast-service'
import { requestTry } from '@/utils/retry'
import ResultPage from '@/components/result-page/result-page'
import custom from '@/custom/index'

enum resultEnum {
  default = '',
  success = 'success',
  fail = 'fail'
}
interface OrderInfoParams {
  orderId: string,
  clinicNo: string,
  createdTime?: string,
  orderDate: string,
  recipeSeq: string,
  orderDept: string,
  orderDoctor: string,
  orderType: orderPayType_CN | string,
  prescMoney: string,
  serialNo: string,
  payState?: payStatus_EN
}
// 注意进入页面场景有3：
// 1-从缴费列表进入；2-从订单列表进入；3-扫码进入
export default function PaymentDetail() {
  const featConfig = custom.feat
  const router = useRouter()
  const params = router.params
  const card = cardsHealper.getDefault()
  const [busy,setBusy] = useState(false)
  let orderInfo: OrderInfoParams = {
    orderId: '',
    clinicNo: '',
    orderDate: '',
    recipeSeq: '',
    orderDept: '',
    orderDoctor: '',
    orderType: orderPayType_CN.自费,
    prescMoney: '',
    serialNo: '',
    payState: payStatus_EN.unpay
  }
  let fromList = null
  let scanParams = null
  if(params.orderInfo){
    orderInfo = JSON.parse(params.orderInfo)
    fromList = orderInfo.orderId ? true : false
  }else{
    const {cardNo,clinicNo,patientId} = params
    scanParams = {cardNo, clinicNo, patientId}
  }
  
  const [_orderId,setOrderId] = useState('')
  const [list,setList] = useState([])
  const [payResult,setPayResult] = useState(resultEnum.default)
  const [payResultMsg,setPayResultMsg] = useState('')
  const [showNotice,setShowNotice] = useState(false)
  const dealWithPay = async(type) => {
    const tempIds = onetimeTemplates.payment()
    const subsRes = await subscribeService(tempIds)
    if(!subsRes.result){
      setShowNotice(true)
      return
    }
    setBusy(true)
    if(fromList){
      // 从订单列表进入的，直接用orderId支付，不需再创建订单
      payOrderById(orderInfo.orderId,type)
    }else{
      createPaymentOrder(buildPaymentParams(type)).then(res => {
        console.log('create order',res);
        if(res.resultCode === 0){
          setOrderId(res.data.orderId)
          payOrderById(res.data.orderId,type)
        }else{
          toastService({title: '创建订单失败' + res.message})
        }
      })
    }
    
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
  
  const payOrderById = (id: string,payType: string) => {
    Taro.showLoading({title: '支付中……'})
    handlePayment({orderId: id, payType: payType}).then(res => {
      if(res.popUpCode === 3){
        navToOtherWeapp(res.message)
      }else if(res.resultCode === 0 && !res.data){
        setPayResult(resultEnum.success)
        setPayResultMsg('提交订单成功，还未支付')
      }else{
        console.log('提交订单：',res.data)
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
              setPayResult(resultEnum.fail)
              // setPayResultMsg(err.errMsg)
              setPayResultMsg('您已取消缴费')
              // 取消缴费
              cancelPayment({orderId:id})
              setBusy(false)
            },
            success: (result) => {
              requestTry(checkOrderStatus.bind(null,id)).then(checkRes => {
                setPayResult(resultEnum.success)
                setPayResultMsg('缴费成功')
              }).catch(()=>{
                setPayResult(resultEnum.fail)
                setPayResultMsg('缴费失败，所缴金额将原路退回')
                setBusy(false)
              })
            }
          })
        }
        
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }
  const navToOtherWeapp = (content:string) => {
    Taro.showModal({
      content:content,
      showCancel: false,
      success: () => {
        Taro.navigateToMiniProgram({
          appId: 'wxe1022cca111d18be',
          path: 'pages/cert/bind/bind?from=AAHTx-oeOuLWz2nBYKez06kN&cityid=440100',
          success() {
            console.log('open success');
          }
        })
      }
    })
  }
  const buildPaymentParams = (type: orderPayType_CN) => {
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
  const showInvoice = (item) => {
    Taro.showLoading({title: '加载中……',mask:true})
    fetchPaymentOrderInvoice({serialNo: item.serialNo}).then(res => {
      if(res.resultCode === 0){
        const invoiceUrl = res.data.invoiceUrl
        Taro.setStorageSync('webViewSrc',invoiceUrl)
        Taro.navigateTo({url: '/pages/web-view-page/web-view-page'})
      }else{
        toastService({title: '获取电子发票失败：' + res.message})
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }
  const handleClickNavitator = (execRoom) => {
    TaroNavToZhongXun(execRoom)
  }
  const handleCancel = () => {
    Taro.showLoading({title: '取消中……',mask:true})
    setBusy(true)
    handleHeSuanRefund({orderId: orderInfo.orderId}).then(res => {
      if(res.resultCode === 0){
        toastService({title: '取消成功', onClose: () => {Taro.navigateBack()}})
      }else{
        toastService({title: '取消失败：' + res.message})
      }
    }).finally(() => {
      setBusy(false)
      Taro.hideLoading()
    })
  }
  useDidShow(() => {
    if(_orderId){
      setBusy(true)
      Taro.showLoading({title: '正在查询订单状态'})
      requestTry(checkOrderStatus.bind(null,_orderId)).then(checkRes => {
        setPayResult(resultEnum.success)
        setPayResultMsg('缴费成功')
      }).catch(()=>{
        setPayResult(resultEnum.fail)
        setPayResultMsg('缴费失败，所缴金额将原路退回')
        setBusy(false)
      setOrderId('')
      }).finally(() => { setOrderId('');Taro.hideLoading() })
    }
  })
  useReady(() => {
    Taro.showLoading({title: '加载中……'})
    if(scanParams){
      fetchPaymentOrderDetailByQRCode(scanParams).then(res => {
        // 扫码进入的因接口返回字段不同╮(╯▽╰)╭，需要重新对齐数据
        if(res.resultCode === 0){
          const data = res.data
          orderInfo = {
            orderId: data.orderId,
            clinicNo: data.clinicNo,
            orderDate: data.orderDate,
            recipeSeq: data.recipeSeq,
            orderDept: data.orderDept,
            orderDoctor: data.orderDoctor,
            orderType: data.pactCode === pactCode_EN.selfPay ? orderPayType_CN.自费 : orderPayType_CN.医保 ,
            prescMoney: data.sumMoney,
            serialNo: data.serialNo
          }
        }else{
          toastService({title: '获取数据失败:' + res.message})
        }
      })
    }else{
      fetchPaymentDetail({
        clinicNo: orderInfo.clinicNo,
        cardNo: card.cardNo,
        recipeSeq: orderInfo.recipeSeq,
        patientId: card.patientId
      }).then(res => {
        // console.log('fetch detail',res);
        if(res.resultCode === 0){
          setList(res.data.billDetails)
        }else{
          toastService({title: '获取数据失败:' + res.message})
        }
      }).finally(() => {
        Taro.hideLoading()
      })
    }
    
  })
  if(payResult === resultEnum.default){
    return(
      <View className='payment-detail'>
        <SubscribeNotice show={showNotice}></SubscribeNotice>
        <View className='payment-detail-header'>
          <View className='payment-detail-header-price'>￥{orderInfo.prescMoney}</View>
          <View className='payment-detail-header-text'>缴费详情</View>
        </View>
        <BkPanel>
          <View className='flex'>
            <View className='flat-title'>流水号</View>
            <View className='payment-detail-item-text'>{orderInfo.clinicNo}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>姓名</View>
            <View className='payment-detail-item-text'>{card.name}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>开单科室</View>
            <View className='payment-detail-item-text'>{orderInfo.orderDept}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>开单医生</View>
            <View className='payment-detail-item-text'>{orderInfo.orderDoctor}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>开单时间</View>
            <View className='payment-detail-item-text'>{orderInfo.orderDate}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>总金额</View>
            <View className='payment-detail-item-text price-color'>{orderInfo.prescMoney} 元</View>
          </View>
          {
            orderInfo.serialNo && 
            <View className='flex'>
              <View className='flat-title'>电子发票</View>
              <View className='payment-detail-item-text clickable' onClick={showInvoice.bind(null,orderInfo)}>点击查看</View>
            </View>
          }
          {
            orderInfo.orderDept === '新冠疫苗/核酸' && orderInfo.payState === payStatus_EN.paid && 
            <View className='flex'>
              <BkButton title='取消预约' theme='danger' disabled={busy} onClick={handleCancel} />
            </View>
          }
        </BkPanel>
        {
          list.length > 0 &&
          <BkPanel style='margin-top: 40rpx'>
            {
              list.map((item,index) => 
                <View className='payment-detail-medicine' key={index}>
                  <View className='payment-detail-medicine-title'>{item.itemName}</View>
                  <View className='payment-detail-medicine-item'>
                    <text>类型：</text>
                    <text>{item.type}</text>
                  </View>
                  {
                    item.execRoomName &&
                    <View className='payment-detail-medicine-item'>
                      <text>执行科室：</text>
                      <text>{item.execRoomName}</text>
                    </View>
                  }
                  <View className='payment-detail-medicine-item'>
                    <text>数量：</text>
                    <text>{item.account}</text>
                    <text>&nbsp;&nbsp;&nbsp;&nbsp;</text>
                    <text>单位：</text>
                    <text>{item.unit}</text>
                  </View>
                  <View className='payment-detail-medicine-item'>
                    <text>单价：</text>
                    <text>{item.itemPrice}元</text>
                    <text>&nbsp;&nbsp;&nbsp;&nbsp;</text>
                    <text>小计：</text>
                    <text>{item.money}元</text>
                  </View>
                  {
                    featConfig.hospitalNavigation && item.execRoom && 
                    <View className='payment-detail-medicine-item'>
                      <text>院内导航：</text>
                      <text className='clickable' onClick={handleClickNavitator}>一键导航</text>
                    </View>
                  }
                </View>  
              )
            }
          </BkPanel>
        }
        <View className='flex-around' style='padding: 40rpx'>
          <BkButton title='微信支付' icon='icons/wechat.png' theme='info' disabled={busy} onClick={dealWithPay.bind(null,orderPayType_CN.自费)} />
          {
            orderInfo.orderType === 'YiBao' &&
            <BkButton title='医保支付' icon='icons/card.png' theme='primary' disabled={busy} onClick={dealWithPay.bind(null,orderPayType_CN.医保)} />
          }
        </View>
        <View className='payment-detail-tips'>
          <View className='payment-detail-tips-item'>
            <Image src={sighPng} />
            <text>1、缴费提供微信支付 </text>
          </View>
          <View className='payment-detail-tips-item'>
            <Image src={sighPng} />
            <text>2、处方24小时有效</text>
          </View>
          <View className='payment-detail-tips-item'>
            <Image src={sighPng} />
            <text>3、目前微信支付只提供自费缴费，如需医保、公费记 账请移步到各楼层人工缴费窗口缴纳</text>
          </View>
          <View className='payment-detail-tips-item'>
            <Image src={sighPng} />
            <text>4、需要打印发票和费用清单的请到一楼大厅自助机自行打印 </text>
          </View>
        </View>
      </View>
    )
  }else{
    return (
      <ResultPage type={payResult} remark={payResultMsg}>
        <View style='padding: 60rpx'>
          {
            payResult === resultEnum.fail &&
            <BkButton theme='info' title='重试' onClick={() => setPayResult(resultEnum.default)}></BkButton>
          }
          {
            payResult === resultEnum.success &&
            <View>
              <BkButton theme='primary' title='返回首页' onClick={() => Taro.navigateTo({url: '/pages/index/index'})} />
              <BkButton theme='info' title='查看订单' onClick={() => Taro.navigateTo({url: '/pages/payment-pack/order-list/order-list'})} />
            </View>
          }
        </View>
      </ResultPage>
    )
  }
}