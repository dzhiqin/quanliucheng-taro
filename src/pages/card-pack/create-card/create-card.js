import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Picker } from '@tarojs/components'
import { AtInput, AtForm, AtButton,AtIcon, AtList, AtListItem } from 'taro-ui'
import {custom} from '@/custom/index'
import { 
  idCardValidator, getBirthdayByIdCard, getGenderByIdCard, validateMessages, phoneValidator, birthdayValidator,
  idenTypeOptions, getPrivacyID, getPrivacyPhone, getPrivacyName
} from '@/utils'
import { AlipaySubscribeService, TaroSubscribeService } from '@/service/api/taro-api'
import SubscribeNotice from '@/components/subscribe-notice/subscribe-notice'
import { createCard, fetchUserInfoByHealthCode, sendSmsByFeiGe, TaroGetLocation } from '@/service/api'
import { CardsHealper } from '@/utils/cards-healper'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import BkInput from '@/components/bk-input/bk-input'
import './create-card.less'
import { reportCmPV_YL } from '@/utils/cloudMonitorHelper'
import { getRandomNumber,WEAPP,ALIPAYAPP } from '@/utils/tools'

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
      realName: '',
      realPhone: '',
      realId: '',
      smsCode: '',
      smsCodeValid: '',
      count: 0,
      useReginSelector: true,
      region: custom.region,
      card: {
        patientName: '',
        idenType: 0,
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
        wechatCode: Taro.getCurrentInstance().router.params.wechatCode || '',
      }
    }
    this.handleSendSms = this.handleSendSms.bind(this)
    this.onScanResult = this.onScanResult.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this)
    // this.handleCardChange = this.handleCardChange.bind(this)
  }
  
  componentDidMount() {
    if(custom.feat.guangHuaMonitor.enable){
      reportCmPV_YL({title: '在线建档'})
    }
    idenTypeOptions.forEach(item => this.state.idenTypeNames.push(item.name))
    this.setState({
      bindCardConfig: custom.feat.bindCard,
    })
    const healthCode = Taro.getStorageSync('healthCode')
    if(healthCode){
      loadingService(true)
      fetchUserInfoByHealthCode({healthCode}).then(res => {
        loadingService(false)
        if(res.resultCode === 0){
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
          modalService({content: res.message})
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
    const authInfoStr = Taro.getCurrentInstance().router.params.authInfo
    if(authInfoStr){
      const authInfo = JSON.parse(authInfoStr)
      const {realName, mobile, idCard} = authInfo
      const birthday = getBirthdayByIdCard(idCard)
      const gender = getGenderByIdCard(idCard)
      // console.log('get auth info',authInfo);
      this.setState({
        currentGenderValue: gender,
        selectedDate: birthday,
        realName,
        realId: idCard,
        realPhone: mobile,
        card:{
          ...this.state.card,
          patientName: getPrivacyName(realName),
          phone: getPrivacyPhone(mobile),
          birthday,
          gender,
          idenNo: getPrivacyID(idCard)
        }
      })
    }
  }
  async onSubmit() {
    this.setState({busy: true})
    const {result,msg}= this.formValidator()
    if(!result){
      this.setState({busy: false})
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    if(custom.feat.bindCard.smsVerify.enable && this.state.smsCode != this.state.smsCodeValid){
      toastService({title: '验证码错误'})
      this.setState({busy: false})
      return
    }
    let subRes
    if(WEAPP){
      subRes = await TaroSubscribeService(custom.subscribes.bindCardNotice)
      if(subRes.result){
        this.handleCreateCard()
      }else{
        this.setState({showNotice: true})
      }
    }
    if(ALIPAYAPP){
      subRes = await AlipaySubscribeService(custom.subscribes.bindCardNotice)
      if(subRes.result){
        this.handleCreateCard()
      }else{
        modalService({content: subRes.msg})
      }
    }
  
  }
  handleCreateCard() {
    loadingService(true)
    createCard(this.buildCardParams())
    .then(res => {
      if(res.resultCode === 0){
        CardsHealper.updateAllCards().then(() => {
          toastService({title: '创建成功', icon: 'success', onClose: () => {Taro.navigateBack();loadingService(false)}})
        })
      }else{
        let msg = ''
        if (/成功创建患者档案信息/.test(res.message)) {
          msg = '诊疗卡创建成功'
          // msg = '健康卡创建失败，但诊疗卡创建成功且支持挂号'
          CardsHealper.updateAllCards().then(() => {
            toastService({title: msg,onClose:()=> {Taro.navigateBack();loadingService(false)}})
          })
        }else if(/已办理/.test(res.message)){
          const cardNo = res.message.replace(/[^0-9]/ig,"")
          this.setState({
            card:{
              ...this.state.card,
              cardNo,
              isHaveCard: true
            }
          })
          modalService({content: '已有诊疗卡，已为您更新诊疗卡信息，请重新提交'})
          loadingService(false)
          this.setState({busy: false})
        }else{
          loadingService(false)
          msg = res.message ? res.message : JSON.stringify(res)
          this.setState({busy: false})
          modalService({showCancel:false,content: msg})
        }
      }
    })
    .catch(err => {
      this.setState({busy: false})
      loadingService(false)
      modalService({showCancel:false,content: JSON.stringify(err)})
    })
  }
  buildCardParams() {
    let card
    if(WEAPP){
      card = this.state.card
    }else{
      card = {
        ...this.state.card,
        patientName: this.state.realName,
        idenNo: this.state.realId,
        phone: this.state.realPhone
      }
    }
    let params = {
      ...card,
      address: this.state.useReginSelector ? this.state.region.join('') + card.address : card.address,
      isHaveCard: card.isHaveCard,
      openId: Taro.getStorageSync('openId')
    }
    return params
  }
  formValidator() {
    let keys,card
    if(ALIPAYAPP){
      card = {
        ...this.state.card,
        patientName: this.state.realName,
        idenNo: this.state.realId,
        phone: this.state.realPhone
      }
      keys = Object.keys(card)
    }else{
      keys = Object.keys(this.state.card)
      card = this.state.card
    }
    
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
        if(!card.isHaveCard && key === 'cardNo') continue // 点选有卡时，不允许卡号为空
        // if(key==='cardNo') continue // 允许卡号为空
        if(this.state.currentIdenTypeValue !== '儿童(无证件)' && (key === 'parentName' || key === 'parentId')) continue
        if(key ==='wechatCode') continue
        msg = validateMessages[keys[i]] || (key + '的值不能为空')
        result = false
        break
      }
      if(key === 'phone' && !phoneValidator(value)) {
        result = false
        msg = '请输入正确的手机号'
      }
      if((key === 'idenNo') && this.state.currentIdenTypeValue === '身份证' && !idCardValidator(value)) {
        result = false
        msg = '请输入正确的证件号'
      }
      if(key === 'birthday' && !birthdayValidator(value)) {
        result = false
        msg = '请输入正确的出生日期'
      }
      if(key === 'patientName' && value.length < 2){
        result = false
        msg = '请输入正确的姓名，不少于2个字'
      }
    }
    // if(!this.state.region.length) {
    //   result = false
    //   msg = '请选择省市区'
    // }else{
    //   const fullAddress = this.state.region.join('') + this.state.card.address
    //   if(fullAddress.length >34){
    //     result = false
    //     msg = '联系地址应小于35个字符，如果使用地图选点请检查是否重复输入省市区'
    //   }
    // }
    if(this.state.useReginSelector){
      if(!this.state.region.length){
        result = false
        msg = '请选择省市区'
      }else{
        const fullAddress = this.state.region.join('') + this.state.card.address
        if(fullAddress.length > 34){
          result = false
          msg = '联系地址应小于35个字符'
        }
      }
      
    }
    
    return {result, msg}
  }
  handleCardChange (stateName,value) {
    // console.log(`statename=${stateName};value=${value}`);
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
  handlePatientNameChange(value){
    value = value.trim()
    this.setState({
      realName: value,
      card: {
        ...this.state.card,
        ['patientName']: getPrivacyName(value)
      }
    })
  }
  handleIdChange(value){
    const birthday = getBirthdayByIdCard(value)
    const gender = getGenderByIdCard(value)
    value = value.trim()
    this.setState({
      realId: value,
      card: {
        ...this.state.card,
        birthday,
        gender,
        ['idenNo']: getPrivacyID(value)
      }
    })
  }
  handlePhoneChange(value){
    this.setState({
      realPhone: value,
      card: {
        ...this.state.card,
        ['phone']: getPrivacyPhone(value)
      }
    })
  }
  handleOnFocus(stateName,realValue){
    // console.log(`stateName:${stateName},realValue:${realValue}`);
    this.setState({
      card: {
        ...this.state.card,
        [stateName]: realValue
      }
    })
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
      currentGenderValue: data.gender.text,
      useReginSelector: false
    })
  }
  onRegionChange(e){
    this.setState({region: e.detail.value})
  }
  getAddressFromMap() {
    modalService({
      content: '是否使用地图选点功能？',
      showCancel:true,
      success: res => {
        if(res.cancel){
          this.setState({useReginSelector: true})
          this.handleCardChange('address','')
        }
        if(res.confirm){
          this.setState({useReginSelector: false})
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
      }
    })
    
  }
  handleSendSms() {
    if(this.state.count > 0) return
    if(!this.state.card.phone) {
      toastService({title: '请先填写手机号'})
      return
    }
    if(!phoneValidator(this.state.card.phone)){
      toastService({title: '请填写正确的手机号'})
      return
    }
    this.countDown(60)
    const code = getRandomNumber()
    this.setState({smsCodeValid: code})
    sendSmsByFeiGe({content: code, mobile: this.state.card.phone}).then(res => {
      if(res.code === 0){
        toastService({title: '验证码发送成功'})
      }else{
        modalService({title: '发送短信失败',title: res.msg})
      }
    })
  }
  countDown(value){
    return setTimeout(() => {
      value--
      this.setState({count: value})
      if(value > 0){
        this.countDown(value)
      }
    },1000)
    
  }
  render() {
    return (
      <View className='create-card'>
        <SubscribeNotice show={this.state.showNotice} />
        {
          WEAPP &&
          <ocr-scan onsuccess={this.onScanResult}></ocr-scan>
        }
        <AtForm
          onSubmit={this.onSubmit}
        >
          {/* <BkInput name='patientName' title='姓名' type='text' placeholder='请输入姓名' value={this.state.card.patientName} maxLength={15} 
            onChange={this.handleCardChange.bind(this,'patientName')}
          ></BkInput> */}
          {
            WEAPP &&
            <BkInput name='patientName' title='姓名' type='text' placeholder='请输入姓名' value={this.state.card.patientName} maxLength={30} 
              onChange={this.handleCardChange.bind(this,'patientName')}
            ></BkInput>
          }
          {
            ALIPAYAPP &&
            <BkInput name='patientName' title='姓名' type='text' placeholder='请输入姓名' value={this.state.card.patientName} maxLength={30} 
              onBlur={this.handlePatientNameChange.bind(this)}
              onFocus={this.handleOnFocus.bind(this,'patientName',this.state.realName)}
            ></BkInput>
          }
          <Picker mode='selector' range={this.state.idenTypeNames} onChange={this.onIdenTypeChange.bind(this)} value={this.state.currentIdenTypeIndex} >
            <AtList>
              <AtListItem
                title='证件类型'
                extraText={this.state.currentIdenTypeValue}
              >
              </AtListItem>
            </AtList>
          </Picker>

          {
            this.state.currentIdenTypeValue !== '儿童(无证件)' && WEAPP &&
            <AtInput 
              name='idenNo' 
              title='证件号码' 
              type='text' 
              placeholder='请输入证件号码' 
              value={this.state.card.idenNo} 
              onBlur={this.handleCardChange.bind(this,'idenNo')} 
            >
            </AtInput> 
          }
          {
            this.state.currentIdenTypeValue !== '儿童(无证件)' && ALIPAYAPP &&
            <AtInput 
              name='idenNo' 
              title='证件号码' 
              type='text' 
              placeholder='请输入证件号码' 
              value={this.state.card.idenNo} 
              onBlur={this.handleIdChange.bind(this)} 
              onFocus={this.handleOnFocus.bind(this,'idenNo',this.state.realId)}
            >
            </AtInput> 
          }

          {
            WEAPP &&
            <BkInput 
              name='phone' 
              title='电话号码' 
              type='number' 
              placeholder='请输入电话号码' 
              maxLength={11}
              value={this.state.card.phone} 
              onChange={this.handleCardChange.bind(this,'phone')} 
            />
          }
          {
            WEAPP && custom.feat.bindCard.smsVerify.enable &&
            <BkInput 
              name='smsCode' 
              title='验证码' 
              type='number' 
              placeholder='请输入短信验证码' 
              maxLength={4}
              value={this.state.smsCode} 
              onChange={(e) => {this.setState({smsCode: e});}} 
            >
              <View style={this.state.count >0 ? 'color: #aaa' : ''} onClick={this.handleSendSms}>发送验证码{this.state.count === 0 ? '' : this.state.count}</View>
            </BkInput>
          }
          {
            ALIPAYAPP && 
            <BkInput 
              name='phone' 
              title='电话号码' 
              type='number' 
              placeholder='请输入电话号码' 
              maxLength={11}
              value={this.state.card.phone} 
              onBlur={this.handlePhoneChange.bind(this)} 
              onFocus={this.handleOnFocus.bind(this,'phone',this.state.realPhone)}
            />
          }
          {
            this.state.currentIdenTypeValue !== '门诊卡' && WEAPP &&
            <Picker mode='selector' range={this.state.genders} onChange={this.onGenderChange.bind(this)} value={this.state.currentGenderIndex}  >
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
            this.state.currentIdenTypeValue !== '门诊卡' && WEAPP &&
            <Picker mode='date' onChange={this.onDateChange.bind(this)} value={this.state.selectedDate} >
              <AtList>
                <AtListItem
                  title='出生日期'
                  extraText={this.state.selectedDate}
                >
                </AtListItem>
              </AtList>
            </Picker> 
          }
          {
            this.state.useReginSelector &&
            <Picker mode='region' onChange={this.onRegionChange} value={this.state.region}>
              <AtList>
                <AtListItem
                  title='省市区'
                  extraText={this.state.region.join(' ')}
                >
                </AtListItem>
              </AtList>
            </Picker>
          }
          {/* <Picker mode='region' onChange={this.onRegionChange} value={this.state.region}>
            <AtList>
              <AtListItem
                title='省市区'
                extraText={this.state.region.join(' ')}
              >
              </AtListItem>
            </AtList>
          </Picker> */}
          <BkInput 
            name='address' 
            title='详细地址' 
            type='text' 
            placeholder='请输入详细地址' 
            maxLength={34}
            value={this.state.card.address} 
            onChange={this.handleCardChange.bind(this,'address')}
          >
            <AtIcon value='map-pin' size='20' color='#56A1F4' onClick={this.getAddressFromMap.bind(this)}></AtIcon>
          </BkInput>

          {
            this.state.bindCardConfig.hasCard &&
            <View className='create-card-item'>
              <View>院内就诊卡</View>
              <View style='display: flex;'>
                {
                  custom.hospName !== 'jszyy' &&
                  <View style='font-size: 26rpx;color: red; line-height: 60rpx;'>如果不记得卡号可选无</View>
                }
                <View className={`btn ${this.state.card.isHaveCard ? 'primary' : 'cancel'}`} onClick={this.onIsHaveCardChange.bind(this, true)}>有</View>
                <View className={`btn ${this.state.card.isHaveCard ? 'cancel' : 'primary'}`} onClick={this.onIsHaveCardChange.bind(this,false)}>无</View>
              </View>
            </View>
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
            <View className='create-card-item'>
              <View>婚姻状况</View>
              <View style='display: flex;'>
              <View className={`btn ${this.state.card.maritalStatus === '未婚' ? 'info' : 'cancel'}`} onClick={this.onMaritalStatusChange.bind(this, '未婚')}>未婚</View>
              <View className={`btn ${this.state.card.maritalStatus === '已婚' ? 'info' : 'cancel'}`} onClick={this.onMaritalStatusChange.bind(this, '已婚')}>已婚</View>
              <View className={`btn ${this.state.card.maritalStatus === '离婚' ? 'info' : 'cancel'}`} onClick={this.onMaritalStatusChange.bind(this, '离婚')}>离婚</View>
              <View className={`btn ${this.state.card.maritalStatus === '丧偶' ? 'info' : 'cancel'}`} onClick={this.onMaritalStatusChange.bind(this, '丧偶')}>丧偶</View>
              </View>
            </View>
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
          <View className='create-card-item'>
            <View>是否设置为默认健康卡</View>
            <View style='display: flex;'>
              <View className={`btn ${this.state.card.isDefault ? 'info' : 'cancel'}`} onClick={this.onDefaultChange.bind(this, true)}>是</View>
              <View className={`btn ${this.state.card.isDefault ? 'cancel' : 'info'}`} onClick={this.onDefaultChange.bind(this,false)}>否</View>
            </View>
          </View>
          {
            this.state.currentIdenTypeValue === '儿童(无证件)' && custom.feat.bindCard.parentInfo &&
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
            this.state.currentIdenTypeValue === '儿童(无证件)' && custom.feat.bindCard.parentInfo &&
            <AtInput 
              name='parentId' 
              title='监护人身份证号' 
              type='text' 
              placeholder='请输入监护人身份证' 
              value={this.state.card.parentId} 
              onChange={this.handleCardChange.bind(this,'parentId')} 
            />
          }
        </AtForm>
        <View style='padding: 60rpx;'>
          <AtButton type='primary' loading={this.state.busy} circle onClick={this.onSubmit}>立即绑定</AtButton>
        </View>
      </View>
    )
  }
}