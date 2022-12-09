import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState,useEffect } from 'react'
import { loadingService, modalService } from '@/service/toast-service'
import { getDoctorsByFirstDeptId } from '@/service/api'
import { AtList, AtListItem } from 'taro-ui'
import './doctors.less'
import { getImageSrc } from '@/utils/image-src'

export default function Doctors() {
  const router = Taro.useRouter()
  const [list,setList] = useState([])
  useEffect(() => {
    const id = router.params.deptId
    loadingService(true)
    getDoctorsByFirstDeptId({departId: id}).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        modalService({content: res.message})
      }
    }).catch((err) => {
      loadingService(false)
      modalService({title: '获取数据失败',content: JSON.stringify(err)})
    })
  },[router.params.deptId])
  const handleClickDoctor = (doctor) => {
    Taro.navigateTo({url: `/pages/register-pack/doctor-detail/doctor-detail?deptId=${doctor.deptId}&deptName=${doctor.deptName}doctorId=${doctor.doctorId}&regDate=`})
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
              thumb={doctor.imgPic || getImageSrc('default-avatar.png')}
            ></AtListItem>
            )
        }
      </AtList>
    </View>
  )
}