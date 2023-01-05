import { custom } from '@/custom/index'
import * as Taro from '@tarojs/taro'
import { modalService } from '../toast-service'
import monitor from '@/utils/alipayLogger'
import { ORDER_STATUS_EN } from '@/enums/index'

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
// const monitorApis = ['CreateCardWX','GetCreateRegOrder','GetCheckDetail','GetOrderList','GetBillOrderRecord']
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
    const startTime = new Date().valueOf()
    Taro.request({
      method,
      url,
      data,
      header: Object.assign({},header,getHeaderAuth()),
      success: (res: Taro.request.SuccessCallbackResult) => {
        const endTime = new Date().valueOf()
        resolve(res.data as HttpResponse)
        // if(res.data.resultCode === 1 && res.data.message === '请先登录授权'){
        //   handleLogin()
        // }
        
        if(Taro.getStorageSync('envVersion') !== 'release'){
          const api = url.split('/').pop()
          console.log(`============${api}=============`)
          console.log('【请求】',url)
          console.log('【耗时】: ',endTime - startTime,'ms');
          console.log(`【入参】${ data ? JSON.stringify(data) : '无'}`);
          console.log(`【token】${getHeaderAuth().token}`)
          console.log(`【返回】`,res.data)
        }
        if(custom.feat.guangHuaMonitor){
          if(res.data.resultCode === 1) return
          if(url === 'GetBillStatus' && res.data.data === ORDER_STATUS_EN.paySuccess_and_His_success){
            handleGHApiReport('门诊缴费',endTime-startTime)
            return
          }
          if(url === 'GetRegStatus' && res.data.data.isSuccess ){
            handleGHApiReport('挂号缴费',endTime-startTime)
            return
          }
          if(url === 'GetCreateRegOrder'){
            handleGHApiReport('预约挂号',endTime-startTime)
            return
          }
          if(url === 'GetCheckDetail'){
            handleGHApiReport('报告查询',endTime-startTime)
            return
          }
        }
      },
      fail: (err: Taro.General.CallbackResult) => {
        modalService({title: '请求失败',content: JSON.stringify(err)})
        const resp: HttpResponse = { resultCode: -1, message: err.errMsg }
        reject(resp)
      },
    })
  })
}
const handleGHApiReport = (api,time) => {
  monitor.api({api:api,success:true,c1:"taSR_YL",time:time})
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
