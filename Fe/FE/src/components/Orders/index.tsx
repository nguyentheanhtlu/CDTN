"use client";
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api.service';
import { Order } from '@/types/order';
import Link from 'next/link';
import toast from 'react-hot-toast';
import SingleOrder from './SingleOrder';
import { Search, Calendar } from 'lucide-react';

const ITEMS_PER_PAGE = 5; // Số đơn hàng hiển thị trên mỗi trang

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getStatusClass = (status: Order['orderStatus']) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'SHIPPED':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã giao hàng';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return '';
    }
  };

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

  // Lọc đơn hàng dựa trên từ khóa tìm kiếm và ngày
  const filteredOrders = orders.filter(order => {
    if (!order || !order.shippingAddress) return false;
    
    const searchLower = searchQuery.toLowerCase();
    const orderDate = new Date(order.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Kiểm tra ngày
    if (start && orderDate < start) return false;
    if (end && orderDate > end) return false;

    // Kiểm tra tìm kiếm
    return (
      (order._id?.toLowerCase() || '').includes(searchLower) ||
      (order.shippingAddress.fullName?.toLowerCase() || '').includes(searchLower) ||
      (order.shippingAddress.email?.toLowerCase() || '').includes(searchLower) ||
      (order.shippingAddress.phone?.toLowerCase() || '').includes(searchLower) ||
      (getStatusClass(order.orderStatus)?.toLowerCase() || '').includes(searchLower) ||
      // Tìm kiếm theo tên sản phẩm
      order.items.some(item => 
        (item.product?.name?.toLowerCase() || '').includes(searchLower)
      )
    );
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

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

  const handleCancelOrder = async (orderId: string) => {
    try {
      await apiService.updateOrderStatus(orderId, { orderStatus: 'CANCELLED' });
      toast.success('Hủy đơn hàng thành công');
      fetchOrders();
    } catch (err) {
      toast.error('Không thể hủy đơn hàng');
    }
  };

  const handleDateFilter = () => {
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
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

            {/* Search and Filter Section */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng theo mã, tên, email, số điện thoại, trạng thái hoặc tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Date Filter */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDateFilter}
                    className="px-4 py-2 bg-green-light text-white-light rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Lọc
                  </button>
                  <button
                    onClick={clearDateFilter}
                    className="px-4 py-2 bg-red-light text-white-light rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Xóa lọc
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <SingleOrder 
                    key={order._id} 
                    orderItem={order} 
                    smallView={false}
                    onCancelOrder={handleCancelOrder}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  {searchQuery || startDate || endDate ? 'Không tìm thấy đơn hàng phù hợp' : 'Không có đơn hàng nào'}
                </div>
              )}
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
                        ? 'bg-blue-600'
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
