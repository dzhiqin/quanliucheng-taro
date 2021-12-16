import * as Taro from '@tarojs/taro'

export const getBirthdayByIdCard = (id) => {
  let date = ''
  if (id.length == 15) {
    var year = id.substring(6, 8)
    var month = id.substring(8, 10)
    var day = id.substring(10, 12)
    date = '19' + year + '-' + month + '-' + day
  } else if (id.length == 18) {
    var year = id.substring(6, 10)
    var month = id.substring(10, 12)
    var day = id.substring(12, 14)
    date = year + '-' + month + '-' + day
  }
  return date
}
export const getGenderByIdCard = (idCard) => {
  var sexStr = '';
  if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
    sexStr = '男';
  } else {
    sexStr = '女';
  }
  return sexStr;
}
export const getBranchId = () => {
  const hospitalInfo = Taro.getStorageSync('hospitalInfo')
  if(hospitalInfo){
    return hospitalInfo.branchId
  }else{
    return ''
  }
}
export const getRegType = () => {
  // 预约挂号0 当天挂号1
  const regType = Taro.getStorageSync('regType')
  return regType ? regType : '0'
}