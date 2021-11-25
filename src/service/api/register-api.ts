import { fullUrl, Post } from "../http";

export const getBranchHospital = (data) => {
  return Post(fullUrl('SignalSource/GetHospitalAll'),data)
}