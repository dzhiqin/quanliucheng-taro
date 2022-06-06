import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'

export default {
  latitude: 23.096397,
  longitude: 113.367814,
  hospName: "jszyy",
  isPrivate: true,
  logo: "http://www.jsz120.com/uploads/allimg/200512/2-200512092512328.jpg",
  hospitalName: "广州中医药大学金沙洲医院",
  // baseUrl: "https://applets.gdbkyz.com", // 倍康测试
  baseUrl: "https://jszyy-applets.wedoublecare.com",  // 正式环境
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 测试环境
  
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
          title: '门诊',
          entrances: [
            {
              icon: imgUrl.new_home_icon6,
              name: '报到候诊',
              event: 'navigate',
              url: '/pages/service-pack/arrival-service/arrival-service'
            }, 
            // {
            //   icon: imgUrl.new_home_icon7,
            //   name: '检查预约',
            //   event: 'navigate',
            // }, 
            // {
            //   icon: imgUrl.new_home_icon8,
            //   name: '满意度调查',
            //   event: 'navigate',
            // }
          ]
        },
        {
          title: '住院',
          entrances: [
            // {
            //   icon: imgUrl.new_home_icon9,
            //   name: '住院登记',
            //   event: 'navigate',
            // }, 
            // {
            //   icon: imgUrl.zybk,
            //   name: '住院绑卡',
            //   event: 'navigate',
            // }, 
            // {
            //   icon: imgUrl.new_home_icon10,
            //   name: '住院押金',
            //   event: 'navigate',
            // }, 
            {
              icon: imgUrl.new_home_icon11,
              name: '每日清单',
              event: 'navigate',
              url: '/pages/hosp-pack/checklist/checklist',
            },
            // {
            //   icon: imgUrl.cyjs,
            //   name: '出院结算',
            //   event: 'navigate',
            // },
            // {
            //   icon: imgUrl.bafy,
            //   name: '病案复印',
            //   event: 'toMiniProgram',
            // }
          ]
        },
        // {
        //   title: "其他",
        //   entrances:[
        //     {
        //       name: "自助核酸缴费",
        //       icon: imgUrl.new_home_icon10,
        //       event: "jump"
        //     },
        //   ]
        // }
      ]
    },
    hospBlog: {
      enable: false
    }
  },
  feat:{
    bindCard: {
      electronicHealthCard: true, // 电子健康卡
      parentInfo: false,     // 监护人信息(儿童无证件)
      nationality: true,    // 国籍
      hasCard: true,  // 是否有院内就诊卡
      maritalStatus: true, // 婚姻状况
      oneClickAuth: true,    // 一键授权，直接绑定健康卡
      bindYiBaoCard: true, // 绑定医保卡
      updateNotice: false, // 绑卡和解绑发送消息通知
    },
    register: {
      bookingAndIntraday:true,// 是否区分当天挂号和预约挂号
      popupNotice: false,// 挂号提示弹窗
      guangSanMode: true,// 广三挂号模式：区分当天挂号和预约挂号
      type: 'embed',// 科室内容排版方式,
      checkEpiLogicalSurvey: false, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: true,  // 院内导航
    ZhuYuanCardName: false, // 住院绑卡是否需要姓名
  },
  reportsPage:{
    urlDetail: false, // 报告详情页用图片展示
    reportItemTabs: [
      {title: '检验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查},
    ],
    hospitalizationTabs: [
      {title: '检验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查},
    ],
  }
}