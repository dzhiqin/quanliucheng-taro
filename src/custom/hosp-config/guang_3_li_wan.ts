import imgUrl from '@/utils/imgs'
// import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  latitude: 23.117374,
  longitude: 113.234202,
  region: ['广东省','广州市','荔湾区'],
  hospName: "gy3ylw",
  banner: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png',
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220309-basic/gysy.png",
  hospitalName: "广医三院荔湾院区",
  // baseUrl: "https://applets.gdbkyz.com", // 倍康测试
  baseUrl: "https://gysy.wedoublecare.com",  // 旧正式环境
  // baseUrl: "https://weixin2.gy3y.com", // 新正式环境(未启用)
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 测试环境
  indexPage: {
    banner: { // 轮播图组件
      enable: true,
      url: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/gy3ylw-banner.png'
    },
    quickEntrance: {
      enable: true,
      tabList: [
        {
          title: '门诊',
          entrances: [
            {
              icon: imgUrl.new_home_icon6,
              name: '报到候诊',
              event: 'navigate',
              url: '/pages/service-pack/arrival-service/arrival-service'
            }
          ]
        },
        {
          title: '住院',
          entrances: [
            {
              icon: imgUrl.zybk,
              name: '住院绑卡',
              event: 'navigate',
              url: '/pages/hosp-pack/binding-card/binding-card',
            }, 
            {
              icon: imgUrl.new_home_icon10,
              name: '住院押金',
              event: 'navigate',
              url: '/pages/hosp-pack/deposit/deposit',
            }, 
            {
              icon: imgUrl.new_home_icon11,
              name: '每日清单',
              event: 'navigate',
              url: '/pages/hosp-pack/checklist/checklist',
            }
          ]
        }
      ]
    }
  },
  feat: {
    bindCard: {
      rebind: true,
      updateNotice: true,
    },
    register: {
      popupNotice: false,
      intradayAndAppointment: true,// 是否区分当天挂号和预约挂号
      type: 'byCategoryAndDoctorAndTime',// byDept按科室挂号；byDeptAndTime按科室和时间挂号；byCategoryAndDoctorAndTime按分类、医生、日期挂号
      checkEpiLogicalSurvey: false, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: true,  // 院内导航
  },
  subscribes: {
    checkReminder: 'M8e0Dbtb87M8DUXYPwTQdOxnz8sddpCkc_r7_VMd2Jc', // 审方提醒 长期订阅
    pendingPayReminder: 'z5DIZhdEj9DCvfKRheU06kKod6r55bx1LC8p2VsB_O4',// 待缴费提醒 长期订阅
    visitReminder: 'A8GTcQvlKDqEDSi1u19RFwKqRjrPJwW4feHMuvpZNso', // 就诊提醒 长期订阅
    closeNotice: 'AcXeVD04Z9NegbFhak1We0UI4jG_Zb8Uj3Bfvzf_8jM',// 医生停诊通知
    satisfactionSurveyNotice: 'sET4fH6WMDnX2V88JkFay_sPBaCcFtv1ax5NXicdWwA',// 患者满意度调查提醒
    appointmentNotice: 'KB2AIUyjvp209JGNy-7EtKDSK4N2fgwfpbaMazZsclA', //挂号成功通知
    paySuccessNotice: 'F5gOTB-fPJ0y5QG94_QQ0MUxaxJ0cIl1eA_NBNlQ4wk', //缴费成功通知
    appointmentCancelNotice: 'MlDidLtES5vVTC4YcGIhYluIMIXSi7hX3JXngkgUV7s',//挂号取消通知
    refundNotice: 'Hhj5lSuAslXx5VGEbhfp2KAiSw__Qv3_B3_1i16qt5o',//退费通知
    bindCardNotice: 'KDkqTgWPR8SUOnWTu-QS8LPBcTPrB121kHuHOFPcRjY',//绑卡成功提醒
  },
  paymentOrderPage: {
    tackingMedicineGuide: true
  }
}
const mergedConfig = mergeRecursive(DefaultConfig, config)
export default mergedConfig