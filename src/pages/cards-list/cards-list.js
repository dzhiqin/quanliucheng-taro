import { View, Image } from '@tarojs/components'
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import BkButton from '@/components/bk-button/bk-button'
import noCardPng from '@/images/no_card.png'
import custom from '@/custom/'
import Card from './card'
import './cards-list.less'

export default class CardList2 extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      cards: [],
      params: Taro.getCurrentInstance().router.params
    }
  }
  componentDidMount() {
    let res = Taro.getStorageSync('cards')
    if(res){
      this.setState({cards:res})
    }
  }
  componentDidShow() {
    let res = Taro.getStorageSync('cards')
    this.setState({cards:res})
  }
  
  onLoginResult(e){
    console.log(e.detail.result);
  }
  navToBindCard() {
    Taro.navigateTo({url: '/pages/bind-card/bind-card'})
  }
  navToYiBao() {
    Taro.navigateBackMiniProgram({
      appId: 'wxe1022cca111d18be',
      path: 'pages/cert/bind/bind?from=AAHTx-oeOuLWz2nBYKez06kN&cityid=440100',
      success() {
        console.log('打开医保小程序成功');
      }
    })
  }
  render(){
    return(
      <View className='cards-list'>
        {
          this.state.cards && this.state.cards.length > 0 ?
          this.state.cards.map(item => <Card card={item} key={item.id} style='margin-bottom: 40rpx' action={this.state.params.action} />) : 
          <View className='empty'>
            <Image src={noCardPng} className='empty-icon'></Image>
            <View className='empty-txt'>暂无健康卡</View>
          </View>
        }
        
        <View className='btns-wrap'>
          {
            custom.feat.bindCard.oneClickAuth &&
            <View className='btn'>
              <View className='btn-title'>一键授权</View>
              <View className='btn-subtitle'>已有健康卡用户直接绑定</View>
            </View>
          }
          {
            custom.feat.bindCard.electronicHealthCard 
              ?
            <health-card-btn onlogin={this.onLoginResult.bind(this)}>
              <BkButton title='添加健康卡' theme='info' onClick={() => console.log('click')} style='width: 480rpx; margin-bottom: 20rpx' />
            </health-card-btn> 
              : 
            <BkButton title='添加健康卡' theme='info' onClick={this.navToBindCard} style='width: 480rpx; margin-bottom: 20rpx' />
          }
          {
            custom.feat.bindCard.bindYiBaoCard && 
            <BkButton title='绑定医保卡' onClick={this.navToYiBao} style='width: 480rpx;margin-bottom: 20rpx' />
          }

        </View>
      </View>
    )
  }
}