"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";
import apiService from "@/api/apiService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Thêm state để lưu thông tin đơn hàng
  const [orderInfo, setOrderInfo] = useState({
    useSavedAddress: false,
    savedAddressIndex: 0,
    shippingAddress: {
      name: "",
      phone: "",
      addressLine: "",
      ward: "",
      district: "",
      province: ""
    },
    paymentMethod: "COD"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống');
      return;
    }

    // Kiểm tra thông tin địa chỉ nếu không sử dụng địa chỉ đã lưu
    if (!orderInfo.useSavedAddress) {
      const { name, phone, addressLine, ward, district, province } = orderInfo.shippingAddress;
      if (!name || !phone || !addressLine || !ward || !district || !province) {
        toast.error('Vui lòng nhập đầy đủ thông tin địa chỉ giao hàng');
        return;
      }
    }

    try {
      setIsProcessing(true);
      // Tạo payload dựa trên useSavedAddress
      const payload = orderInfo.useSavedAddress 
        ? {
            useSavedAddress: true,
            savedAddressIndex: orderInfo.savedAddressIndex,
            paymentMethod: orderInfo.paymentMethod
          }
        : {
            useSavedAddress: false,
            shippingAddress: orderInfo.shippingAddress,
            paymentMethod: orderInfo.paymentMethod
          };

      await apiService.createOrder(payload);
      toast.success('Đặt hàng thành công!');
      router.push('/orders');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đặt hàng thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  // Hàm cập nhật thông tin đơn hàng
  const updateOrderInfo = (newInfo: Partial<typeof orderInfo>) => {
    setOrderInfo(prev => ({
      ...prev,
      ...newInfo
    }));
  };

  return (
    <>
      <Breadcrumb title={"Thanh toán"} pages={["thanh-toan"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- phần bên trái --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- đăng nhập --> */}

                {/* <!-- thông tin thanh toán --> */}
                <Billing 
                  orderInfo={orderInfo}
                  updateOrderInfo={updateOrderInfo}
                />

                {/* <!-- địa chỉ giao hàng --> */}
                <Shipping 
                  orderInfo={orderInfo}
                  updateOrderInfo={updateOrderInfo}
                />

                {/* <!-- ghi chú khác --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Ghi chú khác (tùy chọn)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Ghi chú về đơn hàng của bạn, ví dụ: lưu ý đặc biệt cho việc giao hàng."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* <!-- phần bên phải --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- danh sách đơn hàng --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Đơn hàng của bạn
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- tiêu đề --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Sản phẩm</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Thành tiền
                        </h4>
                      </div>
                    </div>

                    {/* <!-- danh sách sản phẩm --> */}
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">{item.product.name} x {item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-dark text-right">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* <!-- phí vận chuyển --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Phí vận chuyển</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">0đ</p>
                      </div>
                    </div>

                    {/* <!-- tổng cộng --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Tổng cộng</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          {totalPrice.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- mã giảm giá --> */}
                <Coupon />

                {/* <!-- phương thức vận chuyển --> */}
                <ShippingMethod />

                {/* <!-- phương thức thanh toán --> */}
                <PaymentMethod 
                  orderInfo={orderInfo}
                  updateOrderInfo={updateOrderInfo}
                />

                {/* <!-- nút đặt hàng --> */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;