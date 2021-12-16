import { fullUrl, Post } from "../http";

export const fetchRegisterNotice = () => {
  return Post(fullUrl('SysNotice/GetRegistrationNotice'))
}
export const fetchHealthCards = () => {
  return Post(fullUrl('UserCard/GetAllCard'))
}
export const createCard = (data: any) => {
  return Post(fullUrl('UserCard/CreateCardWX'),data)
}
export const deleteCard = (data: any) => {
  return Post(fullUrl(`UserCard/Delete?id=${data.id}`),data)
}
export const setDefaultCard = (data: any) => {
  return Post(fullUrl(`UserCard/SetDefault?id=${data.id}`),data)
} 
export const fetchHealthCardInfo = (data: {cardId: string}) => {
  return Post(fullUrl('UserCard/GetHealthCardInfo'),data)
}
export const bindHealthCard = () => {
  return Post(fullUrl('UserCard/BindHealthCard'))
}
export const fetchCardInfoByHealthCode = (data: {healthCode: string}) => {
  return Post(fullUrl('UserCard/BindHealthCodeInfo'),data)
}
export const fetchNationalities = () => {
  return Post(fullUrl('UserCard/GetNationalitieList'))
}