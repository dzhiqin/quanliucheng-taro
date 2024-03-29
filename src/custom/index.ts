type HospName = 
  'guang_3_li_wan' |
  'guang_3_li_wan_test' |
  'en_ping_fu_you' |
  'li_wan_gu_ke' |
  'shun_de_jun_an' | 
  'jin_sha_zhou'|
  'guang_3_huang_pu' |
  'li_wan_zhong_xin' | 
  'jin_sha_zhou_alipay' |
  'guang_1_alipay'
const hospName:HospName = 'guang_3_li_wan_test'
const hospConfig = require(`./hosp-config/${hospName}.ts`)

export const custom = hospConfig.default as HospConfig
interface TabListItem {
  title: string,
  entrances: any[]
}
export interface HospConfig {
  latitude: number,
  longitude: number,
  banner: string,
  region: string[],
  hospName: string,
  hospitalName: string,
  address: string,
  logo: string,
  baseUrl: string,
  subUrl: string,
  isPrivate: boolean,//是否是私人医院，私人医院无法使用公立医院的订阅模板
  subscribes: {
    checkReminder: string,
    pendingPayReminder: string,
    visitReminder: string,
    closeNotice: string,
    satisfactionSurveyNotice: string,
    appointmentNotice: string,
    paySuccessNotice: string,
    appointmentCancelNotice: string,
    refundNotice: string,
    bindCardNotice: string,
    orderCancelReminder?: string,
    visitCancelReminder?: string,
    visitProgressReminder?: string
  },
  indexPage: {
    banner: {
      enable: boolean,
      url: string,
    },
    healthCard: {
      enable: boolean
    },
    navCard: {
      enable: boolean
    },
    functionBox: {
      enable: boolean,
      list: any[]
    },
    quickEntrance: {
      enable: boolean,
      tabList: TabListItem[]
    },
    hospBlog: {
      enable: boolean
    }
  },
  feat: {
    wxLogger: boolean,
    hc_title: string,
    invoice: boolean,
    guangHuaMonitor: {
      enable: boolean,
      pid: string,
      miniVersion: string
    }
    greenTree: boolean, // 蚂蚁森林接入
    bindCard: {
      rebind: boolean,
      smsVerify: {
        enable: boolean,
        apikey: string,
        secret: string,
        sign_id: number,
        template_id: number
      },
      elecHealthCard: boolean,
      parentInfo: boolean,
      nationality: boolean,
      hasCard: boolean,
      maritalStatus: boolean,
      oneClickAuth: boolean,
      updateNotice: boolean
    }
    YiBaoCard: boolean,
    register: {
      changeFeeType: boolean,
      cancelReservedTime: number,
      popupNotice: boolean,
      intradayAndAppointment: boolean,
      type: 'byDept' | 'byCategoryAndDoctorAndTime' | 'byDeptAndTime',
      departmentLevel: string,
      checkEpiLogicalSurvey: boolean
    }
    hospitalNavigation: boolean,
    ZhuYuanCardName: boolean,
    inHospCard: boolean,
    arrivalService: {
      arrival: boolean,
      waitingList: boolean
    }
  },
  reportsPage: {
    hideInHosp: boolean,
    showImageDetail: boolean, // 图片展示检验报告详情
    clinicReportTabs: {title: string, value: string}[],
    hospReportTabs: {title: string, value: string}[]
  },
  paymentOrderPage: {
    tackingMedicineGuide: boolean //取药指引
  },
  yibao2: {
    enable: boolean,
    path?: string,
    appId?: string,
    envVersion?: 'trial' | 'release' | 'develop',
    orgChnlCrtfCodg?: string,//  机构渠道认证编码
    orgCodg?: string, //定点医药机构编码 
    bizType?: string, //线上核验业务类型编码 
    orgAppId?: string, // 定点医药机构应用ID 
    cityCode?: string, //城市编码
    channel?: string //渠道号（微信医保平台分配）
  }
}