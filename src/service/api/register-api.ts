import { getBranchId, getRegType } from "@/utils/tools";
import { fullUrl, Post } from "../http";

export const fetchBranchHospital = () => {
  return Post(fullUrl('appt/SignalSource/GetHospitalAll'),{branchId: getBranchId()})
}
export const fetchDepatmentList = () => {
  return Post(fullUrl('appt/SignalSource/GetAllDeptInfo'),{branchId: getBranchId()})
}
export const searchDeptOrDoctor = (data: {keyword: string}) => {
  return Post(fullUrl('appt/SignalSource/SearchDepartOrDr'),{...data,branchId: getBranchId()})
}
export const fetchPreviousVisits = () => {
  return Post(fullUrl('appt/SignalSource/GetRegisterOrder'),{branchId: getBranchId()})
}
export const fetchDoctorsByDefault = (data: {deptId: string,doctorId?: string}) => {
  return Post(fullUrl('appt/SignalSource/GetScheduleDays'),{...data, branchId: getBranchId(), isReg: getRegType()})
}
export const fetchDoctorsByDate = (data: {deptId: string, doctorId?: string, regDate: string}) => {
  return Post(fullUrl('appt/SignalSource/GetTimeSlicesBySchedule'),{...data, branchId: getBranchId(), isReg: getRegType()})
}
export const fetchClinicsByDeptId = (data: {deptId: string}) => {
  return Post(fullUrl('appt/SignalSource/GetDoctorSpecializedClassifyList'),{...data, branchId: getBranchId(), isReg: getRegType()})
}
export const fetchDoctorsBySubject = (data: {deptId: string,specializedSubject: string}) => {
  return Post(fullUrl('appt/SignalSource/GetTimeSlicesBySpecializedClassify'),{...data, branchId: getBranchId(), isReg: getRegType()})
}
export const fetchDoctorsByDept = (data: {deptId: string}) => {
  return Post(fullUrl('appt/SignalSource/GetDoctorNameClassifyList'),{...data,branchId: getBranchId(), isReg: getRegType()})
}
export const fetchScheduleDays = () => {
  return Post(fullUrl('appt/SignalSource/GetRegScheduleDays'),{isReg: getRegType()})
}
export const fetchDoctorSchedules = (data: {deptId: string,doctorId:string,regDate:string}) => {
  return Post(fullUrl('appt/SignalSource/GetScheduleDaysByDoctor'),{...data,branchId: getBranchId(), isReg: getRegType()})
}
export const fetchTimeListByDate = (data: {deptId: string,doctorId: string, regDate: string, regType?: string, address?: string}) => {
  return Post(fullUrl('appt/SignalSource/GetScheduleTimePoints'),{...data,branchId: getBranchId()})
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
  return Post(fullUrl('appt/Reg/GetRegMoney'),{...data, isReg: getRegType()})
}
export const fetchRegFeeType = () => {
  return Post(fullUrl('appt/Reg/GetRegFeeType'))
}
export const createRegOrder = (data) => {
  return Post(fullUrl('appt/Reg/GetCreateRegOrder'),data)
}
export const fetchRegOrderStatus = (data: {orderId: string}) => {
  // 特殊处理，参数放在url里
  return Post(fullUrl('appt/Reg/GetRegStatus?orderId=' + data.orderId),data)
}
export const fetchRegOrderList = (data:{type: string}) => {
  return Post(fullUrl('appt/Reg/GetOrderList?type='+data.type),data)
}
export const cancelAppointment = (data: {orderId: string}) => {
  return Post(fullUrl('appt/Reg/RefundAppt?orderId=' + data.orderId),data)
}
export const fetchDeptsOrDoctors = (data:{keyword: string}) => {
  return Post(fullUrl('appt/SignalSource/SearchDepartOrDr'),{...data, branchId: getBranchId()})
}