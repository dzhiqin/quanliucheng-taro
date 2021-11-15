import imgUrl from '@/utils/imgs'

export default {
  hospName: "epfy",
  hospitalName: "恩平市妇幼保健院",
  apiUrl: "https://epsfy.joyfulboo.com/api/",
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
          event: 'toRegIndex',
          desc: '专家名医提前约'
        },
        {
          icon: imgUrl.new_home_icon4,
          title: '就诊缴费',
          event: 'toPayCost',
          desc: '线上缴费免排队'
        },
        {
          icon: imgUrl.new_home_icon5,
          title: '查看报告',
          event: 'toCheckList',
          desc: '检查检验随时查'
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
            {
              name: "住院登记",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
            },
            {
              name: "自助核酸缴费",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
            },
            {
              name: "住院登记",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
            },
            {
              name: "自助核酸缴费",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
            },
            {
              name: "住院登记",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
            }
          ]
        },
        {
          title: "住院",
          entrances:[
            {
              name: "住院登记",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
            },
            {
              name: "自助核酸缴费",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
            }
          ]
        },
      ]
    },
    hospBlog: {
      enable: false
    }
  },
  feat:{
    
  }
}