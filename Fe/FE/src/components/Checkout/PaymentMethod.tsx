import React from 'react';

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

interface PaymentMethodProps {
  orderInfo: OrderInfo;
  updateOrderInfo: (newInfo: Partial<OrderInfo>) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ orderInfo, updateOrderInfo }) => {
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOrderInfo({
      paymentMethod: e.target.value
    });
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
      <h3 className="font-medium text-xl text-dark mb-5">Phương thức thanh toán</h3>
      
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={orderInfo.paymentMethod === "COD"}
            onChange={handlePaymentMethodChange}
            className="mr-2"
          />
          Thanh toán khi nhận hàng (COD)
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="MoMo"
            checked={orderInfo.paymentMethod === "MoMo"}
            onChange={handlePaymentMethodChange}
            className="mr-2"
          />
          Thanh toán qua MoMo
        </label>
      </div>
    </div>
  );
};

export default PaymentMethod;
