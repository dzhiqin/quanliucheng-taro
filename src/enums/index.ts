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