import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'

export default {
  hospName: "lwgk",
  hospitalName: "广州市荔湾区骨伤科医院",
  baseUrl: "https://lwgk.joyfulboo.com",
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220308-basic/lwgk.png",
  indexPage: {
    banner: {
      enable: true,
      url: imgUrl.banner
    },
    healthCard: {
      enable: true
    },
    navCard:{
      enable: false
    },
    functionBox:{
      enable: true,
      list: [
        {
          icon: imgUrl.new_home_icon3,
          title: '预约挂号',
          event: 'register',
          desc: '专家名医提前约'
        },
        {
          icon: imgUrl.new_home_icon4,
          title: '就诊缴费',
          event: 'navigate',
          desc: '线上缴费免排队',
          url: '/pages/payment-pack/payment-list/payment-list'
        },
        {
          icon: imgUrl.new_home_icon5,
          title: '查看报告',
          event: 'navigate',
          desc: '检查检验随时查',
          url: '/pages/reports-pack/reports-type/reports-type'
        }
      ]
    },
    
    quickEntrance: {
      enable: true,
      tabList: [
        {
          title: "其他",
          entrances:[
            {
              name: "自助核酸缴费",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
            },
          ]
        }
      ]
    },
    hospBlog: {
      enable: false
    }
  },
  feat:{
    bindCard: {
      elecHealthCard: false, // 电子健康卡
      parentInfo: true, // 监护人信息（无证件）
      nationality: false,// 是否需要国籍
      hasCard: false,// 是否有院内就诊卡
      maritalStatus: false,// 是否需要婚姻状况
      oneClickAuth: false,    // 一键授权，直接绑定健康卡
    },
    YiBaoCard: false, // 医保卡
    register: {
      cancelReservedTime: 3600 * 1000 * 2, // 取消挂号预留时间，默认2小时
      popupNotice: true,// 挂号提示弹窗
      intradayAndAppointment: false,// 是否区分当天挂号和预约挂号
      type: 'byDeptAndTime',// byDept按科室挂号；byDeptAndTime按科室和时间挂号；byCategoryAndDoctorAndTime按分类、医生、日期挂号
      departmentLevel: '2', // 2级科室
      checkEpiLogicalSurvey: true, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: false  // 院内导航
  },
  reportsPage:{
    hideInHosp: false, // 隐藏住院报告入口
    urlDetail: false, // 报告详情页用图片展示
    clinicReportTabs: [
      {title: '检验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查},
    ],
    hospReportTabs: [
      {title: '检验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查},
    ],
  },
  longtermSubscribe: {
    checkReminder: '1Y7Iu0-grEtMsexRhqB1Q4cHgTspOggU5Y6bhufypaI', // 审方提醒
    pendingPayReminder: 'nJMfTeNcCIRAOC3agtrH2sEw_rb9MQXVC2eK0dEJgvM',// 待缴费提醒
    visitReminder: '4RckgEP-B5zFYHkMDdrSvmB1unuU7LDhH9ZGf4MJ0eI' // 就诊提醒
  },
  onetimeSubscribe: {
    closeNotice: '4xLVsdmYySDpnHIuGAiO0AoWVFByxaBBJekiOPyYvT0',// 医生停诊通知
    satisfactionSurveyNotice: 'He9i_5e3SPLcVJnu7Ze3fzJ8-SmXiM43Do7qPHWRJkk',// 患者满意度调查提醒
    appointmentNotice: 'jh9Xi4Jt1kQ3ypscIy_9u-mImT9wwKp7zkMSO_zBCk8', //挂号成功通知
    paySuccessNotice: 'JQvwUruyBZSNoWmyPb-DurwKwRax2PB_Rzhg4TyM6x8', //缴费成功通知
    appointmentCancelNotice: 'Ui8MCcOjbu6vLSk1KD5U_eaBeQeYMKX-ghGb9LKYB9Q',//挂号取消通知
    refundNotice: 'LbSvzH4CbYtgOIOESN4fAS8jCn3hZH_D2wTYE1mA-j4',//退费通知
    bindCardNotice: 'RSVR4k_LMfDqiQ7Dd4xkc3hdqam-tGj0-u2U7IxOr-M',//绑卡成功提醒
  }
}