import { getBranchId, getRegType } from "@/utils/tools";
import { fullUrl, Post } from "../http";

export const fetchBranchHospital = () => {
  return Post(fullUrl('SignalSource/GetHospitalAll'),{branchId: getBranchId()})
}
export const fetchDepatmentList = (data) => {
  return Post(fullUrl('SignalSource/GetAllDeptInfo'),data)
}
export const searchDeptOrDoctor = (data: {keyword: string}) => {
  return Post(fullUrl('SignalSource/SearchDepartOrDr'),{...data,branchId: getBranchId()})
}
export const fetchPreviousVisits = () => {
  return Post(fullUrl('SignalSource/GetRegisterOrder'),{branchId: getBranchId()})
}
export const fetchDoctorsByDefault = (data: {deptId: string,doctorId: string}) => {
  return Post(fullUrl('SignalSource/GetScheduleDays'),{...data, branchId: getBranchId(), isReg: getRegType()})
}
export const getDoctorsByDate = (data: {deptId: string, doctorId: string, regDate: string}) => {
  return Post(fullUrl('SignalSource/GetTimeSlicesBySchedule'),{...data, branchId: getBranchId(), isReg: getRegType()})
}