export enum regType {
  appointment = '0',  // 预约挂号
  introday = '1'      // 当天挂号
}
export enum payType {
  // 值待定
  selfPay = '',// 自费
  yiBao = ''   // 医保
}
export enum reportType_EN {
  clinic = '0',   // 门诊报告
  hospitalization = '1'// 住院报告
}
export enum reportItemType {
  jianYan = 'C',  // 检验 、 化验
  jianCha = 'D',  // 检查
  bingLi = 'E',   // 病理
  chanQianChaoSheng = 'P',// 产前超声
  neiJing = 'N',  // 内镜
  chaoSheng = 'U',// 超声
  fangShe = 'R'   // 放射
}
export enum reportItemType_CN {
  '化验' = 'C',  // 检验 、 化验
  '检查' = 'D',  // 检查
  '病理' = 'E',   // 病理
  '产前超声' = 'P',// 产前超声
  '内镜' = 'N',  // 内镜
  '超声' = 'U',// 超声
  '放射' = 'R'   // 放射
}
export enum pactCode_EN {
  'selfPay' = '1',
  'YiBao' = '3'
}
export enum orderPayType_CN {
  '自费' = '0',
  '医保' = '1'
}
export enum orderStatus_EN {
  unpay = 0,
  paying = 1,
  paySuccess = 2,
  payFailed = 3,
  paySuccess_and_His_success = 4,   // 支付成功，通知His成功
  paySuccess_and_His_fail = 5,      // 支付成功，但通知His失败
  cancelPay = 6
}
export enum orderStatus_CN {
  '未缴费' = 0,
  '缴费中' = 1,
  '支付成功' = 2,
  '支付失败' = 3,
  '缴费成功' = 4,   // 支付成功，通知His成功
  '缴费失败' = 5,      // 支付成功，但通知His失败
  '取消支付' = 6
}
export enum payStatus_EN {
  unpay = 0, 
  paid = 1,
  refunded = 2,
  refundFailed = 3,
  refunding = 4
}
export enum orderSearchType_EN {
  current = 'current',
  history = 'history'
}