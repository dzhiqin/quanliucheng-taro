import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View,Image } from '@tarojs/components'
import { useRouter , useDidShow, useReady } from '@tarojs/taro'
import { 
  createPaymentOrder, 
  fetchPaymentDetailFromHis, 
  TaroSubscribeService, 
  PayOrderParams, 
  handlePayment, 
  fetchPaymentOrderStatus, 
  cancelPayment, 
  fetchPaymentOrderDetailByQRCode,
  fetchPaymentOrderInvoice,
  fetchPaymentOrderDetail,
  TaroNavToZhongXun,
  handleHeSuanRefund,
  TaroNavToYiBao,
  login,
  createPaymentOrderByQRCode,
  TaroNavToMiniProgram
} from '@/service/api'
import { CardsHealper } from '@/utils/cards-healper'
import './payment-detail.less'
import { useState } from 'react'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import sighPng from '@/images/icons/sigh.png'
import SubscribeNotice from '@/components/subscribe-notice/subscribe-notice'
import { PAY_TYPE_CN, ORDER_STATUS_EN, PAY_STATUS_EN, ORDER_TYPE_CN, PAYMENT_FROM } from '@/enums/index'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import { requestTry } from '@/utils/retry'
import ResultPage from '@/components/result-page/result-page'
import {custom} from '@/custom/index'
import { getQueryValue } from '@/utils/tools'

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
  orderType: ORDER_TYPE_CN | string,
  prescMoney: string,
  serialNo: string,
  payState?: PAY_STATUS_EN,
  cardNo?: string,
  idenNo?: string,
  patientName?: string,
  openId?: string,
  patientId?: string,
  psnNo?: string,
  medType?: string,
  mdtrtId?: string,
  insuType?:string,
  mdtrtMode?: string,
  hospitalCode?: string,
  pactCode?: string,
  feeTypeId?: string
}
// 注意进入页面场景有3：
// 1-从缴费列表进入；2-从订单列表进入；3-扫码进入
export default function PaymentDetail() {
  const featConfig = custom.feat
  const router = useRouter()
  const params = router.params
  const scene = params.scene ? decodeURIComponent(params.scene) : null
  const card = CardsHealper.getDefault()
  const [busy,setBusy] = useState(false)
  const [orderInfo,setOrderInfo] = useState({} as OrderInfoParams)
  let orderInfoFromList = null
  let scanParams = null
  let from: PAYMENT_FROM = null
  if(scene){
    from = PAYMENT_FROM.scanQRCode
    scanParams = { preQRCodePayId: getQueryValue(scene, 'prepayid')}
  }else{
    from = params.from as PAYMENT_FROM
    orderInfoFromList = JSON.parse(params.orderInfo)
  }
  const [_orderId,setOrderId] = useState('')
  const [list,setList] = useState([])
  const [payResult,setPayResult] = useState(resultEnum.default)
  const [payResultMsg,setPayResultMsg] = useState('')
  const [showNotice,setShowNotice] = useState(false)
  const dealWithPay = async(type) => {
    const subsRes = await TaroSubscribeService(custom.onetimeSubscribe.paySuccessNotice,custom.onetimeSubscribe.refundNotice)
    if(!subsRes.result){
      setShowNotice(true)
      return
    }
    setBusy(true)
    if(from === PAYMENT_FROM.orderList){
      // 从订单列表进入的，直接用orderId支付，不需再创建订单
      payOrderById(orderInfoFromList.orderId,type)
    }else if(from === PAYMENT_FROM.scanQRCode){
      createPaymentOrderByQRCode(buildPaymentParamsQRCode(type)).then(res => {
        if(res.resultCode === 0){
          setOrderId(res.data.orderId)
          payOrderById(res.data.orderId,type)
        }else{
          // toastService({title: '创建订单失败' + res.message})
          Taro.showToast({
            title: '创建订单失败' + res.message,
            icon: 'none'
          })
          setBusy(false)
        }
      })
    }else if(from === PAYMENT_FROM.paymentList) {
      createPaymentOrder(buildPaymentParams(type)).then(res => {
        if(res.resultCode === 0){
          setOrderId(res.data.orderId)
          payOrderById(res.data.orderId,type)
        }else{
          // toastService({title: '创建订单失败' + res.message})
          Taro.showToast({
            title: '创建订单失败' + res.message,
            icon: 'none'
          })
          setBusy(false)
        }
      })
    }
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
  
  const payOrderById = (id: string,payType: string) => {
    Taro.showLoading({title: '支付中……'})
    handlePayment({orderId: id, payType: Number(payType)})
    .then(res => {
      if(res.data.jumpUrl && res.data.appId){
        loadingService(false)
        Taro.navigateToMiniProgram({
          appId: res.data.appId,
          path: res.data.jumpUrl
        })
        return
      }
      if(res.resultCode === 0 && !res.data){
        setPayResult(resultEnum.success)
        setPayResultMsg('提交订单成功，还未支付')
        loadingService(false)
      }else if(res.resultCode ===1){
        setBusy(false)
        // toastService({title: res.message})
        modalService({
          content: res.message,
          showCancel: false
        })
      }else{
        const {nonceStr, paySign, signType, timeStamp, pay_appid, pay_url} = res.data
        if(payType === PAY_TYPE_CN.医保 && pay_url){
          loadingService(true,'正在跳转')
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
              // console.log('request payment fail',err);
              setPayResult(resultEnum.fail)
              setPayResultMsg('您已取消缴费')
              // 取消缴费
              cancelPayment({orderId:id})
              setBusy(false)
              loadingService(false)
            },
            success: (result) => {
              loadingService(false)
              loadingService(true,'正在查询')
              requestTry(checkOrderStatus.bind(null,id))
              .then(checkRes => {
                setPayResult(resultEnum.success)
                setPayResultMsg('缴费成功')
              })
              .catch(()=>{
                setPayResult(resultEnum.fail)
                setPayResultMsg('缴费失败，所缴金额将原路退回')
                setBusy(false)
              })
              .finally(() => {
                loadingService(false)
              })
            }
          })
        }
        
      }
    }).catch((err) => {
      console.error('pay fail',err);
      setBusy(false)
      toastService({title: '支付失败'})
    })
  }
  const navToOtherWeapp = (content:string) => {
    Taro.showModal({
      content:content,
      showCancel: false,
      success: () => {
        TaroNavToYiBao(() =>{})
      }
    })
  }
  const buildPaymentParamsQRCode = (type: PAY_TYPE_CN) => {
    const paymentParams = {
      ...orderInfo,
      // orderType: orderInfo.pactCode,
      orderType: type === PAY_TYPE_CN.医保 ? ORDER_TYPE_CN.医保单 : ORDER_TYPE_CN.自费单,
      prescFee: orderInfo.prescMoney,
      payType: type,
      openId: Taro.getStorageSync('openId'),
    }
    return paymentParams
  }
  const buildPaymentParams = (type: PAY_TYPE_CN) => {
    const paymentParams: PayOrderParams ={
      patientId: card.patientId,
      clinicNo: orderInfoFromList.clinicNo,
      recipeSeq: orderInfoFromList.recipeSeq,
      orderType: type === PAY_TYPE_CN.医保 ? ORDER_TYPE_CN.医保单 : ORDER_TYPE_CN.自费单,
      prescFee: orderInfoFromList.prescMoney,
      orderDept: orderInfoFromList.orderDept,
      orderDoctor: orderInfoFromList.orderDoctor,
      orderDate: orderInfoFromList.orderDate,
      payType: type
    }
    return paymentParams
  }
  const showInvoice = (item) => {
    // 特殊处理
    if(custom.hospName === 'jszyy'){
      TaroNavToMiniProgram({appId: 'wx8e0b79a7f627ca18', path: 'pages/index/index?agencyCode=ccd5fa6bc02f4420a131d6d46e165c71'})
      return
    }
    // if(custom.hospName === 'lwzxyy'){
    //   TaroNavToMiniProgram({appId: 'wx8e0b79a7f627ca18', path: 'pages/index/index'})
    //   return
    // }
    Taro.showLoading({title: '加载中……',mask:true})
    fetchPaymentOrderInvoice({serialNo: item.serialNo}).then(res => {
      if(res.resultCode === 0){
        loadingService(false)
        const invoiceUrl = res.data.invoiceUrl
        Taro.setStorageSync('webViewSrc',invoiceUrl)
        // Taro.navigateTo({url: '/pages/web-view-page/web-view-page'})
        // 跳转到外部小程序
        const pathParams = `pages/invoiceDisplayDWDZ/invoiceDisplayDWDZ?q=${encodeURIComponent(invoiceUrl)}`
        TaroNavToMiniProgram({
          appId: 'wx8e0b79a7f627ca18',
          path: pathParams
        })
      }else{
        toastService({title: '获取电子发票失败：' + res.message})
      }
    }).catch(() => {
      Taro.hideLoading()
    })
  }
  const handleClickNavitator = (execRoom) => {
    TaroNavToZhongXun(execRoom)
  }
  const handleCancel = () => {
    Taro.showLoading({title: '取消中……',mask:true})
    setBusy(true)
    const orderId = orderInfo.orderId || orderInfoFromList.orderId
    handleHeSuanRefund({orderId})
    .then(res => {
      if(res.resultCode === 0){
        toastService({title: '取消成功', onClose: () => {Taro.navigateBack()}})
      }else{
        toastService({title: '取消失败：' + res.message})
      }
    })
    .finally(() => {
      setBusy(false)
    })
  }
  const handleLogin = () => {
    return new Promise((resolve) => {
      Taro.login({
        success: res => {
          const { code } = res
          login({code})
          .then((result: any) => {
            if(result.statusCode === 200){
              const { data: {data} } = result
              Taro.setStorageSync('token',data.token)
              Taro.setStorageSync('openId',data.openId)
              resolve({result: true, data: {...data}})
            }else{
              resolve({result: false, message: result.data.message})
            }
          })
          .catch(err => {
            resolve({result: false, data: err, message: '登陆失败'})
          })
        }
      })
    })
  }
  useDidShow(() => {
    if(_orderId){
      setBusy(true)
      loadingService(true,'正在查询……')
      requestTry(checkOrderStatus.bind(null,_orderId))
      .then(checkRes => {
        setPayResult(resultEnum.success)
        setPayResultMsg('缴费成功')
      })
      .catch(()=>{
        setPayResult(resultEnum.fail)
        setPayResultMsg('缴费失败，所缴金额将原路退回')
        setBusy(false)
      })
      .finally(() => { 
        setOrderId('');
        loadingService(false)
      })
    }
  })
  const getOrderInfoByQRCode = () => {
    fetchPaymentOrderDetailByQRCode(scanParams).then(res => {
      // 扫码进入的因接口返回字段不同╮(╯▽╰)╭，需要重新对齐数据
      if(res.resultCode === 0){
        loadingService(false)
        const data = res.data
        setOrderInfo({
          ...data,
          orderId: data.orderId ? data.orderId : '',
          orderType: data.pactCode,
          prescMoney: data.sumMoney,
          payState: PAY_STATUS_EN.unpay,
          feeTypeId: data.feeTypeId
        })
        const param = {
          cardNo: data.cardNo,
          clinicNo: data.clinicNo,
          recipeSeq: data.recipeSeq,
          patientId: data.patientId
        }
        getOrderDetailFromHis(param)
      }else{
        toastService({title: '获取数据失败:' + res.message})
      }
    })
  }
  const getOrderDetailFromHis = (param: {
    cardNo: string,
    clinicNo: string,
    recipeSeq: string,
    patientId: string
  }) => {
    fetchPaymentDetailFromHis(param).then(res => {
      if(res.resultCode === 0){
        setList(res.data.billDetails)
      }else{
        toastService({title: '获取数据失败:' + res.message})
      }
    })
  }
  const getOrderDetailFromData = (param:{
    billOrderId: string
  }) => {
    fetchPaymentOrderDetail(param).then(res => {
      if(res.resultCode === 0){
        loadingService(false)
        setList(res.data)
      }else{
        toastService({title: '获取详情失败'})
      }
    })
    
  }
  useReady(async () => {
    if(from === PAYMENT_FROM.scanQRCode){
      loadingService(true)
      const openId = Taro.getStorageSync('openId')
      if(!openId){
        // 重新登陆获取openid
        const loginRes:any = await handleLogin()
        if(!loginRes.result){
          toastService({title: loginRes.message})
          return
        }
      }
      getOrderInfoByQRCode()
    }else if(from === PAYMENT_FROM.paymentList){
      const param = {
        cardNo: orderInfoFromList.cardNo,
        clinicNo: orderInfoFromList.clinicNo,
        recipeSeq: orderInfoFromList.recipeSeq,
        patientId: card.patientId
      }
      getOrderDetailFromHis(param)
    }else if(from === PAYMENT_FROM.orderList){
      const param = {
        billOrderId: orderInfoFromList.orderId
      }
      getOrderDetailFromData(param)
    }
  })
  if(payResult === resultEnum.default){
    return(
      <View className='payment-detail'>
        <SubscribeNotice show={showNotice}></SubscribeNotice>
        <View className='payment-detail-header'>
          <View className='payment-detail-header-price'>￥{orderInfoFromList ? orderInfoFromList.prescMoney : orderInfo.prescMoney}</View>
          <View className='payment-detail-header-text'>缴费详情</View>
        </View>
        <BkPanel>
          <View className='flex'>
            <View className='flat-title'>流水号</View>
            <View className='payment-detail-item-text'>{orderInfoFromList ? orderInfoFromList.clinicNo : orderInfo.clinicNo}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>姓名</View>
            <View className='payment-detail-item-text'>{orderInfoFromList ? card.name : orderInfo.patientName}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>开单科室</View>
            <View className='payment-detail-item-text'>{orderInfoFromList ? orderInfoFromList.orderDept : orderInfo.orderDept}</View>
          </View>
          {
            ((orderInfoFromList && orderInfoFromList.orderDoctor) || (orderInfo && orderInfo.orderDoctor)) &&
            <View className='flex'>
              <View className='flat-title'>开单医生</View>
              <View className='payment-detail-item-text'>{orderInfoFromList ? orderInfoFromList.orderDoctor : orderInfo.orderDoctor}</View>
            </View>
          }
          
          <View className='flex'>
            <View className='flat-title'>开单时间</View>
            <View className='payment-detail-item-text'>{orderInfoFromList ? orderInfoFromList.orderDate : orderInfo.orderDate}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>总金额</View>
            <View className='payment-detail-item-text price-color'>{orderInfoFromList ? orderInfoFromList.prescMoney : orderInfo.prescMoney} 元</View>
          </View>
          {
            orderInfoFromList && orderInfoFromList.oweMoney &&
            <View className='flex'>
              <View className='flat-title'>欠费金额</View>
              <View className='payment-detail-item-text price-color'>{orderInfoFromList.oweMoney}</View>
            </View>
          }
          {
            orderInfoFromList && orderInfoFromList.serialNo && 
            <View className='flex'>
              <View className='flat-title'>电子发票</View>
              <View className='payment-detail-item-text clickable' onClick={showInvoice.bind(null,orderInfoFromList)}>点击查看</View>
            </View>
          }
          {
            orderInfo && orderInfo.orderDept === '新冠疫苗/核酸' && orderInfo.payState === PAY_STATUS_EN.paid && 
            <View className='flex-justify-center'>
              <BkButton title='取消预约' theme='danger' disabled={busy} onClick={handleCancel} />
            </View>
          }
          {
            orderInfoFromList && orderInfoFromList.orderDept === '新冠疫苗/核酸' && orderInfoFromList.payState === PAY_STATUS_EN.paid && 
            <View className='flex-justify-center'>
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
        {
          Object.keys(orderInfo).length > 0 && 
          <View className='flex-around' style='padding: 40rpx'>
            {
              orderInfo.payState === PAY_STATUS_EN.unpay &&
              <BkButton title='微信支付' icon='icons/wechat.png' theme='info' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.微信)} />
            }
            {
              orderInfo.payState === PAY_STATUS_EN.unpay && orderInfo.orderType === ORDER_TYPE_CN.医保单 &&
              <BkButton title='医保支付' icon='icons/card.png' theme='primary' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.医保)} />
            }
          </View>
        }
        {
          orderInfoFromList && orderInfoFromList.orderState === ORDER_STATUS_EN.unpay &&
          <View className='flex-around' style='padding: 40rpx'>
            {
              orderInfoFromList.payState === PAY_STATUS_EN.unpay &&
              <BkButton title='微信支付' icon='icons/wechat.png' theme='info' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.微信)} />
            }
            {
              orderInfoFromList.payState === PAY_STATUS_EN.unpay && orderInfoFromList.orderType === ORDER_TYPE_CN.医保单 &&
              <BkButton title='医保支付' icon='icons/card.png' theme='primary' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.医保)} />
            }
          </View>
        }
        {
          orderInfoFromList && custom.paymentOrderPage.tackingMedicineGuide && orderInfoFromList.orderState !== ORDER_STATUS_EN.unpay &&
          <BkButton title='取药指引' onClick={() => Taro.navigateTo({url: `/pages/payment-pack/medicine-guide/medicine-guide?orderId=${orderInfoFromList.orderId}`})} style='margin-top: 20rpx;' />
        }
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
      <ResultPage type={payResult} remark={payResultMsg} visible={!!payResult}>
        <View style='padding: 60rpx'>
          {
            payResult === resultEnum.fail &&
            <BkButton theme='info' title='重试' onClick={() => setPayResult(resultEnum.default)}></BkButton>
          }
          {
            payResult === resultEnum.success &&
            <View>
              <BkButton theme='primary' title='返回首页' onClick={() => Taro.switchTab({url: '/pages/index/index'})} style='margin-bottom: 40rpx' />
              <BkButton theme='info' title='查看订单' onClick={() => Taro.navigateTo({url: '/pages/payment-pack/order-list/order-list'})} />
            </View>
          }
        </View>
      </ResultPage>
    )
  }
}