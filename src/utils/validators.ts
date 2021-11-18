export const phoneValidator = (phone) => {
  return (/^1[3456789]\d{9}$/.test(phone))
}
export const idCardValidator = (value: string) => {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(value)
}
export const validateMessages = {
  name: '请填写姓名',
  cardType: '请选择证件类型',
  idCardNo: '请填写证件号码',
  gender: '请选择性别',
  birthday: '请选择出生日期',
  cellphone: '请填写手机号',
  address: '请填写详细地址',
  isDefault: '是否设置默认卡',
  parentName: '请填写监护人姓名',
  parentId: '请填写监护人身份证',
  hasHospitalCard: '是否有院内就诊卡',
  hospitalCardNo: '请填写就诊卡号',
  marital: '请填写婚姻状况',
  nationality: '请填写国籍'
}
export const birthdayValidator = (value: string) => {
  const current = new Date()
  const date = new Date(value)
  return date <= current
}