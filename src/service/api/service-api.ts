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