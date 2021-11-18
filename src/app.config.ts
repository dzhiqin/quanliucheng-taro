export default {
  pages: [
    'pages/index/index',
    'pages/login/login',
    'pages/bind-card/bind-card',
    'pages/elec-healthcard-auth/elec-healthcard-auth'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "plugins": {
    "healthCardPlugins": {
      "version": "3.1.7",
      "provider": "wxee969de81bba9a45"
    },
    "ocr-plugin": {
      "version": "3.0.6",
      "provider": "wx4418e3e031e551be"
    }
  }
}
