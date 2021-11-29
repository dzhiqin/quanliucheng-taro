import * as Taro from '@tarojs/taro'
import custom from '@/custom/index'
import { Get, fullUrl, Post } from "../http";

const baseUrl = custom.baseUrl

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
