import { getBranchId } from "@/utils/tools";
import { fullUrl, Post } from "../http";

export const fetchOfficialContent = () => {
  return Post(fullUrl('api/applet/content/Micro/GetHome'))
}
export const fetchClinicList = () => {
  return Post(fullUrl('api/applet/content/Micro/GetDetpList'))
}
export const fetchClinicIntro = (data: {deptId: string}) => {
  return Post(fullUrl('api/applet/content/Micro/GetDetpDetail'),data)
}
export const fetchClinicDoctors = (data: {deptId: string}) => {
  return Post(fullUrl('api/applet/content/Micro/GetDoctorList'),{...data, branchId: getBranchId()})
}
export const fetchDoctorDetail = (data: {deptId: string,doctorId: string}) => {
  return Post(fullUrl('api/applet/content/Micro/GetDoctorDetail'),data)
}
export const fetchGuideList = () => {
  return Post(fullUrl('api/applet/content/Micro/GetMicroGuide'))
}