import { Request, Response } from 'express';
import axios from 'axios'; // Sử dụng axios để gửi yêu cầu HTTP
import { createHmac } from 'crypto';
import { vnpayConfig, momoConfig } from '../config/payment.config';
import { Order } from '../models/order.model';
import qs from 'querystring';

interface MoMoResponse {
    payUrl: string;
}

// Thanh toán bằng VNPay
export const payWithVNPay = async (req: Request, res: Response) => {
    try {
        const { amount, orderId } = req.body;
        if (!orderId) return res.status(400).json({ message: 'Thiếu orderId' });
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        // Sinh vnp_TxnRef từ orderId (có thể thêm timestamp nếu cần)
        const vnp_TxnRef = orderId + '-' + Date.now();
        order.vnp_TxnRef = vnp_TxnRef;
        await order.save();
        const date = new Date();
        const createDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
        const params: { [key: string]: any } = {
            vnp_Version: '2.0.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Amount: amount * 100,
            vnp_CurrCode: 'VND',
            vnp_BankCode: 'NCB',
            vnp_CreateDate: createDate,
            vnp_TxnRef,
            vnp_OrderInfo: 'Thanh toan don hang',
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_Locale: 'vn'
        };

        // Sắp xếp các tham số theo thứ tự a-z
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((acc: { [key: string]: any }, key) => {
                acc[key] = params[key];
                return acc;
            }, {});

        // Tạo chuỗi query và chữ ký
        const queryString = Object.entries(sortedParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const signData = vnpayConfig.vnp_HashSecret + queryString;
        const hmac = createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        const finalUrl = `${vnpayConfig.vnp_Url}?${queryString}&vnp_SecureHash=${signed}`;
        res.json({ paymentUrl: finalUrl });
    } catch (error) {
        console.error('VNPay payment error:', error);
        res.status(500).json({ message: 'Lỗi khi thanh toán bằng VNPay', error });
    }
};

// Xử lý callback/return từ VNPay
export const handleVNPayReturn = async (req: Request, res: Response) => {
    try {
        const vnp_Params = { ...req.query };
        const vnp_SecureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        // Tạo chuỗi dữ liệu để xác thực chữ ký
        const sortedParams = Object.keys(vnp_Params).sort().reduce((acc: any, key) => {
            acc[key] = vnp_Params[key];
            return acc;
        }, {});
        const signData = Object.entries(sortedParams).map(([key, value]) => `${key}=${value}`).join('&');
        const hmac = createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        if (signed !== vnp_SecureHash) {
            return res.status(400).json({ message: 'Chữ ký không hợp lệ!' });
        }
        // Tìm đơn hàng theo vnp_TxnRef
        const vnp_TxnRef = vnp_Params['vnp_TxnRef'];
        const order = await Order.findOne({ vnp_TxnRef });
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        // Kiểm tra kết quả giao dịch
        if (vnp_Params['vnp_ResponseCode'] === '00') {
            order.paymentStatus = 'PAID';
            order.orderStatus = 'PROCESSING'; // Đơn hàng đã thanh toán, chờ xử lý
            await order.save();
            // Redirect về FE hoặc trả JSON
            return res.redirect(`${vnpayConfig.vnp_ReturnUrl}?status=success&orderId=${order._id}`);
        } else {
            order.paymentStatus = 'FAILED';
            await order.save();
            return res.redirect(`${vnpayConfig.vnp_ReturnUrl}?status=fail&orderId=${order._id}`);
        }
    } catch (error) {
        console.error('VNPay return error:', error);
        res.status(500).json({ message: 'Lỗi khi xử lý callback VNPay', error });
    }
};

// Thanh toán bằng MoMo
export const payWithMoMo = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;
        const requestId = Date.now().toString();
        const orderId = requestId;
        
        const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=&ipnUrl=${momoConfig.notifyUrl}&orderId=${orderId}&orderInfo=Thanh toan don hang&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.momo_ReturnUrl}&requestId=${requestId}&requestType=captureWallet`;
        
        const signature = createHmac('sha256', momoConfig.secretkey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: momoConfig.partnerCode,
            accessKey: momoConfig.accessKey,
            requestId: requestId,
            amount: amount.toString(),
            orderId: orderId,
            orderInfo: 'Thanh toan don hang',
            redirectUrl: momoConfig.momo_ReturnUrl,
            ipnUrl: momoConfig.notifyUrl,
            extraData: '',
            requestType: 'captureWallet',
            signature: signature,
            lang: 'vi'
        };

        const response = await axios.post(momoConfig.endpoint, requestBody);
        const responseData = response.data as MoMoResponse;
        res.json({ paymentUrl: responseData.payUrl });
    } catch (error) {
        console.error('MoMo payment error:', error);
        res.status(500).json({ message: 'Lỗi khi thanh toán bằng MoMo', error });
    }
}; 