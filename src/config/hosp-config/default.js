import imgUrl from '@/utils/imgs'

export default {
  hospName: "epfy",
  hospitalName: "恩平市妇幼保健院",
  baseUrl: "https://epsfy.joyfulboo.com/api",
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
          title: '门诊',
          entrances: [
            {
              icon: imgUrl.new_home_icon6,
              name: '报到候诊',
              event: 'toQueueCheckIn',
            }, 
            {
              icon: imgUrl.new_home_icon7,
              name: '检查预约',
              event: 'toOrderCheck',
            }, 
            {
              icon: imgUrl.new_home_icon8,
              name: '满意度调查',
              event: 'toServey',
            }
          ]
        },
        {
          title: '住院',
          entrances: [
            {
              icon: imgUrl.new_home_icon9,
              name: '住院登记',
              event: 'toInhospRegis',
            }, 
            {
              icon: imgUrl.zybk,
              name: '住院绑卡',
              event: 'toInpatientBindingCard',
            }, 
            {
              icon: imgUrl.new_home_icon10,
              name: '住院押金',
              event: 'toDepositPayment',
            }, 
            {
              icon: imgUrl.new_home_icon11,
              name: '每日清单',
              event: 'toDailyList',
            },
            {
              icon: imgUrl.cyjs,
              name: '出院结算',
              event: 'toDischargeSettlement',
            },
            {
              icon: imgUrl.bafy,
              name: '病案复印',
              event: 'toMiniProgram',
            }
          ]
        },
        {
          title: "其他",
          entrances:[
            {
              name: "自助核酸缴费",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
            },
            {
              icon: imgUrl.new_home_icon12,
              name: '便民服务',
              event: 'toConvenient',
            }
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
      electronicHealthCard: false,
      parentInfo: true,
      nationality: false,
      hospitalCard: true,
      maritalStatus: true
    }
  }
}