import dotenv from 'dotenv';
dotenv.config();

export const vnpayConfig = {
  vnp_TmnCode: process.env.VNP_TMN_CODE || "GSO664Y1",
  vnp_HashSecret: process.env.VNP_HASH_SECRET || "YSIBZM6K3QPWR2GXB5UF6QPSBT5BQRP5",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: process.env.VNP_RETURN_URL || 'http://localhost:3000/payment/vnpay_return'
}

export const momoConfig = {
  partnerCode: process.env.MOMO_PARTNER_CODE || "MOMO",
  accessKey: process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85",
  secretkey: process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
  momo_ReturnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3000/payment/momo_return',
  notifyUrl: process.env.MOMO_NOTIFY_URL || 'http://localhost:5000/api/payment/momo-notify'
}
