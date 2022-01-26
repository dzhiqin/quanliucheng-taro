import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { fetchDoctorSchedules, fetchTimeListByDate } from '@/service/api'
import { useEffect, useState } from 'react'
import { useRouter } from '@tarojs/taro'
import { loadingService, toastService } from '@/service/toast-service'
import ScheduleDays from '@/components/schedule-days/schedule-days'
import { AtList, AtListItem } from "taro-ui"
import BkNone from '@/components/bk-none/bk-none'
import './doctor-detail.less'
import cardsHealper from '@/utils/cards-healper'

export default function DoctorDefault(props) {
  const router = useRouter()
  const params = router.params
  const [regDays,setRegDays] = useState([])
  const deptInfo = Taro.getStorageSync('deptInfo')
  const [selectedDate,setSelectedDate] = useState(params.regDate || '')
  const [list,setList] = useState([])
  const [doctorDetail,setDoctorDetail] = useState({
    deptId: '',
    deptName: '',
    faceUrl: '',
    name: '',
    title: '',
    specialty:'',
    doctorId: '',
    doctorName: ''
  })
  const [doctorInfo,setDoctorInfo] = useState({
    sourceType: '',
    regType:'',
    regFee: '',
    address: '',
    regTypeId:'',
    specializedSubject:''
  })
  const onClickItem = (item) => {
    const hospitalInfo = Taro.getStorageSync('hospitalInfo')
    const userInfo = Taro.getStorageSync('userInfo')
    const card = cardsHealper.getDefault()
    if(!card) return
    if(item.leaveCount > 0){
      const orderParams = {
        cardNo: card.cardNo,
        hospitalId: userInfo.hospitalId,
        branchId: hospitalInfo.branchId,
        patientId: card.patientId,
        patientName: card.name,
        deptId: deptInfo.deptId, 
        deptName: deptInfo.deptName,
        doctorId: doctorDetail.doctorId,
        doctorName: doctorDetail.name || doctorDetail.doctorName,
        regDate: selectedDate,
        scheduleId: item.scheduleId,
        timeSlice: item.startTime.split(':')[0] > 12 ? '下午' : '上午',
        sliceId: item.sliceId,
        sqNo: item.sqNo,
        startTime: item.startTime,
        endTime: item.endTime,
        sourceType: doctorInfo.sourceType,
        sourceId: doctorInfo.regType,
        regNo: '',
        feeType: '0',   // 对应feeCode字段
        regFee: doctorInfo.regFee,
        treatFee: '',
        address: doctorInfo.address,
        regTypeId: doctorInfo.regTypeId
      }
      Taro.setStorageSync('orderParams',orderParams)
      // console.log('orderparams:',Taro.getStorageSync('orderParams'));
      Taro.navigateTo({url: '/pages/register-pack/order-create/order-create'})
    }else{
      toastService({title: '没号了~请重新选择'})
    }
  } 
  const onDateChange = (date) => {
    if(!date) return
    setSelectedDate(date)
    Taro.showLoading({title: '加载中……'})
    fetchTimeListByDate({deptId: deptInfo.deptId, regDate: date, doctorId: doctorDetail.doctorId}).then(res => {
      if(res.resultCode === 0){
        setList(res.data.timePoints)
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }
  useEffect(() => {
    loadingService(true)
    fetchDoctorSchedules({
      doctorId: params.doctorId, 
      deptId: deptInfo.deptId, 
      regDate: params.regDate || '' 
    }).then((res:any) => {
      if(res.resultCode === 0){
        if(res.data.defaultSelectedDay === '无剩余号源'){
          let msg = '无剩余号源，页面将返回'
          if(Taro.getStorageSync('isReg') === '1'){
            msg = '当天没号了，请选择其他日期'
          }
          toastService({title: msg,onClose: () => {Taro.navigateBack()}})
        }else{
          loadingService(false)
          setDoctorDetail(res.data.doctorDetail)
          setDoctorInfo(res.data.timeSliceDoctorInfo)
          setSelectedDate(res.data.defaultSelectedDay)
          setList(res.data.timePoints)
          setRegDays(res.data.regDays)
        }
      }else{
        toastService({title: '获取数据失败：'+res.message})
      }
    })
  }, [deptInfo.deptId,params.doctorId,params.regDate])
  return(
    <View className='doctor-detail'>
      <View className='doctor-detail-info'>
          <Image src={doctorDetail.faceUrl} className='avatar' />
        <View style='margin-left: 20rpx;'>
          <View>
            <text className='doctor-detail-name'>{doctorDetail.name}</text>
            <text className='doctor-detail-title'>{doctorDetail.deptName}</text>
            <text className='doctor-detail-title'>{doctorDetail.title}</text>
          </View>
          {
            doctorDetail.specialty && 
            <View className='doctor-detail-skilled'>
              擅长领域：{doctorInfo.specializedSubject}
            </View>
          }
          
        </View>
      </View>
      <View className='doctor-detail-date'>已选：<text className='price-color'>{selectedDate}</text></View>
      <View className='doctor-detail-days'>
        <ScheduleDays days={regDays} defaultDay={selectedDate} onChange={onDateChange} showMonth />
      </View>
      <View className='doctor-detail-list'>
        {
          list.length > 0
          ? <AtList>
              {
                list.map((item,index) => 
                  <AtListItem 
                    key={index} 
                    title={`${item.startTime} - ${item.endTime}`} 
                    extraText={item.leaveCount > 0 ? '剩余:'+item.leaveCount : '无号'} 
                    className={item.leaveCount > 0 ? 'ticket-btn-active' : 'ticket-btn-unactive'} 
                    arrow='right' 
                    onClick={onClickItem.bind(null,item)}
                  />
                )
              }
            </AtList>
          : <BkNone />
        }
      </View>
    </View>
  )
}