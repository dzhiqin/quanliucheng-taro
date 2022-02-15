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
  return Get(fullUrl('subApi/api/customize/applet/Questionnaire/GetQuestionnaireItemList'))
}
export const getEpidemiologicalSurveyQuestions = (data: {typeId: number}) => {
  return Get(fullUrl('subApi/api/customize/applet/Questionnaire/GetQuestionnaireForm'),data)
}
export const getEpidemiologicalSurveyState = () => {
  return Get(fullUrl('subApi/api/customize/applet/Questionnaire/HasbeenFilled'))
}
export const getEpidemiologicalSurveyAnswers = (data: {questionnaireReportId: number}) => {
  return Get(fullUrl('subApi/api/customize/applet/Questionnaire/GetQuestionnaireReportAnswer'),data)
}
// ╮(╯▽╰)╭后端需要一个空的orderNo
export const handleSubmitEpidemiologicalSurvey = (data: {questionnaireId: number, answers: any, orderNo: ''}) => {
  return Post(fullUrl('subApi/api/customize/applet/Questionnaire/SaveQuestionnaireReport'),data)
}