// import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  hospName: "lwgk",
  latitude: 23.120284,
  longitude: 113.244332,
  hospitalName: "广州市荔湾区骨伤科医院",
  baseUrl: "https://lwgk.joyfulboo.com",
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220308-basic/lwgk.png",
  reportsPage:{
    hideInHosp: false, // 隐藏住院报告入口
    showImageDetail: false, // 图片展示检验报告详情
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

const mergedConfig = mergeRecursive(DefaultConfig,config)
export default mergedConfig