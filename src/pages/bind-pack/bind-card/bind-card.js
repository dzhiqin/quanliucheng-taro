import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Picker } from '@tarojs/components'
import { AtInput, AtForm, AtButton,AtIcon, AtList, AtListItem } from 'taro-ui'
import {custom} from '@/custom/index'
import { 
  idCardValidator, getBirthdayByIdCard, getGenderByIdCard, validateMessages, phoneValidator, birthdayValidator,
  idenTypeOptions, onetimeTemplates 
} from '@/utils'
import { subscribeService } from '@/service/api/taro-api'
import SubscribeNotice from '@/components/subscribe-notice/subscribe-notice'
import { createCard, fetchNationalities, fetchUserInfoByHealthCode, TaroGetLocation } from '@/service/api'
import { CardsHealper } from '@/utils/cards-healper'
import { loadingService, toastService } from '@/service/toast-service'
import './bind-card.less'

export default class BindCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      busy: false,
      showNotice: false,
      currentIdenTypeIndex: 0,
      currentIdenTypeValue: '身份证',
      idenTypeNames: [],
      genders: ['男','女'],
      currentGenderIndex: 0,
      currentGenderValue: '请选择性别',
      selectedDate: '请选择出生日期',
      bindCardConfig: '',
      card: {
        patientName: '',
        idenType: '',
        idenNo: '',
        gender: '',
        birthday: '',
        phone: '',
        address: '',
        isDefault: true,
        isHaveCard: false,
        cardNo: '',
        maritalStatus: '未婚',
        nationality: '中国',
        parentName: '',
        parentId: '',
        wechatCode: Taro.getCurrentInstance().router.params.wechatCode || ''
      }
    }
    
  }
  
  componentDidMount() {
    idenTypeOptions.forEach(item => this.state.idenTypeNames.push(item.name))
    this.setState({
      bindCardConfig: custom.feat.bindCard,
    })
    const healthCode = Taro.getStorageSync('healthCode')
    if(healthCode){
      loadingService(true)
      fetchUserInfoByHealthCode({healthCode}).then(res => {
        if(res.resultCode === 0){
          loadingService(false)
          Taro.removeStorageSync('healthCode')
          const data = res.data
          this.setState({
            card: {
              ...this.state.card,
              patientName: data.name,
              idenType: 0,  // 健康卡平台返回的身份证类型idType=‘01’，和代码里的设置不匹配，这里默认给0
              idenNo: data.idCard,
              gender: data.gender,
              birthday: data.birthday,
              phone: data.phone1 || data.phone2,
              address: data.address,
              qrCodeText: data.qrCodeText,
              // nationality: data.nation, // nation对应的是民族，不是国籍
              idenType: idenTypeOptions[0].id
            },
            selectedDate: data.birthday,
            currentGenderValue: data.gender
          })
        }else{
          toastService({title: ''+res.message})
        }
      })
    }else{
      this.setState({
        card: {
          ...this.state.card,
          idenType: idenTypeOptions[0].id
        }
      })
    }
  }
  getAllCountries() {
    fetchNationalities().then(res => {
      console.log(res);
    })
  }
  async onSubmit() {
    this.setState({busy: true})
    const {result,msg}= this.formValidator()
    if(result){
      
      const subRes = await subscribeService(onetimeTemplates.bindCard())
      if(subRes.result){
        this.handleCreateCard()
      }else{
        this.setState({showNotice: true})
      }
    }else{
      this.setState({busy: false})
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
    }
  }
  handleCreateCard() {
    loadingService(true)
    createCard(this.buildCardParams())
    .then(res => {
      if(res.resultCode === 0){
        CardsHealper.updateAllCards().then(() => {
          toastService({title: '创建成功', icon: 'success', onClose: () => Taro.navigateBack()})
        })
      }else{
        let msg = ''
        if (/成功创建患者档案信息/.test(res.message)) {
          msg = '健康卡创建失败，但诊疗卡创建成功且支持挂号'
          CardsHealper.updateAllCards().then(() => {
            toastService({title: msg,onClose:()=> Taro.navigateBack()})
          })
        }else{
          msg = res.message
          toastService({title: msg})
          this.setState({busy: false})
        }
      }
    })
    .catch(err => {
      this.setState({busy: false})
      loadingService(false)
      toastService({title: ''+err})
    })
  }
  buildCardParams() {
    const card = this.state.card
    let params = {
      ...card,
      isHaveCard: card.isHaveCard,
      openId: Taro.getStorageSync('openId')
    }
    console.log('buildparams', params);
    return params
  }
  formValidator() {
    const keys = Object.keys(this.state.card)
    const card = this.state.card
    let result = true
    let msg = ''
    for(let i =0 ;i<keys.length;i++){
      const key = keys[i]
      const value = card[keys[i]]
      if(typeof value === 'boolean' || value === 0) continue
      if(!value){
        // console.log('key=',keys[i],'value=',card[keys[i]])
        if(this.state.currentIdenTypeValue === '儿童(无证件)' && key === 'idenNo') continue
        if(!this.state.bindCardConfig.nationality && key === 'nationality') continue
        if(!card.isHaveCard && key === 'cardNo') continue
        if(this.state.currentIdenTypeValue !== '儿童(无证件)' && (key === 'parentName' || key === 'parentId')) continue
        if(key ==='wechatCode') continue
        msg = (validateMessages[keys[i]] || key) + '的值不能为空'
        result = false
        break
      }
      if(key === 'phone' && !phoneValidator(value)) {
        result = false
        msg = '请输入正确的手机号'
      }
      if((key === 'idenNo') && !idCardValidator(value)) {
        result = false
        msg = '请输入正确的证件号'
      }
      if(key === 'birthday' && !birthdayValidator(value)) {
        result = false
        msg = '请输入正确的出生日期'
      }
    }
    return {result, msg}
  }
  handleCardChange (stateName,value) {
    if(typeof value === 'string'){
      value = value.trim()
    }
    if(stateName === 'idenNo' && idCardValidator(value)) {
      const birthday = getBirthdayByIdCard(value)
      const gender = getGenderByIdCard(value)
      this.setState({
        selectedDate: birthday,
        currentGenderValue: gender,
        card: {
          ...this.state.card,
          birthday,
          gender,
          [stateName]: value
        }
      })
    }else{
      this.setState({
        card: {
          ...this.state.card,
          [stateName]: value
        }
      })
    }
    
  }

  onIdenTypeChange(e) {
    const index = e.detail.value
    const name =this.state.idenTypeNames[index]
    const item = idenTypeOptions.find(i => i.name === name)
    
    this.setState({
      currentIdenTypeIndex: index,
      currentIdenTypeValue: name
    })
    this.handleCardChange('idenType',item.id)
  }
  onGenderChange(e){
    const index = e.detail.value
    const value = this.state.genders[index]
    this.setState({
      currentGenderIndex: index,
      currentGenderValue: value
    })
    this.handleCardChange('gender',value)
  }
  onDateChange(e){
    const value = e.detail.value
    this.setState({
      selectedDate: value
    })
    this.handleCardChange('birthday',value)
  }
  onDefaultChange(value){
    this.handleCardChange('isDefault',value)
  }
  onIsHaveCardChange(value){
    this.handleCardChange('isHaveCard',value)
  }
  onMaritalStatusChange(value){
    this.handleCardChange('maritalStatus',value)
  }
  onScanResult(e) {
    const data = e.mpEvent.detail
    this.setState({
      card: {
        ...this.state.card,
        patientName: data.name.text,
        idenNo: data.id.text,
        address: data.address.text,
        gender: data.gender.text,
        birthday: data.birth.text
      },
      selectedDate: data.birth.text,
      currentGenderValue: data.gender.text
    })
  }
  getAddressFromMap() {
    loadingService(true)
    TaroGetLocation({type: 'wgs84'}).then(res => {
      loadingService(false)
      Taro.chooseLocation({
        latitude: res.latitude,
        longitude: res.longitude,
        success: (data) => {
          this.setState({
            card:{
              ...this.state.card,
              address: data.address + data.name
            }
          })
        },
        fial: (err) => {
          toastService({title: ''+err})
        }
      })
    }).catch(err => {
      toastService({title: ''+err})
    })
  }
  render() {
    return (
      <View className='bind-card'>
        <SubscribeNotice show={this.state.showNotice} />
        <ocr-scan onsuccess={this.onScanResult.bind(this)}></ocr-scan>
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
        >
          <AtInput 
            name='patientName' 
            title='姓名' 
            type='text' 
            placeholder='请输入姓名' 
            value={this.state.card.patientName} 
            onChange={this.handleCardChange.bind(this,'patientName')} 
          />

          <Picker mode='selector' range={this.state.idenTypeNames} onChange={this.onIdenTypeChange.bind(this)} value={this.state.currentIdenTypeIndex}>
            <AtList>
              <AtListItem
                title='证件类型'
                extraText={this.state.currentIdenTypeValue}
              >
              </AtListItem>
            </AtList>
          </Picker>

          {
            this.state.currentIdenTypeValue !== '儿童(无证件)' || !this.state.bindCardConfig.parentInfo ? 
            <AtInput 
              name='idenNo' 
              title='证件号码' 
              type='text' 
              placeholder='请输入证件号码' 
              value={this.state.card.idenNo} 
              onChange={this.handleCardChange.bind(this,'idenNo')} 
            >
            </AtInput> : 
            ''
          }
        
          {
            this.state.currentIdenTypeValue !== '门诊卡' &&
            <Picker mode='selector' range={this.state.genders} onChange={this.onGenderChange.bind(this)} value={this.state.currentGenderIndex}>
              <AtList>
                <AtListItem
                  title='性别'
                  extraText={this.state.currentGenderValue}
                >
                </AtListItem>
              </AtList>
            </Picker> 
          }
          
          {
            this.state.currentIdenTypeValue !== '门诊卡' &&
            <Picker mode='date' onChange={this.onDateChange.bind(this)} value={this.state.selectedDate}>
              <AtList>
                <AtListItem
                  title='出生日期'
                  extraText={this.state.selectedDate}
                >
                </AtListItem>
              </AtList>
            </Picker> 
          }

          <AtInput 
            name='phone' 
            title='电话号码' 
            type='number' 
            placeholder='请输入电话号码' 
            value={this.state.card.phone} 
            onChange={this.handleCardChange.bind(this,'phone')} 
          />

          <AtInput 
            name='address' 
            title='详细地址' 
            type='text' 
            placeholder='请输入详细地址' 
            value={this.state.card.address} 
            onChange={this.handleCardChange.bind(this,'address')}
          >
            <AtIcon value='map-pin' size='20' color='#56A1F4' onClick={this.getAddressFromMap.bind(this)}></AtIcon>
          </AtInput>

          {
            this.state.bindCardConfig.hasCard &&
            <AtInput 
              name='isHaveCard' 
              title='院内就诊卡' 
              type='number' 
              placeholder='' 
            >
              <View className={`btn ${this.state.card.isHaveCard ? 'primary' : 'cancel'}`} onClick={this.onIsHaveCardChange.bind(this, true)}>有</View>
              <View className={`btn ${this.state.card.isHaveCard ? 'cancel' : 'primary'}`} onClick={this.onIsHaveCardChange.bind(this,false)}>无</View>
            </AtInput> 
          }
          
          {
            this.state.bindCardConfig.hasCard && this.state.card.isHaveCard &&
            <AtInput 
              name='cardNo' 
              title='就诊卡号' 
              type='text' 
              placeholder='请输入就诊卡号' 
              value={this.state.card.cardNo} 
              onChange={this.handleCardChange.bind(this,'cardNo')} 
            /> 
          }
          
          {
            this.state.bindCardConfig.maritalStatus &&
            <AtInput 
              name='maritalStatus' 
              title='婚姻状况' 
              type='number' 
              placeholder='' 
            >
              <View className={`btn ${this.state.card.maritalStatus === '未婚' ? 'info' : 'cancel'}`} onClick={this.onMaritalStatusChange.bind(this, '未婚')}>未婚</View>
              <View className={`btn ${this.state.card.maritalStatus === '已婚' ? 'info' : 'cancel'}`} onClick={this.onMaritalStatusChange.bind(this, '已婚')}>已婚</View>
              <View className={`btn ${this.state.card.maritalStatus === '离婚' ? 'info' : 'cancel'}`} onClick={this.onMaritalStatusChange.bind(this, '离婚')}>离婚</View>
              <View className={`btn ${this.state.card.maritalStatus === '丧偶' ? 'info' : 'cancel'}`} onClick={this.onMaritalStatusChange.bind(this, '丧偶')}>丧偶</View>
            </AtInput> 
          }

          {
            this.state.bindCardConfig.nationality &&
            <AtInput 
              name='nationality' 
              title='国籍' 
              type='text' 
              placeholder='请输入国籍' 
              value={this.state.card.nationality} 
              onChange={this.handleCardChange.bind(this,'nationality')} 
            /> 
          }

          <AtInput 
            name='isDefault' 
            title='是否设置为默认健康卡' 
            type='number' 
            placeholder='' 
          >
            <View className={`btn ${this.state.card.isDefault ? 'info' : 'cancel'}`} onClick={this.onDefaultChange.bind(this, true)}>是</View>
            <View className={`btn ${this.state.card.isDefault ? 'cancel' : 'info'}`} onClick={this.onDefaultChange.bind(this,false)}>否</View>
          </AtInput>

          {
            this.state.currentIdenTypeValue === '儿童(无证件)' &&
            <AtInput 
              name='parentName' 
              title='监护人姓名' 
              type='text' 
              placeholder='请输入监护人姓名' 
              value={this.state.card.parentName} 
              onChange={this.handleCardChange.bind(this,'parentName')} 
            />
          }
          
          {
            this.state.currentIdenTypeValue === '儿童(无证件)' &&
            <AtInput 
              name='parentId' 
              title='监护人身份证号' 
              type='text' 
              placeholder='请输入监护人身份证' 
              value={this.state.card.parentId} 
              onChange={this.handleCardChange.bind(this,'parentId')} 
            />
          }
          
          <View style='padding: 60rpx;'>
            <AtButton type='primary' loading={this.state.busy} circle onClick={this.onSubmit.bind(this)}>立即绑定</AtButton>
          </View>
        </AtForm>
      </View>
    )
  }
}