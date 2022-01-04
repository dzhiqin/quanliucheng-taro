import config from '@/custom/index'

const baseUrl = config.baseUrl
const subUrl = config.subUrl
const fullUrl = (url: string, params?: { [key: string]: any }) => {
  let a
  if(/^subApi/.test(url)){
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
