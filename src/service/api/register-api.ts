import { getBranchId, getRegType } from "@/utils/tools";
import { fullUrl, Post } from "../http";

export const fetchBranchHospital = () => {
  return Post(fullUrl('SignalSource/GetHospitalAll'),{branchId: getBranchId()})
}
export const fetchDepatmentList = () => {
  return Post(fullUrl('SignalSource/GetAllDeptInfo'),{branchId: getBranchId()})
}
export const searchDeptOrDoctor = (data: {keyword: string}) => {
  return Post(fullUrl('SignalSource/SearchDepartOrDr'),{...data,branchId: getBranchId()})
}
export const fetchPreviousVisits = () => {
  return Post(fullUrl('SignalSource/GetRegisterOrder'),{branchId: getBranchId()})
}
export const fetchDoctorsByDefault = (data: {deptId: string,doctorId?: string}) => {
  return Post(fullUrl('SignalSource/GetScheduleDays'),{...data, branchId: getBranchId(), isReg: getRegType()})
}
export const fetchDoctorsByDate = (data: {deptId: string, doctorId?: string, regDate: string}) => {
  return Post(fullUrl('SignalSource/GetTimeSlicesBySchedule'),{...data, branchId: getBranchId(), isReg: getRegType()})
}
export const fetchClinicsByDeptId = (data: {deptId: string}) => {
  return Post(fullUrl('SignalSource/GetDoctorSpecializedClassifyList'),{...data, branchId: getBranchId(), isReg: getRegType()})
}
export const fetchDoctorsBySubject = (data: {deptId: string,specializedSubject: string}) => {
  return Post(fullUrl('SignalSource/GetTimeSlicesBySpecializedClassify'),{...data, branchId: getBranchId(), isReg: getRegType()})
}
export const fetchDoctorsByDept = (data: {deptId: string}) => {
  return Post(fullUrl('SignalSource/GetDoctorNameClassifyList'),{...data,branchId: getBranchId(), isReg: getRegType()})
}
export const fetchScheduleDays = () => {
  return Post(fullUrl('SignalSource/GetRegScheduleDays'),{isReg: getRegType()})
}
export const fetchDoctorSchedules = (data: {deptId: string,doctorId:string,regDate:string}) => {
  return Post(fullUrl('SignalSource/GetScheduleDaysByDoctor'),{...data,branchId: getBranchId(), isReg: getRegType()})
}
export const fetchTimeListByDate = (data: {deptId: string,doctorId: string, regDate: string, regType?: string, address?: string}) => {
  return Post(fullUrl('SignalSource/GetScheduleTimePoints'),{...data,branchId: getBranchId()})
}
interface fetchOrderFeeParams {
  patientId: string,
  cardNo: string,
  sourceType: string,
  pactCode: string, // 合同单位 默认1
  schemaId: string,
  sliceId: string,
  regTypeId: string,
  regDate: string,
  regDept: string,
  regDoctor: string,
  isReg?: string
}
export const fetchOrderFee = (data: fetchOrderFeeParams) => {
  return Post(fullUrl('Reg/GetRegMoney'),{...data, isReg: getRegType()})
}