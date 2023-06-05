import * as Taro from '@tarojs/taro'
import { fetchPaymentDetailFromHis,fetchBillOrderInfo,handlePayment,
  TaroNavToMiniProgram,cancelPayment,individualAccountEnable } from "@/service/api"
import { loadingService, modalService } from "@/service/toast-service"
import { custom } from "@/custom/index"
import { PAY_TYPE_CN } from "@/enums/index"

// eslint-disable-next-line no-undef
Page({
  data: {
    orderId: '',
    hospitalName: custom.hospitalName,
    orderInfo: {
      totalFee:'',insuranceFee:'',personalFee:'',cashFee:'',otherFee:''
    },
    useIndividualAccount: true,
    actionsheetVisible: false
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
    handlePayment({orderId: this.data.orderId,payType: PAY_TYPE_CN.医保}).then(res => {
      if(res.resultCode === 0){
        const {pay_appid,pay_url} = res.data
        TaroNavToMiniProgram({appId:pay_appid,path: pay_url}).then(() => {
          Taro.redirectTo({url: '/pages/payment-pack/payment-list/payment-list'})
        }).catch(() => {
          cancelPayment({orderId: this.data.orderId})
        })
      }else{
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
