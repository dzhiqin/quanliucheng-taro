import { fullUrl, Post, Get } from "../http";

export const fetchInHospCards = () => {
  return Post(fullUrl('api/applet/inpatient/InHospital/GetAllInpCard'))
}
export const getInHospBillList = (data: {inCardNo: string}) => {
  return Get(fullUrl('api/applet/inpatient/InHospital/GetInpBillList'),data)
}
export const bindCardByCardNameAndNo = (data: {inCardNo: string, inCardName: string}) => {
  return Post(fullUrl('api/applet/inpatient/InHospital/BindCard'),{...data, isDefalut: true})
}
export const bindCardByCardNo = (data: {inCardNo: string}) => {
  return Get(fullUrl('api/applet/inpatient/InHospital/GetInpatientInfo'),data)
}
export const getInHospInfo = (data: {inCardNo: string}) => {
  return Get(fullUrl('api/applet/inpatient/InHospital/GetInpatientInfo'),data)
}
export const fetchInHospBillDetail = (data: {registerId: string, billDate: string}) => {
  return Post(fullUrl('api/applet/inpatient/InHospital/GetAllCategoryBillDetail'),data)
}