"use client";
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api.service';
import { Order } from '@/types/order';
import Link from 'next/link';
import toast from 'react-hot-toast';
import SingleOrder from './SingleOrder';

const ITEMS_PER_PAGE = 5; // Số đơn hàng hiển thị trên mỗi trang

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    try {
      console.log('Đang tải đơn hàng...');
      const response = await apiService.getMyOrders();
      console.log('Kết quả đơn hàng:', response);
      setOrders(response);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng:', err);
      setError('Không thể tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Component Orders đã được mount');
    fetchOrders();
  }, []);

  // Tính toán phân trang
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return '';
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await apiService.updateOrderStatus(orderId, { orderStatus: 'cancelled' });
      toast.success('Hủy đơn hàng thành công');
      // Làm mới danh sách đơn hàng
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
              <h2>Đang tải danh sách đơn hàng...</h2>
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
                <h2>Bạn chưa có đơn hàng nào</h2>
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
            <h2 className="mb-4">Danh sách đơn hàng của tôi</h2>
            <div className="grid gap-4">
              {currentOrders.map((order) => (
                <SingleOrder 
                  key={order._id} 
                  orderItem={order} 
                  smallView={false}
                  onCancelOrder={handleCancelOrder}
                />
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang trước
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
