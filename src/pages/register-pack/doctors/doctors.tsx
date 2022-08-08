import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState,useEffect } from 'react'
import { loadingService, toastService } from '@/service/toast-service'
import { getDoctorsByFirstDeptId } from '@/service/api'
import { AtList, AtListItem } from 'taro-ui'
import defaltAvatar from '@/images/default-avatar.png'
import './doctors.less'

export default function Doctors() {
  const router = Taro.useRouter()
  // const params = router.params
  // const [deptId,setDeptId] = useState(params.deptId || '')
  const [list,setList] = useState([])
  useEffect(() => {
    const id = router.params.deptId
    // setDeptId(id)
    loadingService(true)
    getDoctorsByFirstDeptId({departId: id}).then(res => {
      if(res.resultCode === 0){
        setList(res.data)
        loadingService(false)
      }else{
        toastService({title: '' + res.message})
      }
    }).catch(() => {
      toastService({title: '获取数据失败'})
    })
  },[router.params.deptId])
  const handleClickDoctor = (doctor) => {
    Taro.setStorageSync('deptInfo',{
      deptId: doctor.deptId,
      deptName: doctor.deptName
    })
    Taro.navigateTo({url: `/pages/register-pack/doctor-detail/doctor-detail?doctorId=${doctor.doctorId}&regDate=`})
  }
  return (
    <View className='doctors'>
      <AtList>
        {
          list.map(doctor => 
            <AtListItem 
              key={doctor.doctorId} 
              title={doctor.doctorName} 
              arrow='right' 
              onClick={handleClickDoctor.bind(null, doctor)}
              note={doctor.title}
              thumb={doctor.imgPic || defaltAvatar}
            ></AtListItem>
            )
        }
      </AtList>
    </View>
  )
}