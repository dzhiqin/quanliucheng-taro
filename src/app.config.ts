const config = {
  pages: [
    'pages/index/index',
    'pages/login/login',
    'pages/official/official',
    'pages/personal/personal'
  ],
  subpackages: undefined,
  subPackages: undefined,
  plugins: undefined,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "tabBar": {
    "color": "#d8d8d8",
    "selectedColor": "#005eb8",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "./images/icons/home_unactive.png",
        "selectedIconPath": "./images/icons/home.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/official/official",
        "iconPath": "./images/icons/website_unactive.png",
        "selectedIconPath": "./images/icons/website.png",
        "text": "微官网"
      },
      {
        "pagePath": "pages/personal/personal",
        "iconPath": "./images/icons/mine_unactive.png",
        "selectedIconPath": "./images/icons/mine.png",
        "text": "个人中心"
      }
    ]
  },
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序定位"
    },
    "scope.getLocation": {
      "desc": "你的位置信息将用于小程序定位"
    }
  },
  "requiredPrivateInfos": [
    "chooseLocation",
    "getLocation"
  ],
}

const subPackages = [
  {
    root: 'pages/card-pack',
    name: 'bind',
    pages: process.env.TARO_ENV === 'weapp' ? 
    [
      'create-card/create-card',
      'cards-list/cards-list',
      'card-detail/card-detail',
      'elec-healthcard-auth/elec-healthcard-auth',
      'elec-healthcard-users/elec-healthcard-users',
      'bind-card/bind-card',
      'edit-card/edit-card'
    ] 
    :
    [
      'create-card/create-card',
      'cards-list-alipay/cards-list-alipay',
      'card-detail/card-detail',
      'bind-card/bind-card'
    ]
  },
  {
    root: 'pages/register-pack',
    name: 'register',
    pages: [
      'branch-hospitals/branch-hospitals',
      'clinics/clinics',
      'notice/notice',
      'doctor-list/doctor-list',
      'doctor-detail/doctor-detail',
      'search-result/search-result',
      'clinic-doctors/clinic-doctors',
      'order-create/order-create',
      'order-list/order-list',
      'doctors/doctors',
      'intelligent-guidance/intelligent-guidance'
    ]
  },
  {
    root: 'pages/official-pack',
    name: 'official',
    pages: [
      'clinic-list/clinic-list',
      'guide-list/guide-list',
      'guide-detail/guide-detail',
      'clinic-intro/clinic-intro',
      'doctor-detail/doctor-detail'
    ]
  },
  {
    root: 'pages/reports-pack',
    name: 'reports',
    pages: [
      'reports-list/reports-list',
      'reports-type/reports-type',
      'reports-detail/reports-detail',
    ]
  },
  {
    root: 'pages/payment-pack',
    name: 'payments',
    pages: process.env.TARO_ENV === 'weapp' ? 
    [
      'payment-list/payment-list',
      'payment-detail/payment-detail',
      'order-list/order-list',
      'yibao-payment-detail/index'
    ] :
    [
      'payment-list/payment-list',
      'payment-detail/payment-detail',
      'order-list/order-list',
      'yibao-payment-detail-alipay/index'
    ]
  },
  {
    root: 'pages/hosp-pack',
    name: 'hospitalization',
    pages: [
      'checklist/checklist',
      'binding-card/binding-card',
      'deposit/deposit',
      'checklist-detail/checklist-detail',
      'card-list/card-list',
      'inpatient-registration/inpatient-registration',
      'inpatient-notices/inpatient-notices',
      'discharge-settlement/discharge-settlement'
    ]
  },
  {
    root: 'pages/service-pack',
    name: 'service',
    pages: [
      'arrival/arrival',
      'waiting-list/waiting-list',
      'arrival-service/arrival-service',
      'survey/survey',
      'epidemiological-survey/epidemiological-survey',
      'epidemiological-survey/result',
      'deposit/deposit',
      'recovery/recovery'
    ]
  }
]
if(process.env.TARO_ENV === 'weapp'){
  const plugins = {
    "healthCardPlugins": {
      "version": "3.1.8",
      "provider": "wxee969de81bba9a45"
    },
    "ocr-plugin": {
      "version": "3.1.3",
      "provider": "wx4418e3e031e551be"
    }
  }
  config.plugins = plugins
  config.subpackages = subPackages
}
if(process.env.TARO_ENV === 'alipay'){
  config.subPackages = subPackages
  const plugins = {
    "heHealth": {
      "version": "*",
      "provider": "2021003179663281"
    }
  }
  config.plugins = plugins
}
export default config
