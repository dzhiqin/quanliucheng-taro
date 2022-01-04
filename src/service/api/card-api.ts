import { fullUrl, Post } from "../http";

export const fetchRegisterNotice = () => {
  return Post(fullUrl('api/applet/content/SysNotice/GetRegistrationNotice'))
}
export const fetchHealthCards = () => {
  return Post(fullUrl('api/applet/patient/UserCard/GetAllCard'))
}
export const createCard = (data: any) => {
  return Post(fullUrl('api/applet/patient/UserCard/CreateCardWX'),data)
}
export const deleteCard = (data: any) => {
  return Post(fullUrl(`api/applet/patient/UserCard/Delete?id=${data.id}`),data)
}
export const setDefaultCard = (data: any) => {
  return Post(fullUrl(`api/applet/patient/UserCard/SetDefault?id=${data.id}`),data)
} 
export const fetchHealthCardInfo = (data: {cardId: string}) => {
  return Post(fullUrl('api/applet/patient/UserCard/GetHealthCardInfo'),data)
}
export const bindHealthCard = () => {
  return Post(fullUrl('api/applet/patient/UserCard/BindHealthCard'))
}
export const fetchCardInfoByHealthCode = (data: {healthCode: string}) => {
  return Post(fullUrl('api/applet/patient/UserCard/BindHealthCodeInfo'),data)
}
export const fetchNationalities = () => {
  return Post(fullUrl('api/applet/patient/UserCard/GetNationalitieList'))
}