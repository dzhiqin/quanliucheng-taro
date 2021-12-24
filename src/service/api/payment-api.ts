// import { getBranchId, getRegType } from "@/utils/tools";
import { fullUrl, Post } from "../http";

export const fetchPaymentList = (data:{cardId: string | number, listDays?: 30}) => {
  return Post(fullUrl('Bill/GetHisOrderList'),data)
}
export const fetchPaymentFee = (data:{cardNo: string, clinicNo: string, recipeSeq: string, pactCode: string, patientId: string, payType: string}) => {
  return Post(fullUrl('Bill/GetBillMoney',data))
}
export const fetchPaymentDetail = (data:{cardNo: string, clinicNo: string, recipeSeq: string, patientId: string}) => {
  return Post(fullUrl('Bill/GetOrderDetail'),data)
}
interface payOrderParams {
    "patientId": "string",
    "clinicNo": "string",
    "recipeSeq": "string",
    "orderType": "string",
    "prescFee": "string",
    "orderDept": "string",
    "orderDoctor": "string",
    "orderDate": "string",
    "payType": "string"
}
export const createPaymentOrder = (data: payOrderParams) => {
  return Post(fullUrl('Bill/CreateBillOrder'),data)
}
export const handlePayment = (data: {orderId: string, payType: string}) => {
  return Post(fullUrl(`Bill/PayBill?orderId=${data.orderId}&payType=${data.payType}`),data)
}
export const cancelPayment = (data: {orderId: string}) => {
  return Post(fullUrl('Bill/CancelPay'),data)
}
export const handleRefund = (data: {orderId: string}) => {
  return Post(fullUrl('Bill/Refund'),data)
}
export const fetchPaymentOrderList = () => {
  return Post(fullUrl('Bill/GetBillOrderRecord'))
}
export const fetchPaymentOrderDetail = (data: {billOrderId: string}) => {
  return Post(fullUrl('Bill/GetBillOrderItem'),data)
}
export const fetchPaymentOrderStatus = (data: {orderId: string}) => {
  return Post(fullUrl('Bill/GetBillOrderStatus'),data)
}
export const fetchGuideList = (data: {orderId: string}) => {
  return Post(fullUrl('Bill/GetGuideList'),data)
}
export const fetchMedicineInfo = (data: {orderId: string}) => {
  return Post(fullUrl('Bill/GetDrugStateInfo'),data)
}
export const fetchPaymentInvoice = (data: {serialNo: string}) => {
  return Post(fullUrl('Bill/GetBillInvoiceInfo'),data)
}