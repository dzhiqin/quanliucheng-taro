import * as Taro from '@tarojs/taro'
import { Get, fullUrl } from "../http";

const baseUrl = 'http://192.168.2.34:3001'

export const login = (data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      method:'POST',
      url: baseUrl + '/api/wechat/login',
      // url: fullUrl('api/wechat/login'),
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
