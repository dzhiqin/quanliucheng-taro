import * as Taro from '@tarojs/taro'
import {custom} from '@/custom/index'
import { fullUrl, Post } from "../http";

const baseUrl = custom.baseUrl
export const handleLogin = () => {
  return new Promise((resolve) => {
    Taro.login({
      success: res => {
        const { code } = res
        login({code})
        .then((result: any) => {
          if(result.statusCode === 200){
            const { data: {data} } = result
            Taro.setStorageSync('token',data.token)
            Taro.setStorageSync('openId',data.openId)
            resolve({result: true, data: {...data}})
          }else{
            resolve({result: false, message: result.data.message})
          }
        })
        .catch(err => {
          resolve({result: false, data: err, message: '登陆失败'})
        })
      }
    })
  })
}
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
export const handleAuthCode = (data: {code: string,authType: 'basic' | 'ant' | '',}) => {
  return Post(fullUrl('api/applet/patient/Authorized/OauthCode'),data)
}
export const getUserInfo = () => {
  return Post(fullUrl('api/applet/patient/Authorized/GetUserInfo'),
  {
    nickName: '',
    gender: 0,
    city: '',
    province: '',
    country: '',
    avatarUrl: ''
  })
}