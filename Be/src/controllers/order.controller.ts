import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { payWithVNPay, payWithMoMo } from './payment.controller'; // Import các hàm thanh toán
import { User } from '../models/user.model';
import { sendOrderConfirmationEmail } from '../utils/sendEmail';

interface AuthRequest extends Request {
    user?: any;
}

// Tạo đơn hàng mới
export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const { 
            shippingAddress, // Có thể là địa chỉ mới hoặc index của địa chỉ đã lưu
            paymentMethod,
            useSavedAddress, // Boolean: true nếu dùng địa chỉ đã lưu
            savedAddressIndex // Index của địa chỉ đã lưu nếu useSavedAddress = true
        } = req.body;

        // Kiểm tra phương thức thanh toán hợp lệ
        const validPaymentMethods = ['VNPay', 'MoMo', 'COD'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ 
                message: 'Phương thức thanh toán không hợp lệ. Vui lòng chọn một trong các phương thức: VNPay, MoMo, hoặc Thanh toán khi nhận hàng' 
            });
        }
        // Lấy giỏ hàng của người dùng
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }

        // Xử lý địa chỉ giao hàng
        let finalShippingAddress;
        if (useSavedAddress) {
            // Lấy địa chỉ đã lưu từ user
            const user = await User.findById(userId);
            if (!user || !user.addresses || user.addresses.length === 0) {
                return res.status(400).json({ message: 'Không tìm thấy địa chỉ đã lưu' });
            }
            // Tìm địa chỉ mặc định (có isDefault: true)
            const defaultAddress = user.addresses.find(addr => addr.isDefault === true);
            if (!defaultAddress) {
                return res.status(400).json({ message: 'Không tìm thấy địa chỉ mặc định' });
            }
            finalShippingAddress = {
                ...defaultAddress,
                isNewAddress: false
            };
        } else {
            // Kiểm tra địa chỉ mới
            if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || 
                !shippingAddress.addressLine || !shippingAddress.ward || 
                !shippingAddress.district || !shippingAddress.province) {
                return res.status(400).json({ 
                    message: 'Vui lòng điền đầy đủ thông tin địa chỉ giao hàng' 
                });
            }
            finalShippingAddress = {
                ...shippingAddress,
                isNewAddress: true
            };
        }

        // Kiểm tra số lượng tồn kho
        for (const item of cart.items) {
            const product = item.product as any;
            if (!product.isAvailable || product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Sản phẩm ${product.name} không đủ số lượng`
                });
            }
        }

        // Tạo đơn hàng
        const order = await Order.create({
            user: userId,
            items: cart.items,
            totalAmount: cart.totalAmount,
            shippingAddress: finalShippingAddress,
            paymentMethod,
            status: paymentMethod === 'COD' ? 'pending' : 'processing',
            paymentStatus: paymentMethod === 'MoMo' ? 'PAID' : 'FAILED'
        });

        // Cập nhật số lượng tồn kho và số lượng đã bán
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                product.sold += item.quantity;
                await product.save();
            }
        }

        // Xóa giỏ hàng
        await Cart.findByIdAndDelete(cart._id);

        // Gửi email xác nhận đơn hàng
        try {
            const user = await User.findById(userId);
            if (user) {
                await sendOrderConfirmationEmail(order, user.email, user.fullName);
            }
        } catch (emailError) {
            console.error('Lỗi khi gửi email xác nhận:', emailError);
            // Không trả về lỗi cho client nếu gửi email thất bại
        }

        // Xử lý thanh toán dựa trên phương thức
        switch (paymentMethod) {
            case 'VNPay':
                req.body.orderId = order._id;
                req.body.amount = order.totalAmount;
                return payWithVNPay(req, res);
            
            case 'MoMo':
                req.body.amount = order.totalAmount;
                return payWithMoMo(req, res);
            
            case 'COD':
                res.status(201).json({
                    message: 'Đặt hàng thành công. Vui lòng kiểm tra email để xem chi tiết đơn hàng.',
                    order
                });
                break;
            
            default:
                res.status(201).json({
                    message: 'Đặt hàng thành công. Vui lòng kiểm tra email để xem chi tiết đơn hàng.',
                    order
                });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error });
    }
};

// Admin: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        let voucherDetail = null;
        order.orderStatus = orderStatus;
        if (orderStatus === 'DELIVERED') {
            order.paymentStatus = 'PAID';

            // Cập nhật tổng chi tiêu, VIP cho user
            const user = await User.findById(order.user);
            if (user) {
                // Cộng tổng chi tiêu
                user.totalSpent = (user.totalSpent || 0) + order.totalAmount;

                // Xác định VIP
                let vipLevel = 1;
                let vipRank: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim cương' = 'Đồng';
                if (user.totalSpent >= 10000000) {
                    vipLevel = 4; vipRank = 'Kim cương';
                } else if (user.totalSpent >= 5000000) {
                    vipLevel = 3; vipRank = 'Vàng';
                } else if (user.totalSpent >= 2000000) {
                    vipLevel = 2; vipRank = 'Bạc';
                }
                user.vipLevel = vipLevel;
                user.vipRank = vipRank;

                // Áp dụng voucher nếu có
                let appliedVoucher = null;
                if (user.vouchers && user.vouchers.length > 0) {
                    // Ưu tiên free_shipping trước, sau đó discount
                    appliedVoucher = user.vouchers.find(v => v.status === 'active' && (!v.expiredAt || v.expiredAt > new Date()));
                    if (appliedVoucher) {
                        appliedVoucher.status = 'used';
                        if (appliedVoucher.type === 'free_shipping') {
                            voucherDetail = { type: 'free_shipping' as const, message: 'Đơn hàng được miễn phí vận chuyển' };
                            order.appliedVoucher = voucherDetail;
                        } else if (appliedVoucher.type === 'discount') {
                            const discountAmount = Math.round(order.totalAmount * (appliedVoucher.value / 100));
                            voucherDetail = { type: 'discount' as const, value: appliedVoucher.value, discountAmount, message: `Đơn hàng được giảm ${appliedVoucher.value}% (${discountAmount}đ)` };
                            order.appliedVoucher = voucherDetail;
                        }
                    }
                }

                await user.save();
            }
        }

        await order.save();

        res.json({
            message: 'Cập nhật trạng thái đơn hàng thành công',
            order,
            voucherDetail
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng', error });
    }
};

// User: Lấy danh sách đơn hàng của người dùng
export const getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId })
            .populate('items.product', 'name price images')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng', error });
    }
};

// Admin: Lấy tất cả đơn hàng
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query: any = {};

        if (status) {
            query.orderStatus = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('user', 'fullName email')
                .populate('items.product', 'name price images')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Order.countDocuments(query)
        ]);

        res.json({
            orders,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng', error });
    }
};

// Lấy chi tiết đơn hàng
export const getOrderDetail = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        const order = await Order.findById(id)
            .populate('user', 'fullName email')
            .populate('items.product', 'name price images');

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Chỉ admin hoặc chủ đơn hàng mới có thể xem
        if (!isAdmin && order.user !== userId) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng', error });
    }
};

// Kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        const order = await Order.findById(orderId)
            .populate('user', 'fullName email')
            .populate('items.product', 'name price images');

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Chỉ admin hoặc chủ đơn hàng mới có thể xem
        if (!isAdmin && order.user !== userId) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        res.json({
            orderId: order._id,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            paymentMethod: order.paymentMethod
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi kiểm tra trạng thái thanh toán', error });
    }
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus, orderStatus, paymentMethod } = req.body;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Chỉ admin hoặc chủ đơn hàng mới có thể cập nhật
        if (!isAdmin && order.user !== userId.toString()) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        // Cập nhật trạng thái
        order.paymentStatus = paymentStatus;
        order.orderStatus = orderStatus;
        if (paymentMethod) {
            order.paymentMethod = paymentMethod;
        }
        await order.save();

        res.json({
            message: 'Cập nhật trạng thái thanh toán thành công',
            order: {
                _id: order._id,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
                paymentMethod: order.paymentMethod
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái thanh toán', error });
    }
}; 