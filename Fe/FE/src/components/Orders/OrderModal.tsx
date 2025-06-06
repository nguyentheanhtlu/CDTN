import React, { useEffect } from "react";
import OrderDetails from "./OrderDetails";
import EditOrder from "./EditOrder";
import { Order } from "@/types/order";

interface OrderModalProps {
  showDetails: boolean;
  showEdit: boolean;
  toggleModal: (status: boolean) => void;
  order: Order;
}

const OrderModal: React.FC<OrderModalProps> = ({ showDetails, showEdit, toggleModal, order }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleModal(false);
      }
    };

    if (showDetails || showEdit) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showDetails, showEdit, toggleModal]);

  if (!showDetails && !showEdit) {
    return null;
  }

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      toggleModal(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[70vh] overflow-y-auto transform transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {showDetails ? 'Chi tiết đơn hàng' : 'Chỉnh sửa đơn hàng'}
          </h2>
          <button
            onClick={() => toggleModal(false)}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {showDetails && <OrderDetails orderItem={order} />}
          {showEdit && <EditOrder order={order} toggleModal={toggleModal} />}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
