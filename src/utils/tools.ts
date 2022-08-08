import * as Taro from '@tarojs/taro'
import UTF8 from 'crypto-js/enc-utf8'
import CryptoJS from 'crypto-js/crypto-js'

const key = '5cf59db892044f7c84d02aeb'
const iv = 'cf0d3a19'
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
  // 预约挂号0 当天挂号1, 默认为0
  const regType = Taro.getStorageSync('isReg')
  return regType ? regType : '0'
}
export const checkOverTime = (date: string,time = '18:00',reservedTime: number) => {
  if(!date) return false
  const current = new Date().getTime()
  let dateTime = new Date(date + ' ' + time).getTime()
  if(reservedTime){
    // reservedTime 预留时间，有的医院要求提前2小时才可退号
    dateTime = dateTime - reservedTime
  }
  return current > dateTime
}
export const computeDistanceFromLatLong = (lat1,lon1,lat2,lon2) => {
  // lat1 用户的纬度
  // lon1 用户的经度
  // lat2 医院的纬度
  // lon2 医院的经度
  var R = 6378137; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in m
  return d.toFixed(2);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
export const encryptByDES = (message) => {
  const encrypted = CryptoJS.DES.encrypt(message, UTF8.parse(key), {
    iv: UTF8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}
export function decryptByDES(ciphertext) {
  const keyHex = UTF8.parse(key);
  const ivHex = UTF8.parse(iv);
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
  }, keyHex, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: ivHex
  });
  return decrypted.toString(UTF8);
}