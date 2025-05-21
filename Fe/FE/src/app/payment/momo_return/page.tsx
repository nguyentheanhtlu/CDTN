"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function MoMoReturn() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleMoMoReturn = async () => {
            try {
                // Lấy các tham số từ URL
                const resultCode = searchParams.get('resultCode');
                const orderId = searchParams.get('orderId');
                const message = searchParams.get('message');

                console.log('MoMo return params:', {
                    resultCode,
                    orderId,
                    message
                });

                if (resultCode === '0') {
                    toast.success('Thanh toán thành công!');
                    router.push('/my-account');
                } else {
                    toast.error(message || 'Thanh toán thất bại!');
                    router.push('/checkout');
                }
            } catch (error: any) {
                console.error('Error handling MoMo return:', error);
                toast.error('Có lỗi xảy ra khi xử lý thanh toán');
                router.push('/checkout');
            } finally {
                setIsProcessing(false);
            }
        };

        handleMoMoReturn();
    }, [router, searchParams]);

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-lg">Đang xử lý thanh toán...</p>
                </div>
            </div>
        );
    }

    return null;
} 