import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import crossPng from '@/images/icons/cross.png'
import { CardsHealper } from '@/utils/cards-healper'
import '../cards-list/cards-list.less'
import { encryptByDES, getBranchId } from '@/utils/tools'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import { TaroNavToMiniProgram, bindHealthCard } from '@/service/api'
import nrhcPng from '@/images/icons/nrhc.png'
import { HEALTH_CARD_RES_CODE, HEALTH_CARD_TYPE_EN } from '@/enums/index'
import { useState } from 'react'
import { custom } from '@/custom/index'
import { getImageSrc } from '@/utils/image-src'

export default function Card(props: {
  action?: string,
  card:any,
  style?: string
}) {
  const [upgrading,setUpgrading] = useState(false)
  const onClickIcon = (e) => {
    // console.log('click icon',e);
    e.stopPropagation()
  }
  const onClickCard = async (e) => {
    if(props.action === 'switchCard'){
      await CardsHealper.setDefault(props.card.id)
      Taro.navigateBack()
    }else if(props.action === 'jumpOut'){
      // jumpout
    }else{
      Taro.setStorageSync('card',props.card)
      Taro.navigateTo({url: `/pages/card-pack/card-detail/card-detail`})
    }
  }
  const handleBindHealthCard = (cardParams) => {
    bindHealthCard(cardParams).then(res => {
      // console.log('res:',res)
      loadingService(false)
      if(res.resultCode === 0){
        toastService({title: '升级成功', onClose: () => {
          CardsHealper.updateAllCards().then(() => {
            Taro.redirectTo({url: '/pages/card-pack/cards-list-alipay/cards-list-alipay'})
          })
        }})
      }else{
        loadingService(false)
        modalService({title: '升级失败', content: res.message})
        setUpgrading(false)
      }
    }).catch(err => {
      loadingService(false)
      modalService({content: JSON.stringify(err)})
      setUpgrading(false)
    })
  }
  const buildCardParams = (addProps?:any) => {
    const params = {
      ...props.card,
      ...addProps,
      openId: '',
      cardId: props.card.id,
      patientName: props.card.name,
      idenType: HEALTH_CARD_TYPE_EN.IdCard, // 目前只支持身份证
      phone: props.card.cellphone,
      birthday: props.card.birthdate,
      nation: '',
      qrCodeText: '',
      healthCardId: '',
      isGetCode: true,
      cardType: 0
    }
    // console.log('build card params',params);
    return params
  }
  const handleUpgrade = (event) => {
    if(upgrading)return
    setUpgrading(true)
    loadingService(true,'升级中……')
    // console.log('upgrade',event.detail.result);
    const {result} = event.detail
    if(result.type === HEALTH_CARD_RES_CODE.no_auth_before){
      setUpgrading(false)
      loadingService(false)
      Taro.navigateTo({url: `/pages/card-pack/elec-healthcard-auth/elec-healthcard-auth?nextPage=cardList&cardId=${props.card.id}`})
    }else{
      handleBindHealthCard(buildCardParams({wechatCode: result.wechatCode}))
    }
  }
  
  Taro.useDidShow(() => {
    const upgradeCardId = Taro.getStorageSync('upgradeCardId')
    if(upgradeCardId && Number(upgradeCardId) === props.card.id){
      Taro.removeStorageSync('upgradeCardId')
      const wechatCode = Taro.getStorageSync('wechatCode')
      loadingService(true,'升级中……')
      handleBindHealthCard(buildCardParams({wechatCode}))
    }
  })
  

  return (
    <View className='card' style={props.style? props.style : ''} onClick={onClickCard} >
      <View className='card-header'>
        {/* 特殊处理 */}
        <View className='card-header-organ'>{custom.hospName === 'jszyy' ? '广州市卫生健康委员会' : '广东省卫生健康委员会'}</View>
        <View className='card-header-wrap'>
          <Image className='card-header-icon' src={crossPng}></Image>
          <View className='card-header-title'>电子健康卡</View>
        </View>
        
      </View>
      <View className='card-content'>
        <View className='card-content-info'>
          <View className='card-content-name'>{props.card.name}</View>
          <View className='card-content-id'>{props.card.idNOHide}</View>
        </View>
        <View className='card-content-image'>
          {
            props.card.qrCodeText && 
            <View className='card-content-image-wrap'>
              <Image src={`data:image/jpg;base64,${props.card.qrCode}`} className='card-content-image-qrcode' />
              <Image src={nrhcPng} className='card-content-image-icon' />
            </View>
          }
          
        </View>
      </View>
      <View className='card-footer'>中华人民共和国国家卫生健康委员会监制</View>
    </View>
  )
}