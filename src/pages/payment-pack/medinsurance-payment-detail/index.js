import * as Taro from '@tarojs/taro'
import { fetchPaymentDetailFromHis,fetchBillOrderInfo,handlePayment,TaroNavToMiniProgram,cancelPayment } from "@/service/api"
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
    // prescriptionList: [
    //   {
    //     title: '就诊信息',
    //     list: [
    //       { label: '门诊类别', value: '门(急)诊' },
    //       { label: '门诊科室', value: '普通内科' },
    //       { label: '医生姓名', value: '张三' },
    //       { label: '处方时间', value: '2021/06/08 14:54:00' },
    //       { label: '费用总额', value: '368.50元', highlight: true },
    //     ]
    //   },
    //   {
    //     title: '诊断信息',
    //     list: [
    //       { label: '诊断名称', value: '外伤肿胀' },
    //       { label: '诊断编号', value: 'E3D.25' },
    //     ]
    //   },
    //   {
    //     title: '特殊信息',
    //     list: [
    //       { label: '病情名称', value: '高血压' },
    //       { label: '病情编号', value: '2220003495858' },
    //     ]
    //   },
    //   {
    //     title: '费用信息',
    //     list: [
    //       { label: '万通胫骨贴*1', subLabel: '8g/片/3', value: '37.80元' },
    //       { label: '阿莫西林*1', subLabel: '8g/片/3', value: '7.80元' },
    //     ]
    //   },
    //   {
    //     title: '其他抵扣金额',
    //     list: [
    //       { label: '住院押金抵扣', value: '50元' },
    //       { label: '医院负担金额抵扣', value: '50元' },
    //     ]
    //   },
    // ],
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
  }
})
