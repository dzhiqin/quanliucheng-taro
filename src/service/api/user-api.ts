import * as Taro from '@tarojs/taro'
import {custom} from '@/custom/index'
import { fullUrl, Post } from "../http";

const baseUrl = custom.baseUrl

export const login = (data:{code: string}) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      method:'POST',
      url: baseUrl + '/api/applet/patient/Authorized/Login',
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
  return Post(fullUrl('api/applet/patient/Authorized/GetUserInfo'),data)
}
