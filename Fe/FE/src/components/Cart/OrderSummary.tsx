import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const OrderSummary = () => {
  const router = useRouter();
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Tổng đơn hàng</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Sản phẩm</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Thành tiền</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems?.map((item) => (
            <div key={item._id} className="flex items-center justify-between py-5 border-b border-gray-3">
              <div>
                <p className="text-dark">{item.product.name}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
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

          {/* <!-- checkout button --> */}
          <button
            onClick={handleCheckout}
            type="button"
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
