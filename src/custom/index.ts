type HospName = 
  'guang_san_li_wan' |
  'en_ping_fu_you' |
  'li_wan_gu_ke' |
  'shun_de_jun_an' | 
  'jin_sha_zhou'|
  'guang_san_huang_pu'
const hospName:HospName = 'guang_san_huang_pu'
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
  hospName: string,
  hospitalName: string,
  logo: string,
  baseUrl: string,
  subUrl: string,
  isPrivate: boolean,//是否是私人医院，私人医院无法使用公立医院的订阅模板
  longtermSubscribe: {
    checkReminder: string,
    pendingPayReminder: string,
    visitReminder: string
  },
  onetimeSubscribe:{
    closeNotice: string,
    satisfactionSurveyNotice: string,
    appointmentNotice: string,
    paySuccessNotice: string,
    appointmentCancelNotice: string,
    refundNotice: string,
    bindCardNotice: string
  }
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
    bindCard: {
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
      cancelReservedTime: number,
      popupNotice: boolean,
      intradayAndAppointment: boolean,
      type: 'byDept' | 'byCategoryAndDoctorAndTime' | 'byDeptAndTime',
      departmentLevel: string,
      checkEpiLogicalSurvey: boolean
    }
    hospitalNavigation: boolean,
    ZhuYuanCardName: boolean,
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
    tackingMedicineGuide: false //取药指引
  }
}