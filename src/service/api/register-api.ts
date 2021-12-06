import { fullUrl, Post } from "../http";

export const getBranchHospital = (data) => {
  return Post(fullUrl('SignalSource/GetHospitalAll'),data)
}
export const getDepatmentList = (data) => {
  return Post(fullUrl('SignalSource/GetAllDeptInfo'),data)
}
export const getPreviousVisits = (data) => {
  return Post(fullUrl('SignalSource/GetRegisterOrder'),data)
}
export const getDoctorsByDefault = (data) => {
  return Post(fullUrl('SignalSource/GetScheduleDays'),data)
}
export const getDoctorsByDate = (data) => {
  return Post(fullUrl('SignalSource/GetTimeSlicesBySchedule'),data)
}