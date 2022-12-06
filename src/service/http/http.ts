import * as Taro from '@tarojs/taro'
import { toastService } from '../toast-service'
// import { login } from '@/service/api/user-api'
// import { fetchBranchHospital } from '@/service/api'
// import { CardsHealper } from '@/utils/cards-healper'

interface Response {
  resultCode: number
  message?: string
  result?: boolean
  popUpCode?: number
}
export interface HttpResponse extends Response {
  data?: any
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
let version = 'develop'
if(process.env.TARO_ENV === 'weapp'){
  version = __wxConfig.envVersion  // 开发版develop；体验版trial；正式版release
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
    // const startTime = new Date().valueOf()
    Taro.request({
      method,
      url,
      data,
      header: Object.assign({},header,getHeaderAuth()),
      success: (res: Taro.request.SuccessCallbackResult) => {
        // const endTime = new Date().valueOf()
        resolve(res.data as HttpResponse)
        if(res.data.resultCode === 1 && res.data.message === '请先登录授权'){
          // handleLogin()
        }
        // console.log('request spent: ',endTime - startTime);
        if(version !== 'release'){
          const api = url.split('/').pop()
          console.log(`============${api}=============`)
          console.log('【请求】',url)
          console.log(`【入参】${ data ? JSON.stringify(data) : '无'}`);
          console.log(`【token】${getHeaderAuth().token}`)
          console.log(`【返回】`,res.data)
        }
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
// const handleLogin = () => {
//   Taro.login({
//     success: res => {
//       let { code } = res
//       login({code}).then((result:any) => {
//         if(result.statusCode === 200) {
//           const {data: {data}} = result
//           Taro.setStorageSync('token', data.token)
//           Taro.setStorageSync('openId', data.openId)
//           fetchBranchHospital().then(resData => {
//             if(resData.data && resData.data.length === 1){
//               Taro.setStorageSync('hospitalInfo',resData.data[0])
//               CardsHealper.updateAllCards()
//               // Taro.navigateTo({url: '/pages/login/login'})
//             }
//           })
//         }
//       }).catch(() => {
//         Taro.showToast({
//           title: '获取token失败',
//           icon: 'none'
//         })
//       })
//     }
//   })
// }
export { Request, Get, Post, DownloadFile, UploadFile }
