import { Request, Response } from 'express';
import axios from 'axios'; // Sử dụng axios để gửi yêu cầu HTTP
import { createHmac } from 'crypto';
import { vnpay, momoConfig } from '../config/payment.config';
import { Order } from '../models/order.model';
import qs from 'querystring';
import { ProductCode, VnpLocale } from 'vnpay';

interface MoMoResponse {
    payUrl: string;
}

// Thanh toán bằng VNPay
export const payWithVNPay = async (req: Request, res: Response) => {
    try {
        const { amount, orderId } = req.body;
        if (!orderId) return res.status(400).json({ message: 'Vui lòng cung cấp mã đơn hàng' });
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        // Sinh vnp_TxnRef từ orderId (có thể thêm timestamp nếu cần)
        const vnp_TxnRef = orderId + '-' + Date.now();
        order.vnp_TxnRef = vnp_TxnRef;
        await order.save();
        const date = new Date();
        const createDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
        // Thêm 15 phút cho thời gian hết hạn
        const expireDateObj = new Date(date.getTime() + 15 * 60 * 1000);
        const expireDate = `${expireDateObj.getFullYear()}${(expireDateObj.getMonth() + 1).toString().padStart(2, '0')}${expireDateObj.getDate().toString().padStart(2, '0')}${expireDateObj.getHours().toString().padStart(2, '0')}${expireDateObj.getMinutes().toString().padStart(2, '0')}${expireDateObj.getSeconds().toString().padStart(2, '0')}`;
        // Tạo URL thanh toán bằng thư viện VNPay
        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: Number(amount),
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_TxnRef: vnp_TxnRef,
            vnp_OrderInfo: 'Thanh toán đơn hàng',
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: process.env.VNP_RETURN_URL || 'http://localhost:3000/payment/vnpay_return',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: parseInt(createDate),
            vnp_ExpireDate: parseInt(expireDate),
        });
        return res.status(201).json({ paymentUrl });
    } catch (error) {
        console.error('VNPay payment error:', error);
        res.status(500).json({ message: 'Lỗi khi thanh toán bằng VNPay', error });
    }
};

// Xử lý callback/return từ VNPay
export const handleVNPayReturn = async (req: Request, res: Response) => {
    try {
        const vnp_Params = { ...req.query };
        // Chuẩn hóa 2 trường bắt buộc về string
        const vnp_TxnRef = Array.isArray(vnp_Params['vnp_TxnRef']) ? String(vnp_Params['vnp_TxnRef'][0]) : String(vnp_Params['vnp_TxnRef'] ?? '');
        const vnp_OrderInfo = Array.isArray(vnp_Params['vnp_OrderInfo']) ? String(vnp_Params['vnp_OrderInfo'][0]) : String(vnp_Params['vnp_OrderInfo'] ?? '');
        const verifyParams = {
          ...vnp_Params,
          vnp_TxnRef,
          vnp_OrderInfo,
        } as any;
        // Xác thực callback bằng thư viện VNPay
        const isValid = vnpay.verifyReturnUrl(verifyParams);
        if (!isValid) {
            return res.status(400).json({ message: 'Chữ ký không hợp lệ!' });
        }
        // Tìm đơn hàng theo vnp_TxnRef
        const order = await Order.findOne({ vnp_TxnRef });
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        // Kiểm tra kết quả giao dịch
        if (vnp_Params['vnp_ResponseCode'] === '00') {
            order.paymentStatus = 'PAID';
            order.orderStatus = 'PROCESSING'; // Đơn hàng đã thanh toán, chờ xử lý
            await order.save();
            // Redirect về FE hoặc trả JSON
            return res.redirect(`${process.env.VNP_RETURN_URL || 'http://localhost:3000/payment/vnpay_return'}?status=success&orderId=${order._id}`);
        } else {
            order.paymentStatus = 'FAILED';
            await order.save();
            return res.redirect(`${process.env.VNP_RETURN_URL || 'http://localhost:3000/payment/vnpay_return'}?status=fail&orderId=${order._id}`);
        }
    } catch (error) {
        console.error('Lỗi xử lý callback VNPay:', error);
        res.status(500).json({ message: 'Lỗi khi xử lý callback VNPay', error });
    }
};

// Thanh toán bằng MoMo
export const payWithMoMo = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;
        const requestId = Date.now().toString();
        const orderId = requestId;
        
        const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=&ipnUrl=${momoConfig.notifyUrl}&orderId=${orderId}&orderInfo=Thanh toán đơn hàng&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.momo_ReturnUrl}&requestId=${requestId}&requestType=captureWallet`;
        
        const signature = createHmac('sha256', momoConfig.secretkey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: momoConfig.partnerCode,
            accessKey: momoConfig.accessKey,
            requestId: requestId,
            amount: amount.toString(),
            orderId: orderId,
            orderInfo: 'Thanh toán đơn hàng',
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
        console.error('Lỗi thanh toán MoMo:', error);
        res.status(500).json({ message: 'Lỗi khi thanh toán bằng MoMo', error });
    }
};

// Xử lý callback/return từ MoMo
export const handleMoMoReturn = async (req: Request, res: Response) => {
    try {        
        const { 
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            signature
        } = req.query;

      

        // Tìm đơn hàng theo orderId
        const order = await Order.findById(orderId);
      
        if (!order) {
            console.log('Order not found with ID:', orderId);
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Kiểm tra kết quả giao dịch
        if (resultCode === '0') {
            // Thanh toán thành công
            order.paymentStatus = 'PAID';
            order.orderStatus = 'PROCESSING'; // Đơn hàng đã thanh toán, chờ xử lý
            await order.save();
            console.log('Order updated successfully:', {
                _id: order._id,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus
            });
            return res.redirect(`${process.env.MOMO_RETURN_URL || 'http://localhost:3000/payment/momo_return'}?status=success&orderId=${order._id}`);
        } else {
            // Thanh toán thất bại
            order.paymentStatus = 'FAILED';
            await order.save();
            console.log('Order marked as failed:', {
                _id: order._id,
                paymentStatus: order.paymentStatus
            });
            return res.redirect(`${process.env.MOMO_RETURN_URL || 'http://localhost:3000/payment/momo_return'}?status=fail&orderId=${order._id}`);
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xử lý callback MoMo', error });
    }
}; 