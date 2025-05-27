import nodemailer from 'nodemailer';
import { Order } from '../models/order.model';
import { emailConfig } from '../config/email.config';

// Tạo transporter cho nodemailer sử dụng cấu hình có sẵn
const transporter = nodemailer.createTransport(emailConfig);

// Hàm gửi email xác nhận đơn hàng
export const sendOrderConfirmationEmail = async (order: any, userEmail: string, userName: string) => {
    try {
        // Format danh sách sản phẩm
        const itemsList = order.items.map((item: any) => {
            const product = item.product;
            return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        <img src="${product.images[0]}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover;">
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.price.toLocaleString('vi-VN')}đ</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                </tr>
            `;
        }).join('');

        // Tạo nội dung email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Xác nhận đơn hàng thành công',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #3C50E0; text-align: center;">Xác nhận đơn hàng thành công</h2>
                    <p>Xin chào ${userName},</p>
                    <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Dưới đây là thông tin chi tiết đơn hàng của bạn:</p>
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                        <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
                        <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                        <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}</p>
                        <p><strong>Địa chỉ giao hàng:</strong></p>
                        <p>${order.shippingAddress.name}</p>
                        <p>${order.shippingAddress.phone}</p>
                        <p>${order.shippingAddress.addressLine}</p>
                        <p>${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.province}</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 10px; text-align: left;">Hình ảnh</th>
                                <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                                <th style="padding: 10px; text-align: left;">Số lượng</th>
                                <th style="padding: 10px; text-align: left;">Đơn giá</th>
                                <th style="padding: 10px; text-align: left;">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsList}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" style="padding: 10px; text-align: right;"><strong>Tổng tiền hàng:</strong></td>
                                <td style="padding: 10px;">${order.totalAmount.toLocaleString('vi-VN')}đ</td>
                            </tr>
                            ${order.discountAmount > 0 ? `
                                <tr>
                                    <td colspan="4" style="padding: 10px; text-align: right;"><strong>Giảm giá:</strong></td>
                                    <td style="padding: 10px; color: #28a745;">-${order.discountAmount.toLocaleString('vi-VN')}đ</td>
                                </tr>
                            ` : ''}
                            <tr>
                                <td colspan="4" style="padding: 10px; text-align: right;"><strong>Phí vận chuyển:</strong></td>
                                <td style="padding: 10px;">
                                    ${order.appliedVouchers?.some((v: any) => v.type === 'free_shipping') 
                                        ? '<span style="color: #28a745;">Miễn phí</span>' 
                                        : '30.000đ'}
                                </td>
                            </tr>
                            <tr style="border-top: 2px solid #eee;">
                                <td colspan="4" style="padding: 10px; text-align: right;"><strong>Tổng cộng:</strong></td>
                                <td style="padding: 10px;"><strong>${order.finalAmount.toLocaleString('vi-VN')}đ</strong></td>
                            </tr>
                        </tfoot>
                    </table>

                    ${order.paymentMethod === 'COD' ? `
                        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="color: #856404; margin: 0;">
                                <strong>Lưu ý:</strong> Đơn hàng của bạn sẽ được thanh toán khi nhận hàng. 
                                Vui lòng chuẩn bị đủ số tiền ${order.finalAmount.toLocaleString('vi-VN')}đ khi nhận hàng.
                            </p>
                        </div>
                    ` : ''}

                    <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao.</p>
                    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #666; margin: 0;">Cảm ơn bạn đã tin tưởng và ủng hộ chúng tôi!</p>
                    </div>
                </div>
            `
        };

        // Gửi email
        await transporter.sendMail(mailOptions);
        console.log('Email xác nhận đơn hàng đã được gửi thành công');
    } catch (error) {
        console.error('Lỗi khi gửi email xác nhận đơn hàng:', error);
        throw error;
    }
}; 