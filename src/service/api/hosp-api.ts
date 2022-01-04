import { fullUrl, Post } from "../http";

export const fetchInHospCards = () => {
  return Post(fullUrl('api/applet/inpatient/InHospital/GetAllInpCard'))
}
export const fetchInHospBillList = (data: {inCardNo: string}) => {
  return Post(fullUrl('/api/applet/inpatient/InHospital/GetInpBillList'),data)
}