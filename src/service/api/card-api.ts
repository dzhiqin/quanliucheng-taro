import { fullUrl, Post } from "../http";

export const getRegisterNotice = () => {
  return Post(fullUrl('SysNotice/GetRegistrationNotice'))
}
export const getHealthCards = () => {
  return Post(fullUrl('Card'))
}
export const createCard = (data: any) => {
  return Post(fullUrl('Card/CreateCardWX'),data)
}
export const deleteCard = (data: any) => {
  return Post(fullUrl(`Card/Delete?id=${data.id}`),data)
}
export const setDefaultCard = (data: any) => {
  return Post(fullUrl(`Card/SetDefault?id=${data.id}`),data)
} 
