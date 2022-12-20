import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import {custom} from '@/custom/index'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import { useState } from 'react'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import { bindCardByCardNameAndNo, bindCardByCardNo } from '@/service/api'

export default function BindingCard() {
  const featConfig = custom.feat
  const [busy,setBusy] = useState(false)
  let card = {
    cardName: '',
    cardNo: ''
  }
  const handleSubmit = () => {
    const result = validator()
    setBusy(true)
    if(!result.valide){
      toastService({title: result.msg})
      return
    }
    loadingService(true)
    if(featConfig.ZhuYuanCardName){
      bindCardByCardNameAndNo({inCardName: card.cardName, inCardNo: card.cardNo})
      .then(res => {
        if(res.resultCode === 0){
          toastService({title: '绑卡成功', onClose: () => {Taro.navigateBack();loadingService(false)}})
        }else{
          loadingService(false)
          modalService({title: '绑卡失败',content: res.message})
          setBusy(false)
        }
      })
      .catch(err => {
        setBusy(false)
        loadingService(false)
        modalService({content: JSON.stringify(err)})
      })
    }else{
      bindCardByCardNo({inCardNo: card.cardNo})
      .then(res => {
        if(res.resultCode === 0 ){
          toastService({title: '绑卡成功', onClose: () => {Taro.navigateBack();loadingService(false)}})
          Taro.setStorageSync('patientCard',{id: '', cardNo: res.data.inpatientNo, name: res.data.name, isDefault: true})
        }else{
          loadingService(false)
          modalService({title: '绑卡失败',content: res.message})
          setBusy(false)
        }
      })
      .catch(err => {
        setBusy(false)
        loadingService(false)
        modalService({content: JSON.stringify(err)})
      })
    }
  }
  const validator = () => {
    if(featConfig.ZhuYuanCardName && !card.cardName){
      return {valide: false,msg: '请输入姓名'}
    }
    if(!card.cardNo){
      return {valide: false, msg: '请输入住院号'}
    }
    return {valide: true, msg: 'ok'}
  }
  const handleChange = (key,value) => {
    card[key] = value
  }
  return(
    <View style='padding: 40rpx'>
      <AtForm>
        {
          featConfig.ZhuYuanCardName &&
          <AtInput
            name='cardName'
            title='姓名'
            type='text'
            placeholder='请输入姓名'
            value={card.cardName}
            onChange={handleChange.bind(this, 'cardName')}
          />
        }

        <AtInput
          name='cardNo'
          title='住院号'
          type='text'
          placeholder='请输入住院号'
          value={card.cardNo}
          onChange={handleChange.bind(this, 'cardNo')}
        />
        
      </AtForm>
      <View style='padding: 60rpx'>
        <AtButton type='primary' loading={busy} circle onClick={handleSubmit}>确认绑定</AtButton>
      </View>
    </View>
  )
}