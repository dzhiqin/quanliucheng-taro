type HospName = 
  'guang_san_li_wan' |
  'en_ping_fu_you' |
  'li_wan_gu_ke' |
  'shun_de_jun_an' | 
  'jin_sha_zhou'
const hospName:HospName = 'guang_san_li_wan'
const hospConfig = require(`./hosp-config/${hospName}`)

export const custom = hospConfig.default as HospConfig
type HospConfig = {
  latitude: 23.122721,
  longitude: 113.240994,
  hospName: string,
  hospitalName: string,
  logo: string,
  baseUrl: string,
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
      list: []
    },
    quickEntrance: {
      enable: boolean,
      tabList: [
        {
          title: string,
          entrances: []
        }
      ]
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
      maritialStatus: boolean,
      oneClickAuth: boolean,
      bindYiBaoCard: boolean,
      updateNotice: boolean
    }
    register: {
      cancelReservedTime: number,
      popupNotice: boolean,
      intradayAndAppointment: boolean,
      type: 'byDept' | 'byCategoryAndDoctorAndTime' | 'byDeptAndTime',
      departmentLevel: string,
      checkEpiLogicalSurvey: boolean
    }
    hospitalNavigation: boolean,
    ZhuYuanCardName: boolean
  },
  reportsPage: {
    hideInHosp: boolean,
    urlDetail: boolean,
    clinicReportTabs: [
      {title: string, value: string}
    ],
    hospReportTabs: [
      {title: string, value: string}
    ]
  }
}