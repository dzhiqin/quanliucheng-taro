import * as Taro from '@tarojs/taro'
import { fetchPaymentDetailFromHis,fetchBillOrderInfo,handlePayment,
  TaroNavToMiniProgram,cancelPayment,individualAccountEnable, fetchPaymentOrderStatus } from "@/service/api"
import { loadingService, modalService } from "@/service/toast-service"
import { custom } from "@/custom/index"
import { PAY_TYPE_CN,ORDER_STATUS_EN } from "@/enums/index"
import { requestTry } from '@/utils/retry'

// eslint-disable-next-line no-undef
Page({
  data: {
    orderId: '',
    hospitalName: custom.hospitalName,
    orderInfo: {
      totalFee:'',insuranceFee:'',personalFee:'',cashFee:'',otherFee:''
    },
    useIndividualAccount: true,
    actionsheetVisible: false,
    payFlag: ''
  },
  onShow() {
    if(this.data.orderId && this.data.payFlag === 'paying'){
      loadingService(true)
      requestTry(this.checkOrderStatus)
      .then(() => {
        Taro.navigateBack()
        loadingService(false)
      })
      .catch((err) => {
        loadingService(false)
        let message = ''
        switch(err.data){
          case 0: message = '未支付';break;
          case 1: message = '支付中';break;
          case 2: message = '支付成功';break;
          case 3: message = '支付失败';break;
          case 4: message = '支付成功且通知His成功';break;
          case 5: message = '支付成功但通知His失败';break;
          case 6: message = '取消支付';break;
        }
        modalService({content: message})
      })
    }
  },
  checkOrderStatus() {
    return new Promise((resolve,reject) => {
      fetchPaymentOrderStatus({orderId: this.data.orderId}).then(res => {
        if(res.resultCode === 0 && res.data === ORDER_STATUS_EN.paySuccess_and_His_success){
          resolve(res.message)
        }else{
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  handleActionsheet() {
    this.actionsheetVisible = !this.actionsheetVisible;
    this.setData({
      actionsheetVisible: this.actionsheetVisible
    });
  },
  onLoad(options) {
    if(!options.query) return
    const query = JSON.parse(options.query)
    const { clinicNo, cardNo, recipeSeq, patientId, orderId } = query
    this.setData({orderId})
    this.getInfo(orderId)
    this.getDetail(clinicNo,cardNo,recipeSeq,patientId)
  },
  getInfo(orderId){
    fetchBillOrderInfo({orderId}).then(res => {
      if(res.resultCode === 0){
        const {totalFee, insuranceFee, personalFee, cashFee, otherFee} = res.data
        this.setData({orderInfo: {totalFee,insuranceFee,personalFee, cashFee, otherFee}})
      }else{
        modalService({content: res.message})
      }
    })
  },
  getDetail(clinicNo,cardNo,recipeSeq,patientId){
    loadingService(true)
    fetchPaymentDetailFromHis({clinicNo,cardNo,recipeSeq,patientId}).then(res => {
      if(res.resultCode === 0){
        loadingService(false)
        this.setData({list: res.data.billDetails})
      }else{
        modalService({content: res.message})
      }
    })
  },
  handlePay() {
    loadingService(true,'支付中')
    this.setData({payFlag: 'paying'})
    handlePayment({orderId: this.data.orderId,payType: PAY_TYPE_CN.医保}).then(res => {
      if(res.resultCode === 0){
        const {pay_appid,pay_url} = res.data
        TaroNavToMiniProgram({appId:pay_appid,path: pay_url}).then(() => {
          // Taro.redirectTo({url: '/pages/payment-pack/payment-list/payment-list'})
        }).catch(() => {
          this.setData({payFlag: ''})
          cancelPayment({orderId: this.data.orderId})
        })
      }else{
        this.setData({payFlag: ''})
        loadingService(false),
        modalService({content: res.message})
      }
    })
  },
  onChangeAccount() {
    const useIndividualAccount = !this.data.useIndividualAccount
    this.setData({useIndividualAccount})
    loadingService(true)
    individualAccountEnable({
      orderId: Number(this.data.orderId),
      acctUsedFlag: useIndividualAccount ? '1' : '0'
    }).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        const {totalFee, insuranceFee, personalFee, cashFee, otherFee} = res.data
        this.setData({orderInfo: {totalFee,insuranceFee,personalFee, cashFee, otherFee}})
      }else{
        modalService({content: res.message})
      }
    }).catch(err => {
      loadingService(false)
      modalService({content: err.message})
    })
  }
})
