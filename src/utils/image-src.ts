const imageBaseUrl = 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/'

export const getImageSrc = (name: string) => {
  return `${imageBaseUrl}${name}`
}