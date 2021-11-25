export default {
  pages: [
    'pages/index/index',
    'pages/login/login',
    'pages/bind-card/bind-card',
    'pages/elec-healthcard-auth/elec-healthcard-auth',
    'pages/official/official',
    'pages/personal/personal'
  ],
  subpackages: [
    {
      root: 'pages/register',
      name: 'register',
      pages: [
        'branch-hospitals/branch-hospitals',
        'clinics/clinics'
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
      "version": "3.1.7",
      "provider": "wxee969de81bba9a45"
    },
    "ocr-plugin": {
      "version": "3.1.0",
      "provider": "wx4418e3e031e551be"
    }
  }
}
