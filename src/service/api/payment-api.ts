// import { getBranchId, getRegType } from "@/utils/tools";
import { fullUrl, Post } from "../http";

export const fetchPaymentListFromHis = (data:{cardId: string | number, listDays?: 30}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetHisOrderList'),data)
}
export const fetchPaymentFee = (data:{cardNo: string, clinicNo: string, recipeSeq: string, pactCode: string, patientId: string, payType: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillMoney',data))
}
export const fetchPaymentDetailFromHis = (data:{cardNo: string, clinicNo: string, recipeSeq: string, patientId: string}) => {
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
    "payAuthCode"?: string,
    "longiLatitude"?: string
}
export const createPaymentOrder = (data: PayOrderParams) => {
  return Post(fullUrl('api/applet/paybill/Bill/CreateBillOrder'),data)
}
export const handlePayment = (data: {orderId: string, payType: string | number}) => {
  return Post(fullUrl(`api/applet/paybill/Bill/PayBill?orderId=${data.orderId}&payType=${data.payType}`),data)
}
export const cancelPayment = (data: {orderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/CancelPay'),data)
}
export const handleBillOrderRefund = (data: {orderId: string,payAuthCode?: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/Refund'),data)
}
export const fetchPaymentOrderList = (data) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillOrderRecord?type=' + data.type),data)
}
export const fetchPaymentOrderDetail = (data: {billOrderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillOrderItem?billOrderId=' + data.billOrderId),data)
}
export const fetchPaymentOrderStatus = (data: {orderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillStatus?orderId=' + data.orderId),data)
}
export const fetchMedicineGuideList = (data: {orderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetGuideList',data),data)
}
export const fetchMedicineInfo = (data: {orderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetDrugStateInfo'),data)
}
export const fetchPaymentInvoice = (data: {serialNo: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillInvoiceInfo'),data)
}
export const fetchPaymentOrderDetailByQRCode = (data: {preQRCodePayId: number,payAuthCode?:string}) => {
  return Post(fullUrl('api/customize/applet/Bill/GetPrescriptionQRCodeInfo'),data)
}
export const createPaymentOrderByQRCode = (data) => {
  return Post(fullUrl('api/customize/applet/Bill/SavePrescriptionQRCodeBill'),data)
}
// export const fetchPaymentOrderDetailByQRCode = (data: {clinicNo:string,cardNo:string,patientId: string}) => {
//   return Post(fullUrl('api/applet/paybill/Bill/GetPrescriptionQRCodeInfo'),data)
// }
export const fetchPaymentOrderInvoice = (data: {serialNo: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetBillInvoiceInfo'),data)
}
export const handleHeSuanRefund = (data:{orderId: string}) => {
  return Post(fullUrl('api/customize/applet/HeSuan/HeSuanRefund'),data)
}
export const fetchBillOrderInfo = (data: {orderId}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetPaymentDetails',data))
}
export const individualAccountEnable = (data) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetCharges'),data)
}