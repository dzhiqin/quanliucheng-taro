import { View, Image } from '@tarojs/components'
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import BkButton from '@/components/bk-button/bk-button'
import {custom} from '@/custom/index'
import Card from './card'
import './cards-list.less'
import { loadingService, toastService } from '@/service/toast-service'
import { getImageSrc } from '@/utils/image-src'
import { CardsHealper } from '@/utils/cards-healper'
import { AtNoticebar } from 'taro-ui'
import { TaroNavigateService, TaroRemindAuthModal } from '@/service/api'

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
    if(res.length === 0){
      TaroRemindAuthModal()
    }
    this.setState({cards:res})
    if(this.state.params.action === 'jumpOut'){
      if(res){
        toastService({title: '点击卡片后将跳转柔济孕宝小程序'})
      }else{
        toastService({title: '请先添加健康卡'})
      }
    }
  }
  
  onLoginResult(e){
    const result = e.detail.result
    if(result.type === 3) {
      // 用户还未授权
      TaroNavigateService('card-pack','elec-healthcard-auth')
    }else{
      // 用户已经授权过
      TaroNavigateService('card-pack','elec-healthcard-users')
    }
  }
  navToCreateCard() {
    TaroNavigateService('card-pack','create-card')
  }
  
  handleRefresh() {
    loadingService(true)
    CardsHealper.updateAllCards().then(() => {
      loadingService(false)
      let res = Taro.getStorageSync('cards')
      this.setState({cards:res})
    })
  }
  render(){
    return(
      <View className='cards'>
        <View className='cards-header'>
          <AtNoticebar>点击卡片可查看更多信息</AtNoticebar>
        </View>
        <View className='cards-list'>
          {
            this.state.cards && this.state.cards.length > 0 
            ?
            this.state.cards.map(item => <Card card={item} key={item.id} style='margin-bottom: 40rpx' action={this.state.params.action} />) 
            : 
            <View className='empty'>
              <Image src={getImageSrc('no_card.png')} className='empty-icon'></Image>
              <View className='empty-txt'>暂无健康卡</View>
            </View>
          }
          
          <View className='btns-wrap'>
            {
              custom.hospName === 'jszyy' ?
              <View style='color: red;font-size: 26rpx;'>如就诊卡遗失或忘记卡号，请去人工收费窗口办理补卡</View> :
              <View style='color: red;font-size: 26rpx;'>备注：如果不记得卡号，请选择{custom.feat.bindCard.elecHealthCard ? '[添加健康卡]' : '[添加诊疗卡]'}</View> 
            }
            
            {
              custom.feat.bindCard.oneClickAuth &&
              <health-card-btn onlogin={this.onLoginResult.bind(this)}>
                <View className='btn'>
                  <View className='btn-title'>一键授权</View>
                  <View className='btn-subtitle'>已有健康卡用户直接绑定</View>
                </View>
              </health-card-btn>
            }
            {
              !custom.feat.bindCard.elecHealthCard && 
              <View className='btn' onClick={()=> TaroNavigateService('card-pack','bind-card')}>
                <View className='btn-title'>绑卡</View>
                <View className='btn-subtitle'>已有就诊卡用户直接绑定</View>
              </View>
            }
            {/* 特殊处理 金沙洲只用诊疗卡 */}
            <BkButton title={custom.hospName === 'jszyy' ? '添加诊疗卡' : '添加健康卡'} theme='info' onClick={this.navToCreateCard} style='width: 480rpx; margin-bottom: 20rpx' />
            <BkButton title={custom.hospName === 'jszyy' ? '刷新诊疗卡' : '刷新健康卡'} theme='primary' onClick={this.handleRefresh.bind(this)} style='width: 480rpx; margin-bottom: 20rpx' />
          </View>
        </View>
      </View>
      
    )
  }
}