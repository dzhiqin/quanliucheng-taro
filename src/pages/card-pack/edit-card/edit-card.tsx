import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtForm, AtIcon, AtInput, AtList, AtListItem } from 'taro-ui'
import BkInput from '@/components/bk-input/bk-input'
import { useState } from 'react'
import { idenTypeOptions } from '@/utils/select-options'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import { TaroGetLocation, TaroSubscribeService } from '@/service/api'
import './edit-card.less'
import { idCardValidator, phoneValidator, validateMessages } from '@/utils/validators'
import { custom } from '@/custom/index'
import { WEAPP } from '@/utils/tools'

export default function EditCard () {
  const router = Taro.useRouter()
  const card = JSON.parse(router.params.card)
  const [busy,setBusy] = useState(false)
  const [form,setForm] = useState({
    patientName: card.name,
    id: card.id,
    cardNo: card.cardNo,
    phone: card.cellphone,
    idenNo: card.idenNo,
    isDefault: card.isDefault,
    address: card.address,
    idenType: 0
  })
  const [state,setState] = useState({
    currentIdenTypeIndex: 0,
    currentIdenTypeValue: '身份证',
  })
  const idenTypeNames = idenTypeOptions.map(i => i.name)
  const formValidator = () => {
    const keys = Object.keys(form)
    let result = true
    let msg = ''
    for(let i = 0; i<keys.length; i++ ){
      const key = keys[i]
      const value = form[key]
      if(typeof value === 'boolean' || value === 0) continue
      if(!value){
        msg = validateMessages[key] || (key+'的值不能为空')
        result = false
        break
      }
      if(key==='phone' && !phoneValidator(value)){
        result = false
        msg = '请输入正确的手机号'
      }
      if((key === 'idenNo') && state.currentIdenTypeValue === '身份证' && !idCardValidator(value)) {
        result = false
        msg = '请输入正确的证件号'
      }
    }
    return {result,msg}
  }
  const handleSubmit = async () => {
    console.log('submit',form);
    
    setBusy(true)
    const {result,msg} = formValidator()
    if(!result){
      setBusy(false)
      toastService({title: msg})
      return
    }
    let subRes
    if(WEAPP){
      subRes = await TaroSubscribeService(custom.subscribes.bindCardNotice)
    }
    if(subRes.result){
      handleUpdateCard()
    }else{
      modalService({content: subRes.msg})
      setBusy(false)
    }
  }
  const handleUpdateCard = () => {
    console.log('handle update');
    
    setBusy(false)
  }
  const handleChange = (stateName,value) => {
    setForm({
      ...form,
      [stateName]: value
    })
  }
  const onIdenTypeChange = (e) => {
    const index = e.detail.value
    const name = idenTypeNames[index]
    const item = idenTypeOptions.find(i => i.name === name)
    setState({
      currentIdenTypeIndex: index,
      currentIdenTypeValue: name
    })
    handleChange('idenType',item.id)
  }
  const getAddressFromMap = () => {
    loadingService(true)
    TaroGetLocation({type: 'wgs84'}).then((res:any) => {
      loadingService(false)
      Taro.chooseLocation({
        latitude: res.latitude,
        longitude: res.longitude,
        success: (data) => {
          handleChange('address',data.address)
        },
        fail: () => {
          toastService({title: '未选择地址'})
        }
      })
    }).catch(err => {
      if(err.errMsg==='getLocation:fail auth deny'){
        loadingService(false)
        Taro.showModal({
          content: '检测到您没有打开小程序的定位授权，是否手动打开？',
          confirmText: '确认',
          cancelText: '取消',
          success: result => {
            if(result.confirm){
              Taro.openSetting({
                success: () => {}
              })
            }else{
              Taro.navigateBack()
            }
          }
        })
      }else{
        toastService({title: '获取位置失败',onClose: () => {loadingService(false)}})
        console.error(err)
      }
    })
  }
  return(
    <View className='edit-card'>
      <AtForm onSubmit={handleSubmit}>
        <BkInput name='patientName' title='姓名' type='text' placeholder='请输入姓名' value={form.patientName} maxLength={30}
          onBlur={handleChange.bind(null,'patientName')}
        ></BkInput>
        <Picker mode='selector' range={idenTypeNames} onChange={onIdenTypeChange} value={state.currentIdenTypeIndex} >
          <AtList>
            <AtListItem
              title='证件类型'
              extraText={state.currentIdenTypeValue}
            >
            </AtListItem>
          </AtList>
        </Picker>
        <AtInput
          name='idenNo'
          title='证件号码'
          type='text'
          placeholder='请输入证件号码'
          value={form.idenNo}
          onBlur={handleChange.bind(null,'idenNo')}
          onChange={() => {}}
        ></AtInput>
        <BkInput 
          name='phone' 
          title='电话号码' 
          type='number' 
          placeholder='请输入电话号码' 
          maxLength={11}
          value={form.phone} 
          onChange={handleChange.bind(null,'phone')} 
        />
        <BkInput 
          name='address' 
          title='详细地址' 
          type='text' 
          placeholder='请输入详细地址' 
          maxLength={34}
          value={form.address} 
          onChange={handleChange.bind(null,'address')}
        >
          <AtIcon value='map-pin' size='20' color='#56A1F4' onClick={getAddressFromMap}></AtIcon>
        </BkInput>
        <AtInput 
          name='cardNo' 
          title='就诊卡号' 
          type='text' 
          placeholder='请输入就诊卡号' 
          value={form.cardNo} 
          disabled
          onChange={() => {}} 
        /> 
      </AtForm>
      <View style='padding: 60rpx;'>
        <AtButton type='primary' loading={busy} circle onClick={handleSubmit}>确认修改</AtButton>
      </View>
    </View>
  )
}