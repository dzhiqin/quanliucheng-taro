import {custom} from '@/custom/index'

const baseUrl = custom.baseUrl
const subUrl = custom.subUrl
const fullUrl = (url: string, params?: { [key: string]: any }) => {
  let a
  if(/^subApi\//.test(url)){
    // ‘subApi’开头的url，使用的是附加功能的测试环境
    url = url.replace(/^subApi\//,'')
    a = `${subUrl}/${url}`
  }else{
    a = `${baseUrl}/${url}`
  }
  
  if (!a.includes('?')) a += '?'
  if (params) {
    Object.keys(params).forEach((key, index) => {
      if(index === 0){
        a += `${key}=${params[key]}`
      }else{
        a += `&${key}=${params[key]}`
      }
    })
  }
  // a += `&_=${new Date().valueOf()}`
  return a
}

export { fullUrl }
