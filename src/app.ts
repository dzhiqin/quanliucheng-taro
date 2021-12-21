/* eslint-disable react/sort-comp */
import { Component } from 'react'
import { login } from '@/service/api/user-api'
import * as Taro from '@tarojs/taro'
import "taro-ui/dist/style/index.scss"
import './app.less'
import { fetchBranchHospital } from './service/api'
import { toastService } from './service/toast-service'

class App extends Component {
  props: any
  componentDidMount () {}

  onLaunch () {
    // const token = Taro.getStorageSync('token')
    // if(token) return
    Taro.login({
      success: res => {
        let { code } = res
        login({code}).then((result:any) => {
          // console.log('login res',result)
          if(result.statusCode === 200) {
            const {data: {data}} = result
            Taro.setStorageSync('token', data.token)
            fetchBranchHospital().then(resData => {
              if(resData.data.length === 1){
                Taro.setStorageSync('hospitalInfo',resData.data[0])
              }
            })
          }
        }).catch(() => {
          Taro.showToast({
            title: '获取token失败',
            icon: 'none'
          })
        })
      }
    })
  }

  componentDidHide () {}

  componentDidCatchError () {}

  render () {
    return this.props.children
  }
}

export default App
