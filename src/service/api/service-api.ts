import { custom } from "@/custom/index";
import { fullUrl, Post, Get } from "../http";

export const getWaitingList = (data:{queueDate: string}) => {
  return Get(fullUrl('api/applet/appt/WaitingReport/GetWaitingInfo'),data)
}
export const fetchCheckInInfo = (data?: {branchId?:string, deptId?: string}) => {
  return Get(fullUrl('api/applet/appt/WaitingReport/GetReportInfo'),data)
}
export const handleCheckIn = (data:{visitDate:string,visitNo: string,branchNo: string, hisOrderId: string,deptId: string}) => {
  return Post(fullUrl('api/applet/appt/WaitingReport/DoReport'),data)
}
export const getEpidemiologicalSurveyInfo = () => {
  return Get(fullUrl('api/customize/applet/Questionnaire/GetQuestionnaireItemList'))
}
export const getEpidemiologicalSurveyQuestions = (data: {typeId: number}) => {
  return Get(fullUrl('api/customize/applet/Questionnaire/GetQuestionnaireForm'),data)
}
export const getEpidemiologicalSurveyState = () => {
  return Get(fullUrl('api/customize/applet/Questionnaire/HasbeenFilled'))
}
export const getEpidemiologicalSurveyAnswers = (data: {questionnaireReportId: number}) => {
  return Get(fullUrl('api/customize/applet/Questionnaire/GetQuestionnaireReportAnswer'),data)
}
// ╮(╯▽╰)╭后端需要一个空的orderNo
export const handleSubmitEpidemiologicalSurvey = (data: {questionnaireId: number, answers: any, orderNo: ''}) => {
  return Post(fullUrl('api/customize/applet/Questionnaire/SaveQuestionnaireReport'),data)
}
export const getRegisterDepositOrderList = (data: {cardNo: string}) => {
  return Get(fullUrl('api/customize/applet/Bill/GetBillPrePayOrderList'),data)
}
export const getRegisterDepositOrderDetail = (data: {orderNo: string}) => {
  return Get(fullUrl('api/customize/applet/Bill/GetBillPrePayOrderDetail'),data)
}
export const fetchRegisterDepositPayParams = (data:{cardNo: string, money: string}) => {
  return Post(fullUrl('api/customize/applet/Bill/Prepay'),data)
}
export const cancelRegisterDepositOrder = (data: {orderNo: string}) => {
  return Post(fullUrl('api/customize/applet/Bill/CancelOrder'),data)
}
export const getRegisterDepositOrderStatus = (data: {orderNo: string}) => {
  return Get(fullUrl('api/customize/applet/Bill/CheckOrderStatus'),data)
}
export const fetchRecoveryFee = () => {
  return Post(fullUrl('api/applet/paybill/SupplementaryPay/GetOrderInfo'))
}
export const fetchRecoveryPayParams = () => {
  return Post(fullUrl('api/applet/paybill/SupplementaryPay/PayBill'))
}
export const sendSmsByFeiGe = (data: {mobile: string, content: number}) => {
  const {apikey,secret,sign_id,template_id} = custom.feat.bindCard.smsVerify
  return Post('https://api.4321.sh/sms/template',{
    apikey,
    secret,
    mobile: data.mobile,
    content: data.content,
    sign_id,
    template_id
  })
}
export const getSurvey = (data:{typeId: string}) => {
  return Get(fullUrl('api/applet/Questionnaire/GetQuestionnaireForm',data))
}
export const submitSurvey = (data) => {
  return Post(fullUrl('api/applet/Questionnaire/SaveQuestionnaireReport'),data)
}