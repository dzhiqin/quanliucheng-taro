import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useDidShow, useRouter } from '@tarojs/taro';
import { useState } from 'react';
import { fetchDeptsOrDoctors } from '@/service/api';
import { AtSearchBar } from 'taro-ui';
import { toastService } from '@/service/toast-service';
import BkPanel from '@/components/bk-panel/bk-panel';
import BkTitle from '@/components/bk-title/bk-title';
import './search-result.less'

export default function SearchResult() {
  const router = useRouter()
  const [doctors,setDoctors] = useState([])
  const [depts,setDepts] = useState([])
  const [searchText, setSearchText] = useState(router.params.value || '')
  const getList = () => {
    fetchDeptsOrDoctors({keyword: searchText}).then(res => {
      console.log('get list',res);
      if(res.resultCode === 0){
        setDoctors(res.data.doctors)
        setDepts(res.data.departs)
      }
    })
  }
  const handleSearch = () => {
    if(!searchText){
      toastService({title: '请输入医生或科室'})
      return
    }
    getList()
  }
  useDidShow(() => {
    getList()
  })
  const onClickDept = (dept) => {
    Taro.navigateTo({url: `/pages/register-pack/doctor-list/doctor-list?deptId=${dept.deptId}&deptName=${dept.deptName}`})
  }
  const onClickDoctor = (doctor) => {
    const obj = {
      doctorId: doctor.doctorId,
      regDate: '',
      deptId: doctor.deptId,
      deptName: doctor.deptName
    }

    Taro.navigateTo({url: `/pages/register-pack/doctor-detail/doctor-detail?options=${JSON.stringify(obj)}`})
  }
  return(
    <View className='search-result'>
      <View className='search-result-bar'>
        <AtSearchBar
          placeholder='搜索科室、医生'
          actionName='搜索'
          onChange={(e) => setSearchText(e.trim())}
          onActionClick={handleSearch}
          value={searchText}
        />
      </View>
      <View className='search-result-content'>
        {
          doctors.length > 0 &&
          <View>
            <BkTitle title='医生' />
            {
              doctors.map(item => 
                <BkPanel arrow key={item.doctorId} style='margin: 20rpx 0' onClick={onClickDoctor.bind(null,item)}>
                  <View>
                    <View>
                      <text className='search-result-item-name'>{item.doctorName}</text>
                      <text className='search-result-item-title'>{item.title}</text>
                    </View>
                    <View className='search-result-item-dept'>
                      {item.deptName}
                    </View>
                  </View>
                </BkPanel>
              )
            }
          </View>
        }
        {
          depts.length > 0 &&
          <View>
            <BkTitle title='科室' />
            {
              depts.map(item => 
                <BkPanel arrow key={item.deptId} style='margin: 20rpx 0' onClick={onClickDept.bind(null,item)}>
                  <View>
                    <text className='search-result-item-name'>{item.deptName}</text>
                  </View>
                </BkPanel>
              )
            }
          </View>
        }
      </View>
    </View>
  )
}