import React, { useState } from "react";
import toast from "react-hot-toast";
import { Order } from "@/types/order";
import { apiService } from "@/services/api.service";

interface EditOrderProps {
  order: Order;
  toggleModal: (status: boolean) => void;
}

const EditOrder: React.FC<EditOrderProps> = ({ order, toggleModal }) => {
  const [currentStatus, setCurrentStatus] = useState<Order['orderStatus']>(order.orderStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value as Order['orderStatus']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiService.updateOrderStatus(order._id, { orderStatus: currentStatus });
      toast.success('Order status updated successfully');
      toggleModal(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update order status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h3 className="text-lg font-medium mb-4">Update Order Status</h3>
      
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={currentStatus}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => toggleModal(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Status'}
        </button>
      </div>
    </form>
  );
};

export default EditOrder;
