import { fullUrl, Post } from "../http";

export const getRegisterNotice = () => {
  return Post(fullUrl('SysNotice/GetRegistrationNotice'))
}