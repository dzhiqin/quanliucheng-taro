import { fullUrl, Post, Get } from "../http";
import { custom } from "@/custom/index";

export const fetchInHospCards = () => {
  if(custom.hospName === 'jszyy'){
    return Post(fullUrl('api/customize/applet/inpatient/InHospital/GetAllInpCard'))
  }else{
    return Post(fullUrl('api/applet/inpatient/InHospital/GetAllInpCard'))
  }
}
export const getInHospBillList = (data: {inCardNo: string}) => {
  if(custom.hospName === 'jszyy'){
    return Get(fullUrl('api/customize/applet/inpatient/InHospital/GetInpBillList'),data)
  }else{
    return Get(fullUrl('api/applet/inpatient/InHospital/GetInpBillList'),data)
  }
}
export const getDepositOrderList = (data: {cardNo: string}) => {
  if(custom.hospName === 'jszyy'){
    return Get(fullUrl('api/customize/applet/inpatient/InHospital/GetInHPPrePayOrderList',data))
  }else{
    return Get(fullUrl('api/applet/inpatient/InHospital/GetInHPPrePayOrderList',data))
  }
}
export const fetchDepositPayParams = (data: {inCardNo: string, money: number, registerId: string}) => {
  if(custom.hospName === 'jszyy'){
    return Post(fullUrl('api/customize/applet/inpatient/InHospital/PrePay'),data)
  }else{
    return Post(fullUrl('api/applet/inpatient/InHospital/PrePay'),data)
  }
}
export const getDepositOrderStatus = (data: {orderNo: string}) => {
  if(custom.hospName === 'jszyy'){
    return Get(fullUrl('api/customize/applet/inpatient/InHospital/CheckOrderStatus',data))
  }else{
    return Get(fullUrl('api/applet/inpatient/InHospital/CheckOrderStatus',data))
  }
}
export const getDepositOrderDetail = (data: {orderNo: string}) => {
  if(custom.hospName === 'jszyy') {
    return Get(fullUrl('api/customize/applet/inpatient/InHospital/GetInHPPrePayOrderDetail',data))
  }else{
    return Get(fullUrl('api/applet/inpatient/InHospital/GetInHPPrePayOrderDetail',data))
  }
}
export const bindCardByCardNameAndNo = (data: {inCardNo: string, inCardName: string}) => {
  return Post(fullUrl('api/applet/inpatient/InHospital/BindCard'),{...data, isDefalut: true})
}
export const bindCardByCardNo = (data: {inCardNo: string}) => {
  return Get(fullUrl('api/applet/inpatient/InHospital/GetInpatientInfo'),data)
}
export const getInHospInfo = (data: {inCardNo: string}) => {
  // 金沙洲医院的住院功能暂时归属附加模块
  if(custom.hospName==='jszyy'){
    return Get(fullUrl('api/customize/applet/inpatient/InHospital/GetInpatientInfo'),data)
  }else{
    return Get(fullUrl('api/applet/inpatient/InHospital/GetInpatientInfo'),data)
  }
}
export const fetchAllInHospBillDetail = (data: {registerId: string, billDate: string, inCardNo?: string}) => {
  // jszyy-接口多个inCardNo入参
  if(custom.hospName === 'jszyy'){
    return Post(fullUrl('api/customize/applet/inpatient/InHospital/GetAllCategoryBillDetail'),data)
  }else{
    return Post(fullUrl('api/applet/inpatient/InHospital/GetAllCategoryBillDetail'),data)
  }
}
export const fetchInHospBillDetailByCategory = (data: {registerId: string, billDate: string, categoryId: string, inCardNo?: string}) => {
  // jszyy-接口多个inCardNo入参
  if(custom.hospName === 'jszyy'){
    return Post(fullUrl('api/customize/applet/inpatient/InHospital/GetCategoryBillDetail'),data)
  }else{
    return Post(fullUrl('api/applet/inpatient/InHospital/GetCategoryBillDetail'),data)
  }
}
export const setDefaultInHospCard = (data: {id: number}) => {
  return Get(fullUrl('api/applet/inpatient/InHospital/SetDefault'),data)
}
export const fetchInHospBillCategories = (data: {registerId: string, billDate: string, inCardNo?: string}) => {
  if(custom.hospName === 'jszyy'){
    return Post(fullUrl('api/customize/applet/inpatient/InHospital/GetCategoryBillList'),data)
  }else{
    return Post(fullUrl('api/applet/inpatient/InHospital/GetCategoryBillList'),data)
  }
}
export const unbindHospCard = (data: {id: number}) => {
  return Post(fullUrl('api/applet/inpatient/InHospital/Unbound',data))
}
export const fetchInpatientRegNotices = (data: {idenNo: string, patientName: string}) => {
  return Post(fullUrl('api/applet/inpatient/InHospital/GetMedicalNotice'),data)
}
export const fetchInpatientRegInfo = (data: {idenNo: string, inHospDate: string, patientName: string}) => {
 return Post(fullUrl('api/applet/inHospital/GetMedicalRecords'),data)
}