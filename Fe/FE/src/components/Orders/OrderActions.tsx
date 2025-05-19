import React from "react";
import { Order } from "@/types/order";

interface OrderActionsProps {
  toggleEdit: () => void;
  toggleDetails: () => void;
  orderStatus: Order['orderStatus'];
}

const OrderActions: React.FC<OrderActionsProps> = ({ toggleEdit, toggleDetails, orderStatus }) => {
  const canEdit = ['pending', 'processing'].includes(orderStatus);

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleDetails}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Chi tiết
      </button>
      {canEdit && (
        <button
          onClick={toggleEdit}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Chỉnh sửa
        </button>
      )}
    </div>
  );
};

export default OrderActions;
