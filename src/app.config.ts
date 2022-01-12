export default {
  pages: [
    'pages/index/index',
    'pages/login/login',
    'pages/official/official',
    'pages/personal/personal',
    'pages/web-view-page/web-view-page'
  ],
  subpackages: [
    {
      root: 'pages/bind-pack',
      name: 'bind',
      pages: [
        'bind-card/bind-card',
        'cards-list/cards-list',
        'card-detail/card-detail',
        'elec-healthcard-auth/elec-healthcard-auth',
        'elec-healthcard-users/elec-healthcard-users'
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
        'classify-doctor-list/classify-doctor-list',
        'order-create/order-create',
        'order-list/order-list'
      ]
    },
    {
      root: 'pages/official-pack',
      name: 'official',
      pages: [
        'clinic-list/clinic-list',
        'guide-list/guide-list',
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
      pages: [
        'payment-list/payment-list',
        'payment-detail/payment-detail',
        'order-list/order-list'
      ]
    },
    {
      root: 'pages/hosp-pack',
      name: 'hospitalization',
      pages: [
        'checklist/checklist',
        'checkin/checkin',
        'binding-card/binding-card',
        'deposit/deposit',
      ]
    },
    {
      root: 'pages/service-pack',
      name: 'service',
      pages: [
        'arrival/arrival',
        'waiting-list/waiting-list',
        'arrival-service/arrival-service'
      ]
    }
  ],
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
        "iconPath": "./images/icons/home_gray.png",
        "selectedIconPath": "./images/icons/home.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/official/official",
        "iconPath": "./images/icons/website_gray.png",
        "selectedIconPath": "./images/icons/website.png",
        "text": "微官网"
      },
      {
        "pagePath": "pages/personal/personal",
        "iconPath": "./images/icons/man_gray.png",
        "selectedIconPath": "./images/icons/man.png",
        "text": "个人中心"
      }
    ]
  },
  "plugins": {
    "healthCardPlugins": {
      "version": "3.1.8",
      "provider": "wxee969de81bba9a45"
    },
    "ocr-plugin": {
      "version": "3.1.2",
      "provider": "wx4418e3e031e551be"
    }
  },
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序定位"
    }
  }
}
