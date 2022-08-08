import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useEffect,useState } from 'react'
import { fetchClinicDoctors, fetchClinicIntro } from '@/service/api'
import { toastService } from '@/service/toast-service'
import { AtTabs, AtAvatar } from 'taro-ui'
import defaultAvatar from '@/images/default-avatar.png'
import './clinic-intro.less'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkNone from '@/components/bk-none/bk-none'

export default function ClinicIntro() {
  const router = Taro.useRouter()
  const params = router.params
  const [current,setCurrent] = useState(0)
  const [doctorList,setDoctorList] = useState([])
  const [clinicInfo,setClinicInfo] = useState({desc: '暂无描述'})
  useEffect(() => {
    fetchClinicIntro({deptId: params.deptId}).then(res => {
      if(res.resultCode === 0){
        setClinicInfo(res.data)
        Taro.setNavigationBarTitle({title: res.data.deptName})
      }else{
        toastService({title: ''+res.message})
      }
    })
    fetchClinicDoctors({deptId: params.deptId}).then(res => {
      if(res.resultCode === 0){
        setDoctorList(res.data)
      }
    })
  }, [params.deptId])
  const onTabChange = (e) => {
    setCurrent(e)
  }
  const onClickItem = (item) => {
    Taro.navigateTo({url: `/pages/official-pack/doctor-detail/doctor-detail?deptId=${params.deptId}&doctorId=${item.doctorId}`})
  }
  return (
    <View className='clinic-intro'>
      <AtTabs current={current} tabList={[{title: '专家列表'},{title: '科室介绍'}]} onClick={onTabChange}></AtTabs>
      {
        current === 1 &&
        <View className='clinic-intro-content'>
          {clinicInfo.desc ? clinicInfo.desc : '暂无科室介绍，完善中……'}
        </View>
      }
      {
        current === 0 &&
        <View>
          {
            doctorList.length > 0
            ?
            <View className='clinic-intro-doctors'>
              {
                doctorList.map((item,index) => 
                  <BkPanel arrow key={index} style='margin-top: 20rpx;border-radius: unset;' onClick={onClickItem.bind(null, item)} >
                    <View style='display:flex'>
                      <AtAvatar image={item.faceUrl || defaultAvatar} size='large' circle customStyle='flex-shrink: 0;'></AtAvatar>
                      <View style='margin-left: 20rpx;'>
                        <View className='clinic-intro-doctors-name'>{item.name}</View>
                        <View className='clinic-intro-doctors-title'>{item.title}</View>
                        <View className='clinic-intro-doctors-specialty ellipsis-text'>{item.specialty}</View>
                      </View>
                    </View>
                  </BkPanel>
                )
              }
            </View>
            :
            <BkNone msg='暂无医生信息' />
          }
        </View>
      }
    </View>
  )
}