export interface Card {
  cardNo?: string;      // 就诊卡号
  wechatCode: string;
  patientName: string;  // 患者姓名
  idenNo?: string;       // 证件号码
  idenType: number;    // 证件类型
  phone: string;        // 手机号
  address: string;
  isDefault: true;
  gender: string;
  birthday: string;
  patientId: string;  // 患者id，后端返回，同cardNo？
  isGetCode?: true;
  cardType: 0;          // 证件类型
  parentId?: string;     // 监护人证件号
  parentName?: string;   // 监护人姓名
  isHaveCard: true;     // 是否有院内就诊卡
  maritalStatus?: string; // 婚姻状况
  nationality?: string,
  name?: string,  // 同patientName，后端返回name，入参却是patientName ╮(╯▽╰)╭
  id?: number,  // 就诊卡id，后端返回
  feeType?: string,
  idNOHide?: string, // 后端返回
  phoneNumberHide?: string, // 后端返回
  qrcode?: string,     // 后端返回
  qrCodeText?: string, // 后端返回
  trueIdenNo?: string, // 后端返回
  truePhone?: string,  // 后端返回
  type?: string      // 后端返回
}