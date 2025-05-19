import React from "react";
import { Order } from "@/types/order";
import Image from "next/image";

interface OrderDetailsProps {
  orderItem: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderItem }) => {
  // Format date to readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color class
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green bg-green-light-6';
      case 'cancelled':
        return 'text-red bg-red-light-6';
      case 'processing':
        return 'text-yellow bg-yellow-light-4';
      case 'shipped':
        return 'text-blue bg-blue-light-6';
      default:
        return 'text-gray-5 bg-gray-2';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'Đã thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'pending':
        return 'Chờ thanh toán';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Mã đơn hàng</h4>
          <p className="mt-1">{orderItem._id}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Ngày đặt hàng</h4>
          <p className="mt-1">{formatDate(orderItem.createdAt)}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Trạng thái</h4>
          <p className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(orderItem.orderStatus)}`}>
            {getStatusText(orderItem.orderStatus)}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Trạng thái thanh toán</h4>
          <p className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${
            orderItem.paymentStatus === 'paid' ? 'text-green bg-green-light-6' :
            orderItem.paymentStatus === 'failed' ? 'text-red bg-red-light-6' :
            'text-yellow bg-yellow-light-4'
          }`}>
            {getPaymentStatusText(orderItem.paymentStatus)}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Địa chỉ giao hàng</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium">{orderItem.shippingAddress.fullName}</p>
          <p>{orderItem.shippingAddress.phone}</p>
          <p>{orderItem.shippingAddress.street}</p>
          <p>{`${orderItem.shippingAddress.ward}, ${orderItem.shippingAddress.district}, ${orderItem.shippingAddress.province}`}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Chi tiết sản phẩm</h4>
        <div className="space-y-4">
          {orderItem.items.map((item, index) => (
            <div key={`${orderItem._id}-${item.product._id}-${index}`} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
              <div className="w-20 h-20 relative">
                <Image
                  src={item.product.images[0] || '/images/product-placeholder.jpg'}
                  alt={item.product.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h5 className="font-medium">{item.product.name}</h5>
                <p className="text-gray-500">Số lượng: {item.quantity}</p>
                <p className="text-gray-500">Đơn giá: {item.price.toLocaleString('vi-VN')}đ</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Tạm tính</span>
          <span>{orderItem.totalAmount.toLocaleString('vi-VN')}đ</span>
        </div>
        {orderItem.voucher && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500">Giảm giá</span>
            <span className="text-green-600">
              {orderItem.voucher.type === 'discount' 
                ? `-${orderItem.voucher.value.toLocaleString('vi-VN')}đ` 
                : 'Miễn phí vận chuyển'}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center mt-4 font-medium text-lg">
          <span>Tổng cộng</span>
          <span>{orderItem.totalAmount.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
