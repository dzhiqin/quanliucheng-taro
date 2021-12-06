import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import "taro-ui/dist/style/components/list.scss"

export default function ClinicList(props) {
  const onClickItem = (deptId) => {
    Taro.navigateTo({url: `/pages/register-pack/doctor-list/doctor-list?deptId=${deptId}`})
  }
  return (
    <AtList className='clinic-list'>
      {
        props.clinics.map((clinic) => 
          <AtListItem title={clinic.deptName} arrow='right' key={clinic.deptId} onClick={onClickItem.bind(null,clinic.deptId)} />
        )
      }
    </AtList>
  )
}