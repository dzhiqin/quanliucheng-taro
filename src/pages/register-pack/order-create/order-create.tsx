import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Picker, Image } from '@tarojs/components'
import HealthCards from '@/components/health-cards/health-cards'
import { useState,useEffect } from 'react'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import { AtIcon } from 'taro-ui'
import { 
  cancelRegOrder, 
  createRegOrder, 
  fetchOrderFee, 
  fetchRegFeeType, 
  fetchRegOrderStatus, 
  getEpidemiologicalSurveyState, 
  TaroSubscribeService, 
  TaroAliPayment,
  TaroRequestPayment, 
  handleAuthCode,
  AlipaySubscribeService,
  handleGrantEnergy,
  TaroNavigateService} from '@/service/api'
import { CardsHealper } from '@/utils/cards-healper'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import { requestTry } from '@/utils/retry'
import ResultPage from '@/components/result-page/result-page'
import SubscribeNotice from '@/components/subscribe-notice/subscribe-notice'
import './order-create.less'
import {custom} from '@/custom/index'
import RegisterNotice from './notice'
import { getPrivacyName, getQueryValue, WEAPP, ALIPAYAPP } from '@/utils/tools'
import GreenEnergyBubble  from '@/images/icons/green-energy-bubble.png'
import GreenEnergyToast from '../../../components/green-energy-toast/green-energy-toast'
import GreenEnergyModal from './green-energy-modal'
import { reportCmPV_YL } from '@/utils/cloudMonitorHelper'

export default function OrderCreate() {
  const [order,setOrder] = useState({
    patientName: '',
    deptName:'',
    doctorName: '',
    regDate: '',
    startTime: '',
    endTime: '',
    regFee: '',
    treatFee: '',
    feeType: '',
    patientId: '',
    cardNo: '',
    sourceType: '',
    deptId: '',
    sliceId: '',
    doctorId: '',
    scheduleId: '',
    regTypeId: ''
  })
  enum resultEnum {
    default = '',
    success = 'success',
    fail = 'fail'
  }
  const [busy,setBusy] = useState(false)
  // 后端字段没统一，导致有2个金额字段 ╮(╯▽╰)╭
  const [regFee,setRegFee] = useState(null)
  const [treatFee,setTreatFee] = useState(null)
  // const [feeTypes,setFeeTypes] = useState([])
  const [currentFeeObj,setCurrentFeeObj] = useState({feeName: '',feeCode: ''})
  // const [appointedFeeType, setAppointedFeeType] = useState('')
  // let appointedFeeType = ''
  const appointedFeeType = React.useRef('') // 广三黄埔区 需要增加feeType参数
  const [result,setResult] = useState(resultEnum.default)
  const [feeOptions,setFeeOptions] = useState([])
  const [showNotice,setShowNotice] = useState(false)
  const [showGreenToast,setShowGreenToast] = useState(true)
  const [isShow,setIsShow] = useState(false)
  const [showGreenModal,setShowGreenModal] = useState(false)
  const [energy,setEnergy] = useState(0)
  const buildOrderParams = (_regFee=undefined,_treatFee=undefined) => {
    const orderParams = Taro.getStorageSync('orderParams')
    const card = CardsHealper.getDefault()
    const params = {
      ...orderParams,
      cardNo: card.cardNo,
      patientId: card.patientId,
      regFee: _regFee !== undefined ? _regFee : regFee,
      treatFee: _treatFee !== undefined ? _treatFee : treatFee,
      feeType: custom.feat.register.changeFeeType ? currentFeeObj.feeCode : (appointedFeeType.current || orderParams.feeType)
    }
    return params
  }
  const buildFeeParams = () => {
    const card = CardsHealper.getDefault()
    const orderParams = Taro.getStorageSync('orderParams')
    const { sourceType, regDate, deptId, sliceId, doctorId, scheduleId, regTypeId} = orderParams
    // 接口字段不一致，导致字段要变
    const params = {
      patientId:card.patientId,
      cardNo:card.cardNo,
      sourceType,
      regDate,
      regDept: deptId,
      sliceId,
      regDoctor: doctorId,
      schemaId: scheduleId,
      regTypeId,
      pactCode: '1',
    }
    return params
  }
  const onFeeTypeChange = (e) => {
    const index = e.detail.value
    const value = feeOptions[index]
    setCurrentFeeObj(value)
  }
  const checkOrderStatus = (orderId: string) => {
    return new Promise((resolve,reject) => {
      fetchRegOrderStatus({orderId}).then(res => {
        if(res.resultCode === 0 && res.data.isSuccess){
          resolve(res.message)
        }else{
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
  const handleAliPayment = (params: {tradeNo: string,orderId: string, orderNo: string}) => {
    TaroAliPayment({tradeNo: params.tradeNo}).then((payRes:any) => {
      const data = JSON.parse(payRes.data)
      if(data.resultCode === '9000'){
        requestTry(checkOrderStatus.bind(null,params.orderId)).then(() => {
          setResult(resultEnum.success)
          if(custom.feat.greenTree){
            handleGetGreenEnergy(params.orderNo.toString())
          }
          loadingService(false)
        }).catch(()=>{
          setResult(resultEnum.fail)
          loadingService(false)
        })
      }else{
        let msg = ''+data.memo
        if(data.resultCode === '6001') msg = '您已取消支付'
        modalService({title: '支付失败',content: msg})
        loadingService(false)
        cancelRegOrder({orderId: params.orderId})
        setBusy(false)
        setResult(resultEnum.fail)
      }
    }).catch(err => {
      modalService({title: '调用支付失败',content: JSON.stringify(err)})
      loadingService(false)
      cancelRegOrder({orderId: params.orderId})
      setResult(resultEnum.fail)
      setBusy(false)
    })
  }
  const handleTaroPayment = (params:{nonceStr: string, paySign: string,timeStamp: string,package: string, signType: 'HMAC-SHA256' | 'MD5'},orderId: string) => {
    TaroRequestPayment(params).then(() => {
      loadingService(true, '查询状态中')
      requestTry(checkOrderStatus.bind(null,orderId)).then(() => {
        setResult(resultEnum.success)
        loadingService(false)
      }).catch(()=>{
        setResult(resultEnum.fail)
        loadingService(false)
      })
    }).catch(taroErr => {
      if(taroErr.data.errMsg === 'requestPayment:fail cancel'){
        toastService({title: '您已取消缴费',onClose: () => loadingService(false)})
        cancelRegOrder({orderId: orderId})
      }else{
        loadingService(false)
      }
      setBusy(false)
    })
  }
  const handleGetGreenEnergy = (orderId) => {
    handleGrantEnergy({scene: 'horegister',outerNo: orderId}).then(res => {
      if(res.resultCode === 0){
        const {totalEnergy} = res.data
        setEnergy(totalEnergy)
        setIsShow(true)
      }
    })
  }
  const checkEpiLogicalSurvey = () => {
    return new Promise((resolve,reject) => {
      getEpidemiologicalSurveyState()
      .then(res => {
        if(res.resultCode === 0){
          resolve({result: true, message:'success'})
        }else{
          resolve({result: false,message: res.message})
        }
      })
      .catch(err => {
        reject({result: false, message:'fail'+err})
      })
    })
  }
  const handleSubmit = async() => {
    if(busy) return
    setBusy(true)
    let subRes
    if(WEAPP){
      subRes = await TaroSubscribeService(
        custom.subscribes.appointmentNotice,
        custom.subscribes.appointmentCancelNotice,
        custom.subscribes.refundNotice
      )
      if(!subRes.result){
        setShowNotice(true)
        return
      }
    }
    if(ALIPAYAPP){
      my.getAuthCode({
        scopes: ['auth_user','hospital_order'],
        success: res => {
          const code = res.authCode
          handleAuthCode({code,authType: ''}).then(() => {
            // do nothing
          }).catch(err => {
            modalService({content: JSON.stringify(err)})
            loadingService(false)
          })
        },
        fail: err => {
          loadingService(false)
          modalService({title: '授权失败',content: JSON.stringify(err)})
        }
      })
      if(custom.feat.greenTree){
        my.getAuthCode({
          scopes: ['mfrstre'],
          success: res => {
            const code = res.authCode
            handleAuthCode({code,authType: 'ant'}).then(() => {
              // do nothing
            }).catch(err => {
              modalService({content: JSON.stringify(err)})
              loadingService(false)
            })
          },
          fail: err => {
            loadingService(false)
            modalService({title: '授权失败',content: JSON.stringify(err)})
          }
        })
      }
      
      subRes = await AlipaySubscribeService(
        custom.subscribes.visitReminder,
        custom.subscribes.visitCancelReminder,
        custom.subscribes.orderCancelReminder
      )
      if(!subRes.result){
        setBusy(false)
        modalService({content: subRes.msg})
        return
      }
    }
    
    if(custom.feat.register.checkEpiLogicalSurvey){
      try {
        const checkSurveyRes:any = await checkEpiLogicalSurvey()
        const checkTempRes = Taro.getStorageSync('checkEpiLogicalSurvey')
        if(!checkTempRes && !checkSurveyRes.result){
          toastService({title: checkSurveyRes.message, onClose: () => {TaroNavigateService('service-pack','epidemiological-survey');setBusy(false)}})
          return
        }
        if(checkTempRes){
          Taro.removeStorageSync('checkEpiLogicalSurvey')
        }
      } catch (error) {
        toastService({title: '获取流调表失败'})
        return
      }
    }
    loadingService(true,'挂号中……')
    let orderParams 
    if( (!regFee && !treatFee && regFee !== 0 && treatFee !== 0) ) {
      // toastService({title: '正在获取费用信息，请稍后……'})
      // return
      loadingService(false)
      return  // 费用赋值未成功时直接返回
      // const feeRes:any = await fetchFee()
      // if(feeRes.success){
      //   appointedFeeType.current = feeRes.data.feeType
      //   orderParams = buildOrderParams(feeRes.data.regFee, feeRes.data.treatFee)
      //   handleCreateRegOrder(orderParams)
      // }else{
      //   loadingService(false)
      //   modalService({content: feeRes.msg})
      //   setResult(resultEnum.fail)
      //   return
      // }
    }else{
      orderParams = buildOrderParams()
      handleCreateRegOrder(orderParams)
    }
  }
  const handleCreateRegOrder = (orderParams) => {
    createRegOrder(orderParams).then(res => {
      if(res.resultCode === 0){
        const {nonceStr, orderId, paySign, signType, payString, timeStamp, orderNo} = res.data
        if(payString){
          if(WEAPP){
            const payParams = {
              nonceStr,
              paySign,
              timeStamp,
              package: payString,
              signType  
            }
            handleTaroPayment(payParams,orderId)
          }
          if(ALIPAYAPP){
            const tradeNo = getQueryValue(payString,'trade_no')
            handleAliPayment({tradeNo,orderId,orderNo})
          }
          
        }else{
          loadingService(true, '查询状态中')
          requestTry(checkOrderStatus.bind(null,orderId)).then(() => {
            setResult(resultEnum.success)
            loadingService(false)
          }).catch(()=>{
            setResult(resultEnum.fail)
            loadingService(false)
          })
        }
      }else{
        setBusy(false)
        loadingService(false)
        modalService({content: res.message})
      }
    }).catch(err => {
      loadingService(false)
      modalService({content: JSON.stringify(err,null,2)})
    })
  }
  // useEffect(() => {
  //   if(!currentFeeObj.feeCode) return
  //   setBusy(true)
  //   fetchFee().then(() => setBusy(false))
  // },[currentFeeObj.feeCode])
  Taro.useDidShow(() => {
    if(isShow){
      setShowGreenToast(true)
      setIsShow(false)
    }
    if(custom.feat.register.changeFeeType){
      fetchRegFeeType().then(res => {
        if(res.resultCode == 0){
          setFeeOptions(res.data)
          setCurrentFeeObj(res.data[0])
        }
      })
    }
  })
  Taro.useReady(() => {
    if(custom.feat.guangHuaMonitor.enable){
      reportCmPV_YL({title: '预约挂号'})
    }
  })
  const onCardChange = (card) => {
    const params = Taro.getStorageSync('orderParams')
    const orderParams = {
      ...params,
      cardNo: card.cardNo,
      patienttId: card.patientId,
      patientName: card.name
    }
    // setOrder(orderParams)
    // if(custom.hospName === 'gy3yhp' && !currentFeeObj.feeCode) return // 特殊处理，未获取feecode的情况下不进行挂号金额查询
    loadingService(true,'正在获取费用')
    fetchOrderFee(buildFeeParams()).then(res => {
      setOrder(orderParams)
      loadingService(false)
      if(res.resultCode === 0){
        setRegFee(res.data.regFee)
        setTreatFee(res.data.treatFee)
        appointedFeeType.current = res.data.feeType
      }else{
        modalService({title: "获取金额失败", content: res.message+''})
      }
    }).catch((err) => {
      loadingService(false)
      modalService({content: JSON.stringify(err)})
    })
  }
 
  const fetchFee = () => {
    return new Promise((resolve) => {
      fetchOrderFee(buildFeeParams()).then(res => {
        if(res.resultCode === 0){
          const _regFee = res.data.regFee
          const _treatFee = res.data.treatFee
          const _feeType = res.data.feeType
          setRegFee(_regFee)
          setTreatFee(_treatFee)
          appointedFeeType.current = _feeType
          resolve({success: true, data: {regFee: _regFee,treatFee: _treatFee,feeType: _feeType}})
        }else{
          resolve({success: false, msg: '获取金额失败'})
        }
      }).catch(err => {
        resolve({success: false, msg: JSON.stringify(err)})
      })
    })
  }
  if(result === ''){
    return(
      <View className='order-create'>
        <GreenEnergyModal show={showGreenModal} onCancel={() => setShowGreenModal(false)} />
        <SubscribeNotice show={showNotice} />
        <HealthCards switch onCard={onCardChange} />
        <View className='order-create-title'>挂号详情</View>
        <BkPanel style='margin: 40rpx'>
          <View className='order-create-item'>
            <View className='order-create-item-title'>就诊人</View>
            <View className='order-create-item-value'>{ALIPAYAPP ? getPrivacyName(order.patientName) : order.patientName}</View>
          </View>
          <View className='order-create-item'>
            <View className='order-create-item-title'>就诊科室</View>
            <View className='order-create-item-value'>{order.deptName}</View>
          </View>
          <View className='order-create-item'>
            <View className='order-create-item-title'>就诊医生</View>
            <View className='order-create-item-value'>{order.doctorName}</View>
          </View>
          <View className='order-create-item'>
            <View className='order-create-item-title'>就诊日期</View>
            <View className='order-create-item-value price-color'>{order.regDate}</View>
          </View>
          <View className='order-create-item'>
            <View className='order-create-item-title'>就诊时间</View>
            <View className='order-create-item-value price-color'>{order.startTime} - {order.endTime}</View>
          </View>
          <View className='order-create-item'>
            <View className='order-create-item-title'>金额</View>
            <View className='order-create-item-value price-color'>{regFee ? regFee : treatFee}元</View>
          </View>
          {// 特殊处理
            (custom.hospName === 'g1yy' || custom.hospName === 'lwgk') &&
            <View className='order-create-item'>
              <View className='order-create-item-title'>费用类型</View>
              <View className='order-create-item-value'>
                <Picker mode='selector' range={feeOptions.map(i => i.feeName)} onChange={onFeeTypeChange} >
                  <View className='flex-between'>
                    <View>{currentFeeObj.feeName}</View>
                    <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>
                  </View>
                </Picker>
              </View>
            </View>
          }
          {/* {
            // 临时处理
            custom.hospName === 'gy3yhp' && 
            <View className='order-create-item'>
              <View className='order-create-item-title'>费用类型</View>
              <View className='order-create-item-value'>
                <Picker mode='selector' range={feeTypeOptionsTemp.map(i => i.name)} onChange={onFeeTypeTempChange} >
                  <View className='flex-between'>
                    <View>{feeTypeOptionsTemp.find(i => i.id === feeType)?.name}</View>
                    <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>
                  </View>
                </Picker>
              </View>
            </View>
          } */}
        </BkPanel>
        {
          ALIPAYAPP && custom.feat.greenTree &&
          <View className='order-create-tips flex-justify-center' onClick={() => setShowGreenModal(true)}>
            <Image src={GreenEnergyBubble} className='order-create-tips-icon'></Image>
            <View>预约挂号预计得蚂蚁森林能量</View>
            <View className='order-create-tips-energy'>277g</View>
            <AtIcon value='alert-circle' size='15' color='#999'></AtIcon>
          </View>
        }
        <View style='padding: 0 40rpx'>
          <BkButton title='确认挂号' disabled={busy} onClick={handleSubmit} />
        </View>
        <RegisterNotice />
      </View>
    )
  }else{
    return(
      <ResultPage type={result} visible={!!result}>
        {
          custom.feat.greenTree &&
          <GreenEnergyToast show={showGreenToast} energy={energy} text='本次预约获得绿色能量' />
        }
        <View className='order-result'>
          <BkPanel>
            <View className='order-result-item'>
              <View className='order-result-title'>开单科室：</View>
              <View className='order-result-value'>{order.deptName}</View>
            </View>
            <View className='order-result-item'>
              <View className='order-result-title'>开单医生：</View>
              <View className='order-result-value'>{order.doctorName}</View>
            </View>
            <View className='order-result-item'>
              <View className='order-result-title'>就诊时间：</View>
              <View className='order-result-value'>{order.regDate} / {order.startTime}-{order.endTime}</View>
            </View>
            <View className='order-result-item'>
              <View className='order-result-title'>总金额：</View>
              <View className='order-result-price'>{regFee ? regFee : treatFee} 元</View>
            </View>
          </BkPanel>
          <View style='padding-top: 80rpx;'>
            <BkButton title='返回' onClick={() => Taro.navigateBack()} style='margin-bottom: 40rpx' />
            {
              result === 'success' &&
              <BkButton title='查看订单' onClick={() => Taro.redirectTo({url: '/pages/register-pack/order-list/order-list'})} theme='info' />
            }
          </View>
        </View>
       
      </ResultPage>
    )
  }
  
}