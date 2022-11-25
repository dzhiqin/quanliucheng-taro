import imgUrl from '@/utils/imgs'
// import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  latitude: 23.132274,
  longitude: 113.248191,
  hospName: "lwzxyy",
  banner: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png',
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/li-wan-zhong-xin.jpeg",
  hospitalName: "广州市荔湾中心医院",
  // baseUrl: "http://119.29.152.149:30102", // 测试
  baseUrl: "https://lwzxyy-applets.wedoublecare.com",  // 正式环境
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 测试环境
  indexPage: {
    quickEntrance: {
      enable: false,
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
        },
        {
          title: "其他",
          entrances:[
            {
              name: "电子票夹",
              icon: imgUrl.new_home_icon10,
              event: "jump",
              appId: 'wx8e0b79a7f627ca18',
              path: `pages/invoiceDisplayDWDZ/invoiceDisplayDWDZ?q=${encodeURIComponent("https://www.chinaebill.cn/d?t=501&a=89AMy0Cj6&d=44060122_8040675619_3f7484_20221118&s=B62B74A4D1")}`
            },
          ]
        }
      ]
    }
  },
  longtermSubscribe: {
    checkReminder: '51HqQTe4hEx0mY3D3DxkHx9YkiO0xUnNzDEIogqQsEE', // 审方提醒
    pendingPayReminder: 'q91PmGG25Wntxih_QZmSV1BRO9b3AOgHZNf9OSgWhzQ',// 待缴费提醒
    visitReminder: 'QWpDDp5cCt801lr5M1pQT4Zt51iO4c_bHBM6RH5O23E' // 就诊提醒
  },
  onetimeSubscribe: {
    closeNotice: 'k6_TACbOnbjr9G88wsE_hwdmK5W0HawsgC2W-P1Wms0',// 医生停诊通知
    satisfactionSurveyNotice: 'dk9p6tiJtC3bllS_84rCd2G6oNHIdb4VbGs1dfgvcKc',// 患者满意度调查提醒
    appointmentNotice: '8Ol1ijKw1cFEuJ7jGyXdTcNhegJ8WETLltAljy9eQpc', //挂号成功通知
    paySuccessNotice: 'o_VgtRdugca6L9M_ldjpbp6C4bvJuMBBGWZ1FkEUQSg', //缴费成功通知
    appointmentCancelNotice: 'PoxDaXOIgTAOEabRwqxspBIvXVDYPt3YW9CC9iFWLF8',//挂号取消通知
    refundNotice: 'D9RWkCaZ9DPyU0B1w4mojh0mtGzvLiutZ6uAiG992FM',//退费通知
    bindCardNotice: 'y6NcaNKQ9nPBlt0sI8xEMEk-AHUXS3hKEyJ96aR4oqg',//绑卡成功提醒
  }
}
const mergedConfig = mergeRecursive(DefaultConfig, config)
export default mergedConfig