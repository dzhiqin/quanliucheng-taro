import { fullUrl, Post } from "../http";
import { reportType_EN, reportItemType_CN } from '../../enums'

export const fetchReportsList = (data: {itemType: reportItemType_CN, reportType: reportType_EN}) => {
  return Post(fullUrl('report/CheckReport/GetCheckReportList'),data)
}
export const fetchReportsDetail = (data: {itemType: reportItemType_CN, reportType: reportType_EN, examId: string, examDate: string}) => {
  return Post(fullUrl('report/CheckReport/GetCheckDetail'),data)
}