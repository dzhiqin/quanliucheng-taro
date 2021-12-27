const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export const humanDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}
export const humanDateAndTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const dateStr = [year, month, day].map(formatNumber).join('-')
  const timeStr = [hours, minutes, seconds].map(formatNumber).join(':')
  return dateStr + ' ' + timeStr
}