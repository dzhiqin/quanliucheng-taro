import BkInput from '@/components/bk-input/bk-input';
import { View } from '@tarojs/components'
import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { AtInput, AtForm, AtButton } from 'taro-ui'
import { useState } from 'react';
import { idCardValidator, validateMessages } from '@/utils/validators';
import { createCard, TaroSubscribeService } from '@/service/api';
import { custom } from '@/custom/index'
import { loadingService, modalService, toastService } from '@/service/toast-service';
import { CardsHealper } from '@/utils/cards-healper';

export default function BindCard(){
  const [form,setForm] = useState({
    patientName: '',
    isHaveCard: true,
    cardNo: ''
  })
  const [busy,setBusy] = useState(false)
  const onFormChange = (stateName,event) => {
    setForm({
      ...form,
      [stateName]: event
    })
  }
  const handleBindCard = () => {
    setBusy(true)
    loadingService(true)
    createCard(form).then(res => {
      if(res.resultCode === 0 || (/成功创建患者档案信息/.test(res.message))){
        setBusy(false)
        CardsHealper.updateAllCards().then(() => {
          toastService({title: '绑卡成功',icon: 'success', onClose: () => Taro.navigateBack()})
        })
      }else{
        loadingService(false)
        setBusy(false)
        const msg = res.message ? res.message : JSON.stringify(res)
        modalService({showCancel:false,content: msg})
      }
    }).catch(err => {
      setBusy(false)
      loadingService(false)
      modalService({showCancel:false,content: JSON.stringify(err)})
    })
  }
  const onSubmit = async () => {
    const {result,msg} = formValidator()
    if(result){
      const subRes = await TaroSubscribeService(custom.onetimeSubscribe.bindCardNotice)
      if(subRes.result) {
        handleBindCard()
      }else{
        modalService({
          content: '您有消息未订阅',
          showCancel: false
        })
      }
    }else{
      modalService({
        title: '校验不通过',
        content: msg,
        showCancel: false
      })
    }  
  }
  const formValidator = () => {
    const keys = Object.keys(form)
    let result = true
    let msg = ''
    for(let i = 0; i<keys.length; i++){
      const key = keys[i]
      const value = form[key]
      if(!value){
        msg = validateMessages[keys[i]] || (key + '的值不能为空')
        result = false
        break
      }
      if((key==='idenNo') && !idCardValidator(value)){
        result = false
        msg = '请输入正确的证件号'
      }
    }
    return {result,msg}
  }
  return(
    <View className='bind-card'>
      <AtForm onSubmit={onSubmit}>
        <BkInput name='patientName' title='姓名' type='text' placeholder='请输入姓名' value={form.patientName} maxLength={15} onChange={onFormChange.bind(null,'patientName')}></BkInput>
        {/* <AtInput 
          name='idenNo' 
          title='身份证号' 
          type='text' 
          placeholder='请输入证件号码' 
          value={form.idenNo} 
          onChange={onFormChange.bind(null, 'idenNo')} 
        >
        </AtInput>  */}
        <AtInput 
          name='cardNo' 
          title='就诊卡号' 
          type='text' 
          placeholder='请输入就诊卡号' 
          value={form.cardNo} 
          onChange={onFormChange.bind(null,'cardNo')} 
        /> 
      </AtForm>
      <View style='padding: 60rpx'>
        <AtButton type='primary' loading={busy} circle onClick={onSubmit}>立即绑定</AtButton>
      </View>
    </View>
  )
}