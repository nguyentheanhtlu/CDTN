import nodemailer from 'nodemailer';
import { emailConfig } from '../config/email.config';

const transporter = nodemailer.createTransport(emailConfig);

export const sendVerificationEmail = async (email: string, code: string) => {
    try {
        const mailOptions = {
            from: emailConfig.auth.user,
            to: email,
            subject: 'Xác thực tài khoản của bạn',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Xác thực tài khoản</h2>
                    <p>Cảm ơn bạn đã đăng ký. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác thực sau:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0; text-align: center;">
                        <h1 style="color: #4CAF50; margin: 0; letter-spacing: 5px;">${code}</h1>
                    </div>
                    <p>Mã xác thực này sẽ hết hạn sau 15 phút.</p>
                    <p style="color: #666; font-size: 12px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
}; 