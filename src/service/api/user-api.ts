import * as Taro from '@tarojs/taro'
import config from '@/config/index'
import { Get, fullUrl, Post } from "../http";

const baseUrl = config.baseUrl

export const login = (data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      method:'POST',
      url: baseUrl + '/Authorized/Login',
      data: data,
      header: {
        'content-Type': 'application/json',
      },
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
export const updateUserInfo = (data:any={}) => {
  return Post(fullUrl('Authorized/GetUserInfo'),data)
}
export const getHealthCards = () => {
  return Post(fullUrl('Card'))
}
export const createCard = (data: any) => {
  return Post(fullUrl('Card/CreateCardWX'),data)
}