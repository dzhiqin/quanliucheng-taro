import * as Taro from '@tarojs/taro'
import { toastService } from '../toast-service'

interface Response {
  resultCode: number
  message?: string
  result?: boolean
  popUpCode?: number
}
export interface HttpResponse extends Response {
  data?: object | string | any
}

export interface DownloadResponse extends Response {
  tempFilePath?: string
}

export interface UploadResponse extends Response {
  data?: object | string
}
const getHeaderAuth = () => {
  // let auth = Taro.getStorageSync('auth')
  // let headerAuth = {}
  // if(auth) {
  //   auth = JSON.parse(auth)
  //   headerAuth = {
  //     'access-token': auth ? auth.accessToken : '',
  //     client: auth ? auth.client : '',
  //     uid: auth ? auth.uid : ''
  //   }
  // }
  // return headerAuth
  let token = Taro.getStorageSync('token')
  let headerAuth = {token:''}
  if(token){
    headerAuth.token = token
  }
  return headerAuth
}
const Request = (
  method:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'HEAD'
    | 'OPTIONS'
    | 'TRACE',
  url: string,
  data?: string | object,
  header?: { 'Content-Type': 'application/x-www-form-urlencoded' }
): Promise<HttpResponse> => {
  return new Promise((resolve, reject) => {
    Taro.request({
      method,
      url,
      data,
      header: Object.assign({},header,getHeaderAuth()),
      success: (res: Taro.request.SuccessCallbackResult) => {
        resolve(res.data as HttpResponse)
      },
      fail: (err: Taro.General.CallbackResult) => {
        toastService({title: '请求失败：' + err})
        const resp: HttpResponse = { resultCode: -1, message: err.errMsg }
        reject(resp)
      },
    })
  })
}

const Get = (url: string, data?: string | object) => Request('GET', url, data)

const Post = (url: string, data?: string | object) => Request('POST', url, data)

const DownloadFile = (url: string, header?: {}): Promise<DownloadResponse> => {
  return new Promise((resolve, reject) => {
    Taro.downloadFile({
      url,
      header: Object.assign(getHeaderAuth(), header),
      success: (res: Taro.downloadFile.FileSuccessCallbackResult) => {
        resolve({
          resultCode: res.statusCode,
          tempFilePath: res.tempFilePath,
        })
      },
      fail: (err: Taro.General.CallbackResult) => {
        const resp: DownloadResponse = { resultCode: -1, message: err.errMsg }
        reject(resp)
      }
    })
  })
}

const UploadFile = (
  url: string,
  filePath: string,
  name: string,
  header?: { 'content-type': 'multipart/form-data' },
  formData?: Object
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url,
      filePath,
      name,
      header: Object.assign(getHeaderAuth(), header),
      formData,
      success: (res: Taro.uploadFile.SuccessCallbackResult) => {
        resolve({ resultCode: res.statusCode, data: res.data })
      },
      fail: (err: Taro.General.CallbackResult) => {
        const resp: UploadResponse = { resultCode: -1, message: err.errMsg }
        reject(resp)
      },
    })
  })
}

export { Request, Get, Post, DownloadFile, UploadFile }
