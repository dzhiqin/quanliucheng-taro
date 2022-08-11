import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { fetchDoctorSchedules, fetchTimeListByDate, fetchDoctorDetail } from '@/service/api'
import { useEffect, useState } from 'react'
import { useRouter } from '@tarojs/taro'
import { loadingService, toastService } from '@/service/toast-service'
import ScheduleDays from '@/components/schedule-days/schedule-days'
import { AtList, AtListItem } from "taro-ui"
import BkNone from '@/components/bk-none/bk-none'
import './doctor-detail.less'
import { CardsHealper } from '@/utils/cards-healper'
import BaseModal from '@/components/base-modal/base-modal'
import defaultDoctorAvatar from '@/images/default-avatar.png'

export default function DoctorDefault(props) {
  const router = useRouter()
  const params = router.params
  const [regDays,setRegDays] = useState([])
  const deptInfo = Taro.getStorageSync('deptInfo')
  const [selectedDate,setSelectedDate] = useState(params.regDate || '')
  const [list,setList] = useState([])
  const [busy,setBusy] = useState(true)
  const [show,setShow] = useState(false)
  const [doctorDetail,setDoctorDetail] = useState({
    deptName: '',
    faceUrl: '',
    name: '',
    title: '',
    specialty:'',
    doctorId: '',
    doctorName: '',
    desc: ''
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
    const card = CardsHealper.getDefault()
    if(!card) {
      toastService({title: '找不到就诊卡'})
      return
    }
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
    setBusy(true)
    fetchDoctorSchedules({
      doctorId: params.doctorId, 
      deptId: deptInfo.deptId, 
      regDate: params.regDate || '' 
    }).then((res:any) => {
      if(res.resultCode === 0){
        if(res.data.doctorDetail){
          setDoctorDetail(res.data.doctorDetail)
        }
        setDoctorInfo(res.data.timeSliceDoctorInfo)
        setRegDays(res.data.regDays)
        setSelectedDate(res.data.defaultSelectedDay)

        if(res.data.defaultSelectedDay === '无剩余号源'){
          let msg = '无剩余号源，请返回页面重新选择'
          if(Taro.getStorageSync('isReg') === '1'){
            msg = '当天没号了，请选择其他日期'
          }
          // toastService({title: msg,onClose: () => {Taro.navigateBack()}})
          toastService({title: msg})
          setBusy(false)
        }else{
          setList(res.data.timePoints)
          setTimeout(() => {
            loadingService(false)
            setBusy(false)
          }, 500);
        }
      }else{
        toastService({title: '获取数据失败：'+res.message})
        setBusy(false)
      }
    })
  }, [deptInfo.deptId,params.doctorId,params.regDate])
  useEffect(() => {
    fetchDoctorDetail({deptId: deptInfo.deptId, doctorId: params.doctorId}).then(res => {
      if(res.resultCode === 0 && res.data){
        setDoctorDetail(res.data)
      }
    })
  },[deptInfo.deptId,params.doctorId])
  return(
    <View className='doctor-detail'>
      <BaseModal show={show} cancel={() => setShow(false)} confirm={() => setShow(false)} title='医生详情'>
        <View className='flex'>
          <Image src={doctorDetail.faceUrl || defaultDoctorAvatar} className='doctor-modal-image' />
          <View style='margin-left: 10rpx;'>
            <View className='doctor-detail-name'>{doctorDetail.name}</View>
            <View>{doctorDetail.deptName}</View>
            <View>{doctorDetail.title}</View>
          </View>
        </View>
        <View>
          {
            doctorDetail.desc && 
            <View className='doctor-modal-info'>
              <text className='doctor-modal-info-title'>简介：</text>
              {doctorDetail.desc.replace(/<br>|<Br>/g, ' ')}
            </View>
          }
          {
            doctorDetail.specialty && 
            <View className='doctor-modal-info'>
              <text className='doctor-modal-info-title'>擅长领域：</text>
              {doctorDetail.specialty.replace(/<br>|<Br>/g, ' ')}
            </View>
          }
        </View>
      </BaseModal>
      <View className='doctor-detail-info' onClick={() => setShow(true)}>
          <Image src={doctorDetail.faceUrl || defaultDoctorAvatar} className='doctor-detail-info-avatar' />
        <View style='margin-left: 20rpx;'>
          <View>
            <text className='doctor-detail-name'>{doctorDetail.name}</text>
            <text className='doctor-detail-title'>{doctorDetail.deptName}</text>
            <text className='doctor-detail-title'>{doctorDetail.title}</text>
          </View>
          {
            doctorDetail.desc && 
            <View className='doctor-detail-skilled'>
              简介：{doctorDetail.desc.replace(/<br>|<Br>/g, ' ')}
            </View>
          }
          {
            doctorDetail.specialty && 
            <View className='doctor-detail-skilled'>
              擅长领域：{doctorDetail.specialty.replace(/<br>|<Br>/g, ' ')}
            </View>
          }
          
        </View>
      </View>
      <View className='doctor-detail-date'>已选：<text className='price-color'>{selectedDate}</text></View>
      <View className='doctor-detail-days'>
        <ScheduleDays days={regDays} defaultDay={selectedDate} onChange={onDateChange} />
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
          : <BkNone loading={busy} msg='暂无排班信息' />
        }
      </View>
    </View>
  )
}