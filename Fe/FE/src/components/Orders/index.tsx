"use client";
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api.service';
import { Order } from '@/types/order';
import Link from 'next/link';
import toast from 'react-hot-toast';
import SingleOrder from './SingleOrder';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await apiService.getMyOrders();
      console.log('Orders response:', response);
      setOrders(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Orders component mounted');
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusClass = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await apiService.updateOrderStatus(orderId, { orderStatus: 'cancelled' });
      toast.success('Hủy đơn hàng thành công');
      // Refresh orders list
      fetchOrders();
    } catch (err) {
      toast.error('Không thể hủy đơn hàng');
    }
  };

  if (loading) {
    return (
      <div className="orders-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2>Đang tải đơn hàng...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-red-500">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="orders-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h2>Không tìm thấy đơn hàng nào</h2>
                <Link href="/shop" className="btn-primary mt-4">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Đơn hàng của tôi</h2>
            <div className="grid gap-4">
              {orders.map((order) => (
                <SingleOrder 
                  key={order._id} 
                  orderItem={order} 
                  smallView={false}
                  onCancelOrder={handleCancelOrder}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
