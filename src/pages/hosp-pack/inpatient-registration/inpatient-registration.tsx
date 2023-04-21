import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { useState } from 'react'
import { View, Picker } from '@tarojs/components'
import { fetchInpatientRegNotices, fetchInpatientRegInfo } from '@/service/api'
import { AtButton, AtForm,AtInput,AtList,AtListItem } from 'taro-ui'
import BkRadios from '@/components/bk-radios/bk-radios'
import HealthCards from '@/components/health-cards/health-cards'
import { CardsHealper } from '@/utils/cards-healper'
import { GENDER } from '@/enums/index'
import { humanDate } from '@/utils/format'

export default function InpatientRegistration() {
  console.log('date:',humanDate(new Date()))
  const defaultCard = CardsHealper.getDefault()
  const handleRadioChange = (a1,a2) => {
    console.log(`a1=${a1};a2=${JSON.stringify(a2)}`);
    
  }
  const [currentCard, setCurrentCard] = useState({
    cardNo: ''
  })
  const [busy,setBusy] = useState(false)
  const [form, setForm] = useState({
    hasHosp: 0,
    isRemoteMedInsurance: 0,
    cardNo: defaultCard.cardNo,
    patientName: defaultCard.name,
    idenNo: defaultCard.idenNo,
    birthday: defaultCard.birthdate,
    address: defaultCard.address,
    cellphone: defaultCard.cellphone,
    age: defaultCard.age,
    nationality: '中国',
    nation: '汉',
    gender: defaultCard.gender,
    nativePlace: [],
    region: []
  })
  
  const onCardChange = (card) => {
    setCurrentCard(card)
  }
  const onInputChange = (e) => {
    console.log(e);
    
  }
  const onDateChange = (e) => {
    console.log(e);
    
  }
  const onNativePlaceChange = (e) => {
    console.log(e);
    
  }
  const onRegionChange = (e) => {
    console.log(e);
    
  }
  const handleSubmit = () => {
    console.log('submit',form);
    
  }
  return(
    <View>
      <HealthCards onCard={onCardChange} switch />
      <AtForm>
        <View className='bk-input'>
          <BkRadios name='是否曾经住院' options={[{name: '是', value: 1},{name: '否', value: 0}]} value={0} onRadioChaneg={handleRadioChange.bind(null,'hasHosp')} />
        </View>
        <View className='bk-input'>
          <BkRadios name='有无异地医保' options={[{name: '有', value: 1},{name: '无', value: 0}]} value={0} onRadioChaneg={handleRadioChange.bind(null,'isRemoteMedInsurance')} />
        </View>
        <AtInput 
          name='cardNo' 
          title='诊疗卡号' 
          type='text' 
          placeholder='请输入诊疗卡号' 
          value={form.cardNo} 
          onChange={onInputChange.bind(this,'cardNo')} 
        /> 
        <AtInput 
          name='patientName' 
          title='姓名' 
          type='text' 
          placeholder='请输入患者姓名' 
          value={form.patientName} 
          onChange={onInputChange.bind(this,'patientName')} 
        /> 
        <AtInput 
          name='idenNo' 
          title='身份证号' 
          type='text' 
          placeholder='请输入身份证号' 
          value={form.idenNo} 
          onChange={onInputChange.bind(this,'idenNo')} 
        /> 
        
        <View className='bk-input'>
          <BkRadios name='性别' options={[{name: '男', value: '0'},{name: '女', value: '1'}]} value={form.gender} onRadioChaneg={handleRadioChange.bind(null,'gender')} />
        </View>
        <Picker mode='date' onChange={onDateChange} value={form.birthday} end={humanDate(new Date())} >
          <AtList>
            <AtListItem
              title='出生日期'
              extraText={form.birthday}
            >
            </AtListItem>
          </AtList>
        </Picker> 
        <Picker mode='region' onChange={onNativePlaceChange} value={form.nativePlace}>
          <AtList>
            <AtListItem
              title='籍贯'
              extraText={form.nativePlace.join('')}
            >
            </AtListItem>
          </AtList>
        </Picker>
        <Picker mode='region' onChange={onRegionChange} value={form.region}>
          <AtList>
            <AtListItem
              title='现居住地'
              extraText={form.region.join('')}
            >
            </AtListItem>
          </AtList>
        </Picker>
        <AtInput 
          name='phone' 
          title='联系电话' 
          type='text' 
          placeholder='请输入联系电话' 
          value={form.cellphone} 
          onChange={onInputChange.bind(this,'phone')} 
        /> 
        <AtInput 
          name='address' 
          title='详细地址' 
          type='text' 
          placeholder='请输入地址' 
          value={form.address} 
          onChange={onInputChange.bind(this,'address')} 
        /> 
        <AtInput 
          name='age' 
          title='年龄' 
          type='text' 
          placeholder='请输入年龄' 
          value={form.address} 
          onChange={onInputChange.bind(this,'age')} 
        /> 
        <AtInput 
          name='nationality' 
          title='国籍' 
          type='text' 
          placeholder='请输入国籍' 
          value={form.nationality} 
          onChange={onInputChange.bind(this,'nationality')} 
        /> 
        <AtInput 
          name='nation' 
          title='民族' 
          type='text' 
          placeholder='请输入民族' 
          value={form.nation} 
          onChange={onInputChange.bind(this,'nation')} 
        /> 
      </AtForm>
      <View style='padding: 60rpx'>
        <AtButton type='primary' loading={busy} circle onClick={handleSubmit}>提交</AtButton>
      </View>
    </View>
  )
}