import config from '@/custom/index'

const baseUrl = config.baseUrl
const subUrl = config.subUrl
const fullUrl = (url: string, params?: { [key: string]: any }) => {
  let a
  if(/^subApi\//.test(url)){
    // 核算退费的接口要使用另外一个域名
    url = url.replace(/^subApi\//,'')
    a = `${subUrl}/${url}`
  }else{
    a = `${baseUrl}/${url}`
  }
  
  if (!a.includes('?')) a += '?'
  if (params) {
    Object.keys(params).forEach((key, index) => {
      a += `&${key}=${params[key]}`
    })
  }
  // a += `&_=${new Date().valueOf()}`
  return a
}

export { fullUrl }
