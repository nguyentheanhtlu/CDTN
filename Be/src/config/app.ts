export const vnpay = {
    vnp_ReturnUrl: process.env.VNP_RETURN_URL || 'http://localhost:3000/payment/vnpay_return'
};

export const momo = {
    momo_ReturnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3000/payment/momo_return'
};