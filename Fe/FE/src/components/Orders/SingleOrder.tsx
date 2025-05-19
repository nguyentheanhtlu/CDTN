import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { Order } from "@/types/order";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface SingleOrderProps {
  orderItem: Order;
  smallView: boolean;
  onCancelOrder?: (orderId: string) => Promise<void>;
}

const SingleOrder: React.FC<SingleOrderProps> = ({ orderItem, smallView, onCancelOrder }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  const handleCancelOrder = async () => {
    if (!onCancelOrder) return;
    
    if (orderItem.orderStatus !== 'pending') {
      toast.error('Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xử lý');
      return;
    }

    try {
      setIsCancelling(true);
      await onCancelOrder(orderItem._id);
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color class
  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green bg-green-light-6';
      case 'cancelled':
        return 'text-red bg-red-light-6';
      case 'processing':
        return 'text-yellow bg-yellow-light-4';
      case 'shipped':
        return 'text-blue bg-blue-light-6';
      case 'pending':
        return 'text-gray-5 bg-gray-2';
      default:
        return 'text-gray-5 bg-gray-2';
    }
  };

  return (
    <>
      <div className="order-card bg-white rounded-lg shadow-sm p-4">
        <div className="order-header flex justify-between items-center mb-4">
          <div className="order-info">
            <h3 className="text-lg font-medium">Order #{orderItem._id}</h3>
            <p className="text-gray-500">Placed on {formatDate(orderItem.createdAt)}</p>
          </div>
          <div className="order-status">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(orderItem.orderStatus)}`}>
              {orderItem.orderStatus}
            </span>
          </div>
        </div>

        <div className="order-items space-y-4 mb-4">
          {orderItem.items.map((item) => (
            <div key={item.product._id} className="order-item flex items-center gap-4">
              <div className="item-image w-20 h-20 relative">
                <Image
                  src={item.product.images.previews[0] || '/images/product-placeholder.jpg'}
                  alt={item.product.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="item-details flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
                <p className="text-gray-500">Price: ${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-footer flex justify-between items-center">
          <div className="order-total">
            <span className="text-gray-500">Total Amount:</span>
            <strong className="ml-2 text-lg">${orderItem.totalAmount.toFixed(2)}</strong>
          </div>
          <div className="order-actions flex gap-2">
            {orderItem.orderStatus === 'pending' && onCancelOrder && (
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
              </button>
            )}
            <OrderActions 
              toggleEdit={toggleEdit} 
              toggleDetails={toggleDetails}
              orderStatus={orderItem.orderStatus}
            />
          </div>
        </div>
      </div>

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;
