export enum REG_TYPE {
  appointment = '0',  // 预约挂号
  introday = '1'      // 当天挂号
}

export enum REPORT_TYPE_EN {
  clinic = '0',   // 门诊报告
  hospitalization = '1'// 住院报告
}
export enum REPORT_ITEM_TYPE_CN {
  '化验' = 'C',  // 检验 、 化验
  '检查' = 'D',  // 检查
  '病理' = 'E',   // 病理
  '产前超声' = 'P',// 产前超声
  '内镜' = 'N',  // 内镜
  '超声' = 'U',// 超声
  '放射' = 'R'   // 放射
}
export enum PACT_CODE_EN {
  'ZiFei' = '0',
  'YiBao' = '1'
}
export enum ORDER_TYPE_CN {
  '自费单' = '0',
  '医保单' = '1',
  '自助单' = '3'
}
export enum PAY_TYPE_CN {
  '微信' = '0',
  '医保' = '1',
  '支付宝' = '2'
}
export enum ORDER_STATUS_EN {
  unpay = 0,
  paying = 1,
  paySuccess = 2,
  payFailed = 3,
  paySuccess_and_His_success = 4,   // 支付成功，通知His成功
  paySuccess_and_His_fail = 5,      // 支付成功，但通知His失败
  cancelPay = 6
}
export enum ORDER_STATUS_CN {
  '未缴费' = 0,
  '缴费中' = 1,
  '支付完成' = 2,
  '支付失败' = 3,
  '缴费成功' = 4,   // 支付成功，通知His成功
  '缴费失败' = 5,      // 支付成功，但通知His失败
  '取消支付' = 6
}
export enum PAY_STATUS_EN {
  unpay = 0, 
  paid = 1,
  refunded = 2,
  refundFailed = 3,
  refunding = 4
}
export enum ORDER_SEARCH_TYPE_EN {
  current = 'current',
  history = 'history'
}
export enum HEALTH_CARD_RES_CODE {
  authorized = 2,
  no_auth_before = 3,
  auth_success = 4
}
export enum HEALTH_CARD_TYPE_EN {
  IdCard = 0, // 身份证
  ResidentAccountNo = 1,  // 居民户口编号
  PassPort = 2,   // 护照
  OfficersNo = 3, // 军官证
  MenZhen = 4,    // 门诊卡
  HongKongAndMaCaoPass = 5,// 港澳居民往来内地通行证
  TaiWanPass = 6, // 台湾居民往来内地通行证
  BirthCertificate = 7, // 出生证
  HongKongAndMacao = 8, // 港澳居民身份证
  Others = 9,     // 其他
  Children = 20   // 儿童
}
export enum PAYMENT_FROM {
  orderList = 'orderList',
  paymentList = 'paymentList',
  scanQRCode = 'scanQRCode',
  message = 'message'
}
export enum PAY_RESULT {
  INIT = '',
  SUCCESS = 'success',
  FAIL = 'fail'
}
export enum REGISTER_ORDER_STATUS {
  UNLOCK = 0,// 未锁号
  LOCK_FAILED = 2,// 锁号失败
  CANCEL_LOCK_SUCCESS = 5,// 取消锁号成功
  CANCEL_LOCK_FAILED = 6,// 取消锁号失败
  APPOINTMENT_FAILED = 9,// 预约失败
  CANCEL_APPOINTMENT_SUCCESS = 11,// 取消预约成功
  CANCEL_APPOINTMENT_FAILED = 12,// 取消预约失败
  PAYING = 13,// 支付中
  PAY_FAILED = 14,// 支付失败
  PAY_SUCCESS = 15, // 支付成功
  FETCHING_NUMBER = 16,//取号中
  FETCH_NUMBER_FAILED = 17,// 取号失败
  REFUND_FAILED = 20,// 退款失败
  REFUND_SUCCESS = 19, // 退款成功
  FETCH_NUMBER_SUCCESS = 21,// 取号成功
  REFUND_AND_CANCEL_SUCCESS = 24 // 退款退号成功
}
export enum CARD_ACTIONS {
  UPDATE_ALL = 'UPDATE_ALL',
  SET_DEFAULT_CARD = 'SET_DEFAULT_CARD',
  REMOVE_CARD = 'REMOVE_CARD'
}
export enum GH_REPORT_APIS { //上报光华平台的api
  CreateCardWX,
  GetCreateRegOrder,
  GetBillStatus,
  GetRegStatus,
  GetCheckDetail,
  GetOrderList, 
  GetBillOrderRecord
}
export enum INPATIENT_REG_STATUS {
  NOT_SUBMIT = 0,
  SUBMITTED = 1
}
export enum GENDER {
  MALE = '0',
  FEMALE = '1'
}