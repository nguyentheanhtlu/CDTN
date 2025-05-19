import React from "react";
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
  if (!showDetails && !showEdit) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-end p-4">
          <button
            onClick={() => toggleModal(false)}
            className="text-gray-500 hover:text-gray-700"
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
