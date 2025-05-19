import React from "react";

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

interface BillingProps {
  orderInfo: OrderInfo;
  updateOrderInfo: (newInfo: Partial<OrderInfo>) => void;
}

const Billing: React.FC<BillingProps> = ({ orderInfo, updateOrderInfo }) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <h3 className="font-medium text-xl text-dark mb-5">Thông tin thanh toán</h3>
      <div className="w-full">
        <h2 className="font-medium text-2xl text-dark mb-7.5">Thông tin thanh toán</h2>

        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5">
            Địa chỉ
            <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="address"
            id="address"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="city" className="block mb-2.5">
            Thành phố
            <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="city"
            id="city"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="state" className="block mb-2.5">
            Tỉnh/ Thành phố
            <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="state"
            id="state"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            Số điện thoại <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="phone"
            id="phone"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5.5">
          <label htmlFor="email" className="block mb-2.5">
            Địa chỉ email <span className="text-red">*</span>
          </label>

          <input
            type="email"
            name="email"
            id="email"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Billing;
