export interface Card {
  openId?: string;
  cardId: 0;      // 就诊卡
  wechatCode: string;
  cardNo: string;
  patientName: string;
  idenNo: string;
  idenType: 0;
  phone: string;
  address: string;
  isDefault: true;
  gender: string;
  birthday: string;
  nation: string;
  qrCodeText: string;
  healthCardId: string;
  patientId: string;
  isGetCode: true;
  cardType: 0;          // 证件类型
  parentID: string;     // 监护人证件号
  parentName: string;   // 监护人姓名
  isHaveCard: true;     // 是否有院内就诊卡
  maritalStatus: string; // 婚姻状况
  nationality: string
}