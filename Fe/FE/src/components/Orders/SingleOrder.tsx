import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { Order } from "@/types/order";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import apiService from "@/api/apiService";

interface SingleOrderProps {
  orderItem: Order;
  smallView: boolean;
  onCancelOrder?: (orderId: string) => Promise<void>;
}

const SingleOrder: React.FC<SingleOrderProps> = ({ orderItem, smallView, onCancelOrder }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  console.log("orderItem",orderItem);

  const handleCancelOrder = async () => {
    if (!onCancelOrder) return;
    
    if (orderItem.orderStatus !== 'PENDING') {
      toast.error('Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xử lý');
      return;
    }

    try {
      setIsCancelling(true);
      await onCancelOrder(orderItem._id);
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReviewClick = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);
      await apiService.reviewProduct(selectedProduct.id, {
        rating,
        comment
      });
      toast.success('Đánh giá sản phẩm thành công!');
      setShowReviewModal(false);
      setRating(5);
      setComment("");
    } catch (error) {
      console.error('Lỗi khi đánh giá sản phẩm:', error);
      toast.error('Có lỗi xảy ra khi đánh giá sản phẩm');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
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

  const getStatusText = (status: Order['orderStatus']) => {
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

  return (
    <>
      <div className="order-card bg-white rounded-lg shadow-sm p-4">
        <div className="order-header flex justify-between items-center mb-4">
          <div className="order-info">
            <h3 className="text-lg font-medium">Đơn hàng #{orderItem._id}</h3>
            <p className="text-gray-500">Đặt vào ngày {formatDate(orderItem.createdAt)}</p>
          </div>
          <div className="order-status">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(orderItem.orderStatus)}`}>
              {getStatusText(orderItem.orderStatus)}
            </span>
          </div>
        </div>

        <div className="order-items space-y-4 mb-4">
          {(() => {
            // Group items by product ID
            const groupedItems = orderItem.items.reduce((acc, item) => {
              const productId = item?.product?._id;
              if (!productId) return acc;

              if (!acc[productId]) {
                acc[productId] = {
                  product: item.product,
                  quantity: item.quantity,
                  price: item.price
                };
              } else {
                acc[productId].quantity += item.quantity;
              }
              return acc;
            }, {} as Record<string, { product: any; quantity: number; price: number }>);

            return Object.values(groupedItems).map((item, index) => (
              <div key={`${orderItem._id}-${item.product._id}-${index}`} className="order-item flex items-center gap-4">
                <div className="item-image w-20 h-20 relative">
                  <Image
                    src={item.product.images[0] || '/images/product-placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="item-details flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-gray-500">Số lượng: {item.quantity}</p>
                  <p className="text-gray-500">Giá: {item.price.toLocaleString('vi-VN')}đ</p>
                  {orderItem.orderStatus.toLowerCase() === 'delivered' && (
                    <button
                      onClick={() => handleReviewClick(item.product._id, item.product.name)}
                      className="mt-2 px-3 py-1 text-sm text-blue-light border border-blue-600 rounded hover:bg-blue-50"
                    >
                      Đánh giá sản phẩm
                    </button>
                  )}
                </div>
              </div>
            ));
          })()}
        </div>

        <div className="order-footer flex justify-between items-center">
          <div className="order-total">
            <span className="text-gray-500">Tổng tiền:</span>
            <strong className="ml-2 text-lg">{orderItem.finalAmount.toLocaleString('vi-VN')}đ</strong>
          </div>
          <div className="order-actions flex gap-2">
            {orderItem.orderStatus == 'PENDING' && onCancelOrder && (
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-4 py-2 text-sm font-medium text-white bg-red-light rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
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

      {/* Review Modal */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Đánh giá sản phẩm: {selectedProduct.name}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số sao</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl p-1 transition-colors duration-200 ${
                      star <= rating ? 'text-yellow-light' : 'text-gray-200'
                    } hover:text-yellow-500 hover:scale-110`}
                    type="button"
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {rating === 1 && 'Rất không hài lòng'}
                {rating === 2 && 'Không hài lòng'}
                {rating === 3 && 'Bình thường'}
                {rating === 4 && 'Hài lòng'}
                {rating === 5 && 'Rất hài lòng'}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-light rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleOrder;
