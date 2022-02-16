// import { getBranchId, getRegType } from "@/utils/tools";
import { fullUrl, Post } from "../http";

export const fetchPaymentList = (data:{cardId: string | number, listDays?: 30}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetHisOrderList'),data)
}
export const fetchPaymentFee = (data:{cardNo: string, clinicNo: string, recipeSeq: string, pactCode: string, patientId: string, payType: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillMoney',data))
}
export const fetchPaymentDetail = (data:{cardNo: string, clinicNo: string, recipeSeq: string, patientId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetOrderDetail'),data)
}
export interface PayOrderParams {
    "patientId": string,
    "clinicNo": string,
    "recipeSeq": string,
    "orderType": string,
    "prescFee": string,
    "orderDept": string,
    "orderDoctor": string,
    "orderDate": string,
    "payType": string,
}
export const createPaymentOrder = (data: PayOrderParams) => {
  return Post(fullUrl('api/applet/paybill/Bill/CreateBillOrder'),data)
}
export const handlePayment = (data: {orderId: string, payType: string}) => {
  return Post(fullUrl(`api/applet/paybill/Bill/PayBill?orderId=${data.orderId}&payType=${data.payType}`),data)
}
export const cancelPayment = (data: {orderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/CancelPay'),data)
}
export const handleRefund = (data: {orderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/Refund'),data)
}
export const fetchPaymentOrderList = (data) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillOrderRecord?type=' + data.type),data)
}
export const fetchPaymentOrderDetail = (data: {billOrderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillOrderItem'),data)
}
export const fetchPaymentOrderStatus = (data: {orderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillStatus?orderId=' + data.orderId),data)
}
// export const fetchGuideList = (data: {orderId: string}) => {
//   return Post(fullUrl('api/applet/paybill/Bill/GetGuideList'),data)
// }
export const fetchMedicineInfo = (data: {orderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetDrugStateInfo'),data)
}
export const fetchPaymentInvoice = (data: {serialNo: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillInvoiceInfo'),data)
}
export const fetchPaymentOrderDetailByQRCode = (data: {preQRCodePayId: number}) => {
  return Post(fullUrl('subApi/api/customize/applet/Bill/GetPrescriptionQRCodeInfo'),data)
}
// export const fetchPaymentOrderDetailByQRCode = (data: {clinicNo:string,cardNo:string,patientId: string}) => {
//   return Post(fullUrl('api/applet/paybill/Bill/GetPrescriptionQRCodeInfo'),data)
// }
export const fetchPaymentOrderInvoice = (data: {serialNo: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillInvoiceInfo'))
}
export const handleHeSuanRefund = (data:{orderId: string}) => {
  return Post(fullUrl('subApi/api/customize/applet/HeSuan/HeSuanRefund'),data)
}