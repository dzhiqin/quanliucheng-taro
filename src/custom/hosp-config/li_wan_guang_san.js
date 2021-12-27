import imgUrl from '@/utils/imgs'

export default {
  hospName: "gysylw",
  hospitalName: "广州医科大学附属第三医院",
  baseUrl: "https://applets.gdbkyz.com/api/applet", // 倍康测试
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
          event: 'jump',
          desc: '线上缴费免排队',
          url: '/pages/payment-pack/payment-list/payment-list'
        },
        {
          icon: imgUrl.new_home_icon5,
          title: '查看报告',
          event: 'jump',
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
      electronicHealthCard: false, // 电子健康卡
      parentInfo: true,
      nationality: true,
      hospitalCard: false,
      maritalStatus: false,
      oneClickAuth: false,    // 一键授权，直接绑定健康卡
      bindYiBaoCard: false, // 绑定医保卡
    },
    register: {
      bookingAndIntraday:true,
      popupNotice: false,
      guangSanMode: true,
      type: 'embed'
    }
  },
  reportsPage:{
    urlDetail: true
  }
}