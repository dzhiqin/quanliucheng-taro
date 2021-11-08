import config from '../../global'

const baseUrl = config.baseUrl

const fullUrl = (url: string, params?: { [key: string]: any }) => {
  let a = `${baseUrl}/${url}`
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
