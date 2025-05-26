import React, { useEffect, useState } from "react";
import { apiService } from "@/services/api.service";
import toast from "react-hot-toast";

interface Voucher {
  _id: string;
  type: 'discount' | 'free_shipping';
  value: number;
  status: 'active' | 'used' | 'expired';
  expiredAt?: string;
}

interface CouponProps {
  onVoucherSelect?: (voucherIds: string[]) => void;
}

const Coupon: React.FC<CouponProps> = ({ onVoucherSelect }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVouchers, setSelectedVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVouchers();
        
        // Kiểm tra và chuyển đổi response
        let vouchersData: Voucher[] = [];
        
        if (response && typeof response === 'object') {
          if (Array.isArray(response)) {
            vouchersData = response;
          } else if ('vouchers' in response && Array.isArray(response.vouchers)) {
            vouchersData = response.vouchers;
          }
        }

        // Lọc các voucher active
        const activeVouchers = vouchersData.filter(v => v.status === 'active');
        setVouchers(activeVouchers);
        
        if (activeVouchers.length === 0) {
          toast('Bạn chưa có voucher nào');
        }
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        setVouchers([]);
        toast.error('Không thể tải danh sách voucher');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleSelectVoucher = (e: React.MouseEvent, voucher: Voucher) => {
    // Ngăn chặn sự kiện click lan ra ngoài
    e.preventDefault();
    e.stopPropagation();

    const isSelected = selectedVouchers.some(v => v._id === voucher._id);
    let newSelectedVouchers: Voucher[];

    if (isSelected) {
      // Bỏ chọn voucher
      newSelectedVouchers = selectedVouchers.filter(v => v._id !== voucher._id);
      toast.success('Đã bỏ chọn voucher');
    } else {
      // Kiểm tra số lượng voucher đã chọn
      if (selectedVouchers.length >= 2) {
        toast.error('Chỉ được chọn tối đa 2 voucher');
        return;
      }

      // Kiểm tra loại voucher
      const hasDiscountVoucher = selectedVouchers.some(v => v.type === 'discount');
      const hasShippingVoucher = selectedVouchers.some(v => v.type === 'free_shipping');

      if (voucher.type === 'discount' && hasDiscountVoucher) {
        toast.error('Chỉ được chọn 1 voucher giảm giá');
        return;
      }

      if (voucher.type === 'free_shipping' && hasShippingVoucher) {
        toast.error('Chỉ được chọn 1 voucher miễn phí vận chuyển');
        return;
      }

      // Thêm voucher mới
      newSelectedVouchers = [...selectedVouchers, voucher];
      toast.success('Đã chọn voucher');
    }

    setSelectedVouchers(newSelectedVouchers);
    
    if (onVoucherSelect) {
      onVoucherSelect(newSelectedVouchers.map(v => v._id));
    }
  };

  const isVoucherSelected = (voucher: Voucher) => {
    return selectedVouchers.some(v => v._id === voucher._id);
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Voucher của bạn</h3>
      </div>

      <div className="py-8 px-4 sm:px-8.5">
        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : vouchers.length > 0 ? (
          <div className="space-y-4">
            {vouchers.map((voucher) => (
              <div 
                key={voucher._id}
                className={`p-4 border rounded-md ${
                  isVoucherSelected(voucher)
                    ? 'border-blue bg-blue/5' 
                    : 'border-gray-3'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-dark">
                      {voucher.type === 'discount' 
                        ? `Giảm ${voucher.value}%` 
                        : 'Miễn phí vận chuyển'}
                    </h4>
                    <p className="text-sm text-dark-5">
                      Hết hạn: {new Date(voucher.expiredAt || '').toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleSelectVoucher(e, voucher)}
                    className={`px-4 py-2 rounded-md ${
                      isVoucherSelected(voucher)
                        ? 'bg-blue text-white'
                        : 'bg-gray-1 text-dark hover:bg-gray-2'
                    }`}
                  >
                    {isVoucherSelected(voucher) ? 'Bỏ chọn' : 'Chọn'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-dark-5">
            Bạn chưa có voucher nào
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupon;