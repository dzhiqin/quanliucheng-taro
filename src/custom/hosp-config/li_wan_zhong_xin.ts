import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import imgUrl from '@/utils/imgs'
// import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  latitude: 23.12634,
  longitude: 113.241833,
  hospName: "lwzxyy",
  banner: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png',
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/li-wan-zhong-xin.jpeg",
  hospitalName: "广州市荔湾中心医院",
  baseUrl: "http://119.29.97.234:30102", // 测试
  // baseUrl: "https://lwzxyy-applets.wedoublecare.com",  // 正式环境
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 测试环境
  indexPage: {
    functionBox:{ // 功能模块组件
      enable: true,
      list: [
        {
          icon: imgUrl.new_home_icon3,
          title: '预约挂号',
          event: 'register',
          desc: '专家名医提前约',
          tag: 'green'
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
          url: '/pages/reports-pack/reports-type/reports-type',
          tag: 'green'
        }
      ]
    },
    quickEntrance: {
      enable: true,
      tabList: [
        // {
        //   title: '门诊',
        //   entrances: [
        //     {
        //       icon: imgUrl.new_home_icon6,
        //       name: '报到候诊',
        //       event: 'navigate',
        //       url: '/pages/service-pack/arrival-service/arrival-service'
        //     }
        //   ]
        // },
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
        },
        {
          title: "其他",
          entrances:[
            // {
            //   name: "电子票夹",
            //   icon: imgUrl.new_home_icon10,
            //   event: "jump",
            //   appId: 'wx8e0b79a7f627ca18',
            //   path: `pages/invoiceDisplayDWDZ/invoiceDisplayDWDZ?q=${encodeURIComponent("https://www.chinaebill.cn/d?t=501&a=89AMy0Cj6&d=44060122_8040675619_3f7484_20221118&s=B62B74A4D1")}`
            // },
            // {
            //   name: "云胶片",
            //   icon: imgUrl.new_home_icon10,
            //   event: "navigate",
            //   url: `/pages/service-pack/web-view-page/web-view-page?pageType=cloudFilm`
            // },
            {
              name: "免密授权",
              icon: imgUrl.new_home_icon10,
              event: "click",
            },
            {
              name: "退款测试",
              icon: imgUrl.new_home_icon10,
              event: "navigate",
              url: `/pages/payment-pack/payment-detail/payment-detail?orderId=18707&from=message`
            },
          ]
        }
      ]
    }
  },
  feat: {
    hc_title: '广州市卫生健康委员会',
    bindCard: {
      rebind: true,
      smsVerify: {
        enable: true,
        apiKey: 'N68313eb24',
        secret: '683135068234a327',
        sign_id: 168951,
        template_id: 133435
      }
    },
    register:{
      popupNotice:true
    },
  },
  reportsPage:{
    showImageDetail: false,
    clinicReportTabs: [  // 门诊报告分类
      {title: '化验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查}
    ],
    hospReportTabs: [  // 住院报告分类
      {title: '化验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查}
    ]
  },
  subscribes: {
    checkReminder: '51HqQTe4hEx0mY3D3DxkHx9YkiO0xUnNzDEIogqQsEE', // 审方提醒 长期订阅
    pendingPayReminder: 'q91PmGG25Wntxih_QZmSV1BRO9b3AOgHZNf9OSgWhzQ',// 待缴费提醒 长期订阅
    visitReminder: 'QWpDDp5cCt801lr5M1pQT4Zt51iO4c_bHBM6RH5O23E', // 就诊提醒 长期订阅
    closeNotice: 'k6_TACbOnbjr9G88wsE_hwdmK5W0HawsgC2W-P1Wms0',// 医生停诊通知
    satisfactionSurveyNotice: 'dk9p6tiJtC3bllS_84rCd2G6oNHIdb4VbGs1dfgvcKc',// 患者满意度调查提醒
    appointmentNotice: '8Ol1ijKw1cFEuJ7jGyXdTcNhegJ8WETLltAljy9eQpc', //挂号成功通知
    paySuccessNotice: 'o_VgtRdugca6L9M_ldjpbp6C4bvJuMBBGWZ1FkEUQSg', //缴费成功通知
    appointmentCancelNotice: 'PoxDaXOIgTAOEabRwqxspBIvXVDYPt3YW9CC9iFWLF8',//挂号取消通知
    refundNotice: 'D9RWkCaZ9DPyU0B1w4mojh0mtGzvLiutZ6uAiG992FM',//退费通知
    bindCardNotice: 'y6NcaNKQ9nPBlt0sI8xEMEk-AHUXS3hKEyJ96aR4oqg',//绑卡成功提醒
  },
  paymentOrderPage: {
    tackingMedicineGuide: true //取药指引
  },
  yibaoParams: {
    path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=440108&channel=AAGE84GHsRIzjSdxPaPQtNqU&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvShtXBpXvc4WkWexOKgovx&orgCodg=H44010300017&orgAppId=1GPA6UN3P0AU3F60C80A0000B246C727',
    appId: 'wxe183cd55df4b4369',
    envVersion: 'trial',
    orgChnlCrtfCodg: 'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvShtXBpXvc4WkWexOKgovx',//  机构渠道认证编码
    orgCodg: 'H44010300017', //定点医药机构编码 
    bizType: '04107', //线上核验业务类型编码 
    orgAppId: '1GPA6UN3P0AU3F60C80A0000B246C727', // 定点医药机构应用ID 
    cityCode: '440108', //城市编码
    channel: 'AAGE84GHsRIzjSdxPaPQtNqU' //渠道号（微信医保平台分配）
  }
}
const mergedConfig = mergeRecursive(DefaultConfig, config)
export default mergedConfig