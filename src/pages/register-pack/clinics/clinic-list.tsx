import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { AtList, AtListItem } from 'taro-ui'
import { TaroNavigateService } from '@/service/api'

export default function ClinicList(props:{
  clinics: any[],
}) {
  const onClickItem = (clinic) => {
    TaroNavigateService('register-pack','doctor-list',`deptId=${clinic.deptId}&deptName=${clinic.deptName}`)
  }
  return (
    <AtList className='clinic-list' >
      {
        props.clinics.map((clinic) => 
          <AtListItem title={clinic.deptName} arrow='right' key={clinic.deptId} onClick={onClickItem.bind(null,clinic)} />
        )
      }
    </AtList>
  )
}