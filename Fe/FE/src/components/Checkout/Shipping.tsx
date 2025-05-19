import React, { useState } from "react";

interface OrderInfo {
  useSavedAddress: boolean;
  savedAddressIndex: number;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine: string;
    ward: string;
    district: string;
    province: string;
  };
  paymentMethod: string;
}

interface ShippingProps {
  orderInfo: OrderInfo;
  updateOrderInfo: (newInfo: Partial<OrderInfo>) => void;
}

const Shipping: React.FC<ShippingProps> = ({ orderInfo, updateOrderInfo }) => {
  const [dropdown, setDropdown] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateOrderInfo({
      shippingAddress: {
        ...orderInfo.shippingAddress,
        [name]: value
      }
    });
  };

  const handleUseSavedAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOrderInfo({
      useSavedAddress: e.target.checked,
      savedAddressIndex: 0
    });
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
      <h3 className="font-medium text-xl text-dark mb-5">Địa chỉ giao hàng</h3>
      
      {/* Checkbox sử dụng địa chỉ đã lưu */}
      <div className="mb-5">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={orderInfo.useSavedAddress}
            onChange={handleUseSavedAddress}
            className="mr-2"
          />
          Sử dụng địa chỉ đã lưu
        </label>
      </div>

      {orderInfo.useSavedAddress ? (
        // Hiển thị danh sách địa chỉ đã lưu
        <div>
          {/* Thêm danh sách địa chỉ đã lưu ở đây */}
        </div>
      ) : (
        // Form nhập địa chỉ mới
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2.5">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={orderInfo.shippingAddress.name}
              onChange={handleAddressChange}
              className="rounded-md border border-gray-3 bg-gray-1 w-full p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2.5">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={orderInfo.shippingAddress.phone}
              onChange={handleAddressChange}
              className="rounded-md border border-gray-3 bg-gray-1 w-full p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="addressLine" className="block mb-2.5">Địa chỉ</label>
            <input
              type="text"
              id="addressLine"
              name="addressLine"
              value={orderInfo.shippingAddress.addressLine}
              onChange={handleAddressChange}
              className="rounded-md border border-gray-3 bg-gray-1 w-full p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="ward" className="block mb-2.5">Phường/Xã</label>
            <input
              type="text"
              id="ward"
              name="ward"
              value={orderInfo.shippingAddress.ward}
              onChange={handleAddressChange}
              className="rounded-md border border-gray-3 bg-gray-1 w-full p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="district" className="block mb-2.5">Quận/Huyện</label>
            <input
              type="text"
              id="district"
              name="district"
              value={orderInfo.shippingAddress.district}
              onChange={handleAddressChange}
              className="rounded-md border border-gray-3 bg-gray-1 w-full p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="province" className="block mb-2.5">Tỉnh/Thành phố</label>
            <input
              type="text"
              id="province"
              name="province"
              value={orderInfo.shippingAddress.province}
              onChange={handleAddressChange}
              className="rounded-md border border-gray-3 bg-gray-1 w-full p-2.5"
              required
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
