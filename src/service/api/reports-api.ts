import { fullUrl, Post } from "../http";
import { REPORT_TYPE_EN, REPORT_ITEM_TYPE_CN } from '../../enums'

export const fetchReportsList = (data: {itemType: REPORT_ITEM_TYPE_CN, reportType: REPORT_TYPE_EN}) => {
  return Post(fullUrl('api/applet/report/CheckReport/GetCheckReportList'),data)
}
export const fetchReportsDetail = (data: {itemType: REPORT_ITEM_TYPE_CN, reportType: REPORT_TYPE_EN, examId: string, examDate: string}) => {
  return Post(fullUrl('api/applet/report/CheckReport/GetCheckDetail'),data)
}
export const fetchInspectionDetail = (data: {itemType: REPORT_ITEM_TYPE_CN, reportType: REPORT_TYPE_EN, examId: string, examDate: string}) => {
  return Post(fullUrl('api/applet/report/CheckReport/GetInspectionDetail'),data)
}