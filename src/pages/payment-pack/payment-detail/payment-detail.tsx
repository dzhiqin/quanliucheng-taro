import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View,Image } from '@tarojs/components'
import { useRouter , useDidShow, useReady, useDidHide } from '@tarojs/taro'
import { AtAccordion } from 'taro-ui'
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
  createPaymentOrderByQRCode,
  TaroNavToMiniProgram,
  fetchMedicineGuideList,
  TaroAliPayment,
  AlipaySubscribeService,
  TaroNavigateService,
  fetchBillOrderInfo,
  handleBillOrderRefund,
  handleAuthCode
} from '@/service/api'
import { CardsHealper } from '@/utils/cards-healper'
import './payment-detail.less'
import { useState } from 'react'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import sighPng from '@/images/icons/sigh.png'
import SubscribeNotice from '@/components/subscribe-notice/subscribe-notice'
import { PAY_TYPE_CN, ORDER_STATUS_EN, PAY_STATUS_EN, ORDER_TYPE_CN, PAYMENT_FROM, CARD_ACTIONS } from '@/enums/index'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import { requestTry } from '@/utils/retry'
import ResultPage from '@/components/result-page/result-page'
import {custom} from '@/custom/index'
import { getPrivacyName, getQueryValue, WEAPP, ALIPAYAPP } from '@/utils/tools'
import { reportCmPV_YL } from '@/utils/cloudMonitorHelper'
import Qrcode from 'qrcode'
import { getGlobalData, setGlobalData } from '@/utils/globalData'
import BkLoading from '@/components/bk-loading/bk-loading'
import wxLog from '@/utils/log.weapp'

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
  serialNo?: string,
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
  feeTypeId?: string,
  orderState?: ORDER_STATUS_EN,
  oweMoney?:string
}
// 注意进入页面场景有：
// 1-从缴费列表进入；2-从订单列表进入；3-扫码进入; 4-点击退款消息进入; 5-点击缴费成功消息进入from=orderList（入参和订单列表进入的一样）
export default function PaymentDetail() {
  const payButtonText = WEAPP ? '微信支付' : '支付宝支付'
  const featConfig = custom.feat
  const router = useRouter()
  const params = router.params
  const scene = params.scene ? decodeURIComponent(params.scene) : null
  const card = CardsHealper.getDefault()
  let preQRCodePayId = ''
  const from = React.useRef(PAYMENT_FROM.orderList) 
  const [busy,setBusy] = useState(false)
  const [loading,setLoading] = useState(true)
  if(scene){
    from.current = PAYMENT_FROM.scanQRCode
    preQRCodePayId = getQueryValue(scene, 'prepayid')
  }else if(params.orderId){
    // 特殊处理：带参数orderId默认是从退款消息进入页面
    from.current = PAYMENT_FROM.message
  }else{
    from.current = params.from as PAYMENT_FROM
  }
  const [orderInfo,setOrderInfo] = useState(() => {
    if(from.current === PAYMENT_FROM.scanQRCode || from.current === PAYMENT_FROM.message){
      return {} as OrderInfoParams
    }else{
      try{
        // 调试用
        if(custom.hospName === 'gy3ylw' && (getGlobalData('scene') === 1014 || getGlobalData('scene') === 1107) && custom.feat.wxLogger){
          wxLog.info(`从订阅消息进入小程序，页面入参：${JSON.stringify(params)}`)
          setGlobalData('scene','')
        }
        const orderInfoFromList = JSON.parse(params.orderInfo)
        return orderInfoFromList as OrderInfoParams
      }catch(err){
        console.error(err);
        modalService({title: '解析错误',content: params.orderInfo})
        return {} as OrderInfoParams
      }
    }
  })
  const [open,setOpen] = useState(true)
  const [qrcodeSrc,setQrcodeSrc] = useState('')
  console.log(`from=${from.current},scene=${scene}`)
  console.log('params ='+JSON.stringify(params))
  const [refundOrderId,setRefundOrderId] = useState(() => {
    if(from.current === PAYMENT_FROM.message){
      return params.orderId
    }else{
      return ''
    }
  })
  const [_orderId,setOrderId] = useState('')
  const [list,setList] = useState([])
  const [payResult,setPayResult] = useState(resultEnum.default)
  const [payResultMsg,setPayResultMsg] = useState('')
  const [showNotice,setShowNotice] = useState(false)
  const [medicineList,setMedicineList] = useState([])
  const [needFetchInfo,setFetchInfo] = useState(false) // 特殊处理：针对扫码进详情页但是未医保授权的情况，处理为先授权再根据needFetchInfo在授权结束后重新获取订单信息
  const handleSubscribe = async() => {
    let subRes
    if(WEAPP){
      subRes = await TaroSubscribeService(custom.subscribes.paySuccessNotice,custom.subscribes.refundNotice)
    }
    if(ALIPAYAPP){
      subRes = await AlipaySubscribeService(custom.subscribes.paySuccessNotice,custom.subscribes.orderCancelReminder)
    }
    return subRes
  }
  const dealWithPay = async(type) => {
    setBusy(true)
    const subRes:any = await handleSubscribe()
    if(!subRes.result){
      if(WEAPP){
        setShowNotice(true)
      }
      if(ALIPAYAPP){
        modalService({content: subRes.msg.message,title: '订阅消息失败'})
      }
      setBusy(false)
      loadingService(false)
      return
    }
    loadingService(true,'支付中')
    if(custom.yibao2.enable && type === PAY_TYPE_CN.医保){
      if(WEAPP){
        weChatYiBaoAuth()
        // 腾讯医保授权需要跳转到医保小程序，授权完成返回页面后在onshow里继续支付流程
        return
      }else if(ALIPAYAPP){
        const result:any = await alipayYiBaoAuth()
        if(!result.success){
          setBusy(false)
          loadingService(false)
          modalService({content: '医保授权失败'})
          return
        }
        const locationRes:any = await alipayGetLocation()
        if(!locationRes.success){
          setBusy(false)
          loadingService(false)
          return
        }
        handleYiBao2Payment()
        return
      }
    }
    if(from.current === PAYMENT_FROM.orderList){
      // 从订单列表进入的，直接用orderId支付，不需再创建订单
      payOrderById(orderInfo.orderId,type)
    }else{
      // 从待缴费列表或者扫码进入的，需要创建订单再支付
      handleCreatePaymentOrder(type).then((res:any) => {
        if(res.success){
          setOrderId(res.data.orderId)
          payOrderById(res.data.orderId, type)
        }else{
          loadingService(false)
          modalService({title: '创建订单失败', content: res.data.message})
          setBusy(false)
        }
      })
    }
  } 
  const handleCreatePaymentOrder = (payType) => {
    return new Promise((resolve) => {
      if(from.current === PAYMENT_FROM.paymentList){
        createPaymentOrder(buildPaymentParams(payType)).then(res => {
          if(res.resultCode === 0){
            resolve({success: true,data: {orderId: res.data.orderId}})
          }else if(res.resultCode === 4){
            resolve({success: false,data: {message: "需要医保支付授权", url: res.data}})
          }else{
            resolve({success:false,data: {message: res.message}})
          }
        })
      }else if(from.current === PAYMENT_FROM.scanQRCode){
        createPaymentOrderByQRCode(buildPaymentParamsQRCode(payType)).then(res => {
          if(res.resultCode === 0){
            resolve({success: true,data: {orderId: res.data.orderId}})
          }else{
            resolve({success: false,data: {message: res.message}})
          }
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
  
  const payOrderById = (id: string,payType: string) => {
    Taro.showLoading({title: '支付中……'})
    handlePayment({orderId: id, payType: Number(payType)})
    .then(res => {
      if(res.data?.jumpUrl && res.data?.appid){
        loadingService(false)
        Taro.navigateToMiniProgram({
          appId: res.data.appid,
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
        loadingService(false)
        modalService({content: res.message})
      }else{
        const {nonceStr, paySign, signType, timeStamp, pay_appid, pay_url,orderStr} = res.data
        // if(payType === PAY_TYPE_CN.医保){
        //   WEAPP && Taro.navigateToMiniProgram({appId: pay_appid, path: pay_url}) // 腾讯医保是跳转到医保小程序支付
        //   ALIPAYAPP && orderStr && handleAliPay({orderStr, orderId: id})  // 支付宝医保是调用预授权支付
        // }else{
        //   const tradeNo = getQueryValue(res.data.package, 'trade_no')
        //   WEAPP && handleWeappPay({nonceStr,paySign,timeStamp,package: res.data.package,signType,id})
        //   ALIPAYAPP && handleAliPay({tradeNo, orderId: id})
        // }
        if(payType === PAY_TYPE_CN.医保 && pay_url){
          if(ALIPAYAPP) {
            modalService({content: '跳转支付宝医保小程序联调中'})
            return
          }
          loadingService(true,'正在跳转')
          Taro.navigateToMiniProgram({
            appId: pay_appid,
            path: pay_url,
            success: () => Taro.hideLoading()
          })
        }else{
          if(WEAPP){
            handleWeappPay({nonceStr,paySign,timeStamp,package: res.data.package,signType,id})
          }
          if(ALIPAYAPP){
            const tradeNo = getQueryValue(res.data.package, 'trade_no')
            handleAliPay({tradeNo, orderId: id})
          }
        }
      }
    }).catch((err) => {
      setBusy(false)
      loadingService(false)
      modalService({title: '支付失败', content: JSON.stringify(err)})
    })
  }
  const handleWeappPay = (options: {nonceStr: string,paySign:string, timeStamp: string, package: string,signType:'HMAC-SHA256' | 'MD5', id: string }) => {
    Taro.requestPayment({
      nonceStr: options.nonceStr,
      paySign: options.paySign,
      timeStamp: options.timeStamp,
      package: options.package,
      signType: options.signType,
      fail: (err) => {
        // console.log('request payment fail',err);
        setPayResult(resultEnum.fail)
        setPayResultMsg('您已取消缴费')
        // 取消缴费
        cancelPayment({orderId:options.id})
        setBusy(false)
        loadingService(false)
      },
      success: (result) => {
        loadingService(false)
        loadingService(true,'正在查询')
        requestTry(checkOrderStatus.bind(null,options.id))
        .then(checkRes => {
          setPayResult(resultEnum.success)
          setPayResultMsg('缴费成功')
        })
        .catch((err)=>{
          setPayResult(resultEnum.fail)
          setPayResultMsg('缴费失败，所缴金额将原路退回'+err?.message)
          setBusy(false)
          loadingService(false)
        })
      }
    })
  }
  const handleAliPay = (options: {tradeNo?: string, orderId: string}) => {
    TaroAliPayment({tradeNo: options.tradeNo}).then((payRes:any) => {
      const data = JSON.parse(payRes.data)
      if(data.resultCode === '9000'){
        // loadingService(false)
        loadingService(true,'正在查询')
        requestTry(checkOrderStatus.bind(null,options.orderId)).then(() => {
          setPayResult(resultEnum.success)
          setPayResultMsg('缴费成功')
          loadingService(false)
        }).catch((err) => {
          setPayResult(resultEnum.fail)
          setPayResultMsg('缴费失败，所缴金额将原路退回'+err?.message)
          setBusy(false)
          loadingService(false)
        })
      }else{
        let msg = data.memo
        if(data.resultCode === '6001') msg = '您已取消支付'
        modalService({title: '支付失败',content: msg})
        loadingService(false)
        setPayResult(resultEnum.fail)
        cancelPayment({orderId:options.orderId})
        setBusy(false)
      }
    }).catch(err => {
      modalService({title: '调用支付失败',content: JSON.stringify(err)})
      loadingService(false)
      cancelPayment({orderId:options.orderId})
      setPayResult(resultEnum.fail)
      setBusy(false)
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
      patientId: card?.patientId,
      clinicNo: orderInfo.clinicNo,
      recipeSeq: orderInfo.recipeSeq,
      orderType: type === PAY_TYPE_CN.医保 ? ORDER_TYPE_CN.医保单 : ORDER_TYPE_CN.自费单,
      prescFee: orderInfo.prescMoney,
      orderDept: orderInfo.orderDept,
      orderDoctor: orderInfo.orderDoctor,
      orderDate: orderInfo.orderDate,
      payType: type,
      payAuthCode: getGlobalData('authCode') || '',
      longiLatitude: getGlobalData('longiLatitude') || ''
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
      loadingService(false)
      if(res.resultCode === 0){
        const invoiceUrl = res.data.invoiceUrl
        // 跳转到外部小程序
        const pathParams = `pages/invoiceDisplayDWDZ/invoiceDisplayDWDZ?q=${encodeURIComponent(invoiceUrl)}`
        TaroNavToMiniProgram({
          appId: 'wx8e0b79a7f627ca18',
          path: pathParams
        })
      }else{
        modalService({title: '获取电子发票失败',content: res.message})
      }
    }).catch(() => {
      Taro.hideLoading()
    })
  }
  React.useEffect(() => {
    if(!orderInfo.orderId) return
    if(!Taro.getStorageSync('token')) return
    fetchMedicineGuideList({orderId: orderInfo.orderId}).then(res => {
      if(res.resultCode === 0){
        setMedicineList(res.data)
      }else{
        modalService({content: res.message})
      }
    })
  },[orderInfo.orderId])
  const handleClickNavitator = (execRoom) => {
    TaroNavToZhongXun(execRoom)
  }
  const handleClickRefund = () => {
    if(WEAPP){
      weChatYiBaoAuth()
    }
    if(ALIPAYAPP){
      alipayYiBaoAuth().then((res:any) => {
        if(res.success){
          handleRefund()
        }else{
          setBusy(false)
          loadingService(false)
        }
      })
    }
  }
  const weChatYiBaoAuth = () => {
    TaroNavToMiniProgram({appId: custom.yibao2.appId,path: custom.yibao2.path, envVersion: custom.yibao2.envVersion}).catch(err => {
      setBusy(false)
      loadingService(false)
    })
  }
  const alipayYiBaoAuth = () => {
    return new Promise((resolve) => {
      my.getAuthCode({
        scopes: ['nhsamp','auth_user'],// 主动授权：auth_user，静默授权：auth_base
        success: res => {
          const { authCode } = res
          handleAuthCode({code: authCode,authType: 'basic'}).then((authRes) => {
            // console.log('authRes',authRes);
            setGlobalData('authCode',authCode)
            resolve({success: true})
          })
          
        },
        fail: err => {
          modalService({content: err.message})
          resolve({success: false})
        }
      })
    })
  }
  const alipayGetLocation = () => {
    return new Promise((resolve) => {
      my.getLocation({
        type: 1, // 获取经纬度和省市区县数据
        success: (res) => {
          const { latitude, longitude } = res
          setGlobalData('longiLatitude', longitude +','+ latitude)
          resolve({success: true})
        },
        fail: (res) => {
          my.alert({ title: '定位失败', content: JSON.stringify(res) });
          my.showAuthGuide({
            authType: "LBS"
          });
          resolve({success: false})
        },
        complete: () => {},
      });
      
    })
  }
  const handleCancel = () => {
    Taro.showLoading({title: '取消中……',mask:true})
    setBusy(true)
    const orderId = orderInfo.orderId
    handleHeSuanRefund({orderId})
    .then(res => {
      setBusy(false)
      if(res.resultCode === 0){
        toastService({title: '取消成功', onClose: () => {Taro.navigateBack();loadingService(false)}})
      }else{
        loadingService(false)
        modalService({title: '取消失败', content: res.message})
      }
    })
  }
  const ListItem = (props) => {
    const {item} = props
    return (
      <BkPanel style='margin: 40rpx 0; padding: 0 20rpx 20rpx;'>
        <View className='tag-primary'>{item.disWinAdd}</View>
        <View className='flex'>
          <View className='flat-title' style='margin-right: 10rpx'>发药流水号</View>
          <View>{item.visitNo}</View>
        </View>
        <View className='flex'>
          <View className='flat-title' style='margin-right: 10rpx'>发药窗口</View>
          <View>{item.disWin}</View>
        </View>
        {/* {
          item.visitNoCode &&
          <Image src={`data:image/jpg;base64,${item.visitNoCode}`} className='barcode' />
        } */}
        
      </BkPanel>
    )
  }
  useDidHide(() => {
    Taro.eventCenter.off(CARD_ACTIONS.UPDATE_ALL)
  })
  useDidShow(() => {
    if(_orderId){
      setBusy(true)
      loadingService(true,'正在查询……')
      requestTry(checkOrderStatus.bind(null,_orderId))
      .then(checkRes => {
        setPayResult(resultEnum.success)
        setPayResultMsg('缴费成功')
        setOrderId('');
        loadingService(false)
      })
      .catch((err)=>{
        setPayResult(resultEnum.fail)
        setPayResultMsg('缴费失败，所缴金额将原路退回'+err?.message)
        setBusy(false)
        setOrderId('');
        loadingService(false)
      })
    }
    const openId = Taro.getStorageSync('openId')
    !openId && Taro.eventCenter.on(CARD_ACTIONS.UPDATE_ALL, () => {
      setLoading(false)
      if(from.current === PAYMENT_FROM.scanQRCode){
        getOrderInfoByQRCode()
      }else if(from.current === PAYMENT_FROM.message){
        getOrderInfo()
        // 如果是直接从消息通知跳转进来的，可监听CARD_ACTIONS.UPDATE_ALL事件，即登录完成后再调接口获取数据
        refundOrderId && getOrderDetailFromData({billOrderId: refundOrderId})
      }else if(from.current === PAYMENT_FROM.orderList){
        orderInfo.orderId && getOrderDetailFromData({billOrderId: orderInfo.orderId})
      }
    })
    if(getGlobalData('scene') === 1038 && !getGlobalData('authCode')){
      // 取消医保支付
      loadingService(false)
      setBusy(false)
    }
    if(getGlobalData('scene') === 1038 && getGlobalData('authCode')){
      if(refundOrderId){
        handleRefund()
      }else if(needFetchInfo){
        setFetchInfo(false)
        getOrderInfoByQRCode()
      }else{
        handleYiBao2Payment()
      }
    }
  })
  const handleRefund = () => {
    loadingService(true,'退款中')
    handleBillOrderRefund({orderId: refundOrderId, payAuthCode: getGlobalData('authCode')}).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        modalService({content:'退款操作成功',success: () => {
          Taro.redirectTo({url: '/pages/payment-pack/payment-list/payment-list'})
        }})
      }else{
        setBusy(false)
        modalService({content:res.message})
      }
    }).finally(() => {
      setGlobalData('authCode','')
    })
  }
  const handleYiBao2Payment = () => {
    // 医保2.0
    const query = {
      clinicNo: orderInfo.clinicNo,
      cardNo: card?.cardNo,
      recipeSeq: orderInfo.recipeSeq,
      patientId: card?.patientId,
      orderId: ''
    }
    if(from.current === PAYMENT_FROM.orderList){
      query.orderId = orderInfo.orderId
      WEAPP && Taro.redirectTo({url: '/pages/payment-pack/yibao-payment-detail/index?query='+JSON.stringify(query)})
      ALIPAYAPP && Taro.redirectTo({url: '/pages/payment-pack/yibao-payment-detail-alipay/index?query='+JSON.stringify(query)})
    }else{
      loadingService(true,'医保支付中')
      handleCreatePaymentOrder(PAY_TYPE_CN.医保).then((res:any) => {
        loadingService(false)
        if(res.success){
          query.orderId = res.data.orderId
          WEAPP && Taro.redirectTo({url: '/pages/payment-pack/yibao-payment-detail/index?query='+JSON.stringify(query)})
          ALIPAYAPP && Taro.redirectTo({url: '/pages/payment-pack/yibao-payment-detail-alipay/index?query='+JSON.stringify(query)})
        }else{
          if(res.data.url){
            my.ap.openURL({
              url: res.data.url,
              success: (result) => {
                console.log('openURL success', result)
              },
              fail: (err) => {
                console.log('openURL success', err)
              }
            });
          }else{
            modalService({title: '创建订单失败', content: res.data.message})
          }
          setGlobalData('authCode','')
          setBusy(false)
        }
      })
    }
  }
  const getOrderInfo = () => {
    fetchBillOrderInfo({orderId:params.orderId}).then(res => {
      if(res.resultCode ===0){
        const {totalFee: prescMoney,orderState, orderDate, orderDeptName:orderDept, orderDoctorName:orderDoctor, clinicNo, userCard: {patientName,cardNo},pactCode} = res.data
        setOrderInfo({
          prescMoney,orderState,orderDate,orderDept,orderDoctor,clinicNo,patientName,cardNo,
          pactCode,recipeSeq: '',orderType: '',orderId: '',serialNo: ''
        })
      }else{
        modalService({content: res.message})
      }
    })
  }
  const getOrderInfoByQRCode = () => {
    loadingService(true,'加载中')
    fetchPaymentOrderDetailByQRCode({preQRCodePayId:Number(preQRCodePayId),payAuthCode: getGlobalData('authCode')}).then(res => {
      // 扫码进入的因接口返回字段不同╮(╯▽╰)╭，需要重新对齐数据
      loadingService(false)
      if(res.resultCode === 0){
        const {
          cardNo,patientName,clinicNo,feeTypeId,idenNo,orderDate,orderDept,orderDoctor,pactCode,patientId,prescMoney,orderId,recipeSeq,
          psnNo,medType,mdtrtId,insuType,mdtrtMode
        } = res.data
        setOrderInfo({
          cardNo,patientId,patientName,clinicNo,feeTypeId,idenNo,orderDate,orderDept,orderDoctor,prescMoney, 
          orderId,orderType: pactCode,payState: PAY_STATUS_EN.unpay,recipeSeq,psnNo,medType,mdtrtId,insuType,mdtrtMode
        })
        const param = {cardNo,clinicNo,recipeSeq,patientId}
        getOrderDetailFromHis(param)
      }else if(res.resultCode === 4){
        setFetchInfo(true)
        weChatYiBaoAuth()
      }else{
        modalService({content: res.message})
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
        modalService({content: res.message})
      }
    })
  }
  
  const getOrderDetailFromData = (param:{
    billOrderId: string
  }) => {
    if(!Taro.getStorageSync('token')) return
    loadingService(true)
    fetchPaymentOrderDetail(param).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        modalService({content: res.message})
      }
    })
    
  }
  useReady(async () => {
    if(custom.feat.guangHuaMonitor.enable){
      reportCmPV_YL({title: '门诊缴费',params})
    }
    // check login status
    const openId = Taro.getStorageSync('openId')
    if(openId){
      setLoading(false)
    }
    if(from.current === PAYMENT_FROM.scanQRCode && openId){
      getOrderInfoByQRCode()
    }else if(from.current === PAYMENT_FROM.message && openId){
      getOrderInfo()
      refundOrderId && getOrderDetailFromData({billOrderId: refundOrderId})
    }else if(from.current === PAYMENT_FROM.paymentList){
      const param = {
        cardNo: orderInfo.cardNo,
        clinicNo: orderInfo.clinicNo,
        recipeSeq: orderInfo.recipeSeq,
        patientId: card?.patientId
      }
      getOrderDetailFromHis(param)
    }else if(from.current === PAYMENT_FROM.orderList){
      const param = {
        billOrderId: orderInfo.orderId
      }
      if(orderInfo.orderState === 5||orderInfo.orderState === 2){
        setRefundOrderId(orderInfo.orderId)
      }
      getOrderDetailFromData(param)
      orderInfo.cardNo && Qrcode.toDataURL(orderInfo.cardNo).then(url => {
        setQrcodeSrc(url)
      })
    }
  })
  const handleShowOrderInfo = () => {
    if(custom.hospName === 'jszyy'){
      // 特殊处理 金沙洲医院 支付宝小程序要求缴费成功后有取药指引
      const options = {
        ...orderInfo,
        payState: PAY_STATUS_EN.paid
      }
      Taro.redirectTo({url: `/pages/payment-pack/payment-detail/payment-detail?orderInfo=${JSON.stringify(options)}&from=${PAYMENT_FROM.orderList}`})
    }else{
      TaroNavigateService('payment-pack', 'order-list')
    }
  }
  const renderName = () => {
    let name = orderInfo.patientName
    if(ALIPAYAPP){
      name = getPrivacyName(name)
    }
    return name
  }
  if(loading){
    return (
      <BkLoading msg='加载中...' loading={loading} />
    )
  }else if(payResult === resultEnum.default){
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
            <View className='payment-detail-item-text' style='overflow-wrap: anywhere;'>{orderInfo.clinicNo}</View>
          </View>
          {
            orderInfo.patientName &&
            <View className='flex'>
              <View className='flat-title'>姓名</View>
              <View className='payment-detail-item-text'>{renderName()}</View>
            </View>
          }

          <View className='flex'>
            <View className='flat-title'>开单科室</View>
            <View className='payment-detail-item-text'>{orderInfo.orderDept}</View>
          </View>
          {
            orderInfo.orderDoctor &&
            <View className='flex'>
              <View className='flat-title'>开单医生</View>
              <View className='payment-detail-item-text'>{orderInfo.orderDoctor}</View>
            </View>
          }
          
          <View className='flex'>
            <View className='flat-title'>开单时间</View>
            <View className='payment-detail-item-text'>{orderInfo.orderDate}</View>
          </View>
          <View className='flex'>
            <View className='flat-title'>总金额</View>
            <View className='payment-detail-item-text price-color'>{orderInfo.prescMoney} 元</View>
          </View>
          {
            orderInfo.oweMoney &&
            <View className='flex'>
              <View className='flat-title'>欠费金额</View>
              <View className='payment-detail-item-text price-color'>{orderInfo.oweMoney}</View>
            </View>
          }
          {
            orderInfo.serialNo && 
            <View className='flex'>
              <View className='flat-title'>电子发票</View>
              <View className='payment-detail-item-text clickable' onClick={showInvoice.bind(null,orderInfo)}>点击查看</View>
            </View>
          }
          {
            orderInfo.orderDept === '新冠疫苗/核酸' && orderInfo.payState === PAY_STATUS_EN.paid && 
            <View className='flex-justify-center'>
              <BkButton title='取消预约' theme='danger' disabled={busy} onClick={handleCancel} />
            </View>
          }
          {
            orderInfo && custom.yibao2.enable && (orderInfo.orderState === ORDER_STATUS_EN.paySuccess || orderInfo.orderState === ORDER_STATUS_EN.paySuccess_and_His_fail) &&
            <View className='flex-justify-center'>
              <BkButton title='确认退款' theme='danger' disabled={busy} onClick={handleClickRefund} />
            </View>
          }
        </BkPanel>
        {
          qrcodeSrc &&
          <View className='payment-detail-qrcode'>
            <View>诊疗卡号：{orderInfo.cardNo}</View>
            <Image style='width: 200px; height: 200px;' src={qrcodeSrc}></Image>
          </View>
        }
        {
          from.current === PAYMENT_FROM.orderList && custom.paymentOrderPage.tackingMedicineGuide && orderInfo.orderState !== ORDER_STATUS_EN.unpay &&
          <View className='medicine-guide'>
            {
              medicineList.length > 0 &&
              <View>
                {
                  medicineList.map((item,index) => <ListItem item={item} key={index}></ListItem>)
                }
              </View>
            }
          </View>
        }
        <AtAccordion title='详情列表' open={open} onClick={() => setOpen(!open)}>
          {
            list.length > 0 &&
            <BkPanel style='margin: 10rpx'>
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
                      {/* 注意，getorderdetail接口和getBillOrderItem接口返回的数量字段不同，一个是account，一个是count */}
                      <text>{item.count || item.account}</text>
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
        </AtAccordion>

        {
          Object.keys(orderInfo).length > 0 && 
          <View className='flex-around' style='padding: 40rpx'>
            {
              orderInfo.payState === PAY_STATUS_EN.unpay && WEAPP &&
              <BkButton title='微信支付' icon='icons/wechat.png' theme='info' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.微信)} />
            }
            {
              orderInfo.payState === PAY_STATUS_EN.unpay && ALIPAYAPP &&
              <BkButton title='支付宝支付' icon='icons/alipay.png' theme='primary' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.支付宝)} />
            }
            {
              orderInfo.payState === PAY_STATUS_EN.unpay && orderInfo.orderType === ORDER_TYPE_CN.医保单 &&
              <BkButton title='医保支付' icon='icons/card.png' theme='primary' disabled={busy} onClick={dealWithPay.bind(null,PAY_TYPE_CN.医保)} />
            }
          </View>
        }
        <View className='payment-detail-tips'>
          <View className='payment-detail-tips-item'>
            <Image src={sighPng} />
            <text>1、缴费提供{payButtonText} </text>
          </View>
          <View className='payment-detail-tips-item'>
            <Image src={sighPng} />
            <text>2、处方24小时有效</text>
          </View>
          <View className='payment-detail-tips-item'>
            <Image src={sighPng} />
            {
              custom.hospName === 'gy3ylw' && 
              <text>3、目前{payButtonText}支持自费缴费、市医保及市直医保和省直医保，其他参保类型人员请移步到各楼层人工缴费窗口缴纳</text>
            }
            {
             custom.hospName !== 'gy3ylw' && 
              <text>3、目前{payButtonText}只提供自费缴费{custom.feat.YiBaoCard ? '和市医保' : ''}，其他参保类型人员请移步到各楼层人工缴费窗口缴纳</text>
            }
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
              <BkButton theme='info' title='查看订单' onClick={handleShowOrderInfo} />
            </View>
          }
        </View>
      </ResultPage>
    )
  }
}