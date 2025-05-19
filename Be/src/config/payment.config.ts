import dotenv from 'dotenv';
import { createHmac } from 'crypto';
import { VNPay, ignoreLogger, HashAlgorithm } from 'vnpay';
dotenv.config();

export const vnpay = new VNPay({
  tmnCode: '7QVSD49C',
  secureSecret: 'D69QFHHU45CHY6QFIXY8F62ECVL6YNOT',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: HashAlgorithm.SHA512,
  enableLog: true,
  loggerFn: ignoreLogger,
  endpoints: {
    paymentEndpoint: 'paymentv2/vpcpay.html',
    queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
  }
});

export const momoConfig = {
  partnerCode: process.env.MOMO_PARTNER_CODE || "MOMO",
  accessKey: process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85",
  secretkey: process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
  momo_ReturnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:5000/api/payment/momo_return',
  notifyUrl: process.env.MOMO_NOTIFY_URL || 'http://localhost:5000/api/payment/momo-notify',
  frontendReturnUrl: process.env.FRONTEND_URL || 'http://localhost:3000/payment/momo_return'
}
