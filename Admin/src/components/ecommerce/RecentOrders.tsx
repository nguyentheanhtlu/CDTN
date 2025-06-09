'use client';

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import * as XLSX from 'xlsx';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  _id: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  province: string;
  isNewAddress: boolean;
}

interface User {
  _id: string;
  email: string;
  fullName: string;
}

interface Order {
  _id: string;
  shippingAddress: ShippingAddress;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  appliedVoucher: string | null;
  vnp_TxnRef: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    
    // Helper to get Vietnamese status text
    const getVietnameseStatus = (status: Order["orderStatus"]) => {
      switch (status) {
        case "PENDING": return "chờ xử lý";
        case "PROCESSING": return "đang xử lý";
        case "SHIPPED": return "đang giao hàng";
        case "DELIVERED": return "đã giao";
        case "CANCELLED": return "đã hủy";
        default: return "";
      }
    };

    return (
      order._id.toLowerCase().includes(searchLower) ||
      order.user.fullName.toLowerCase().includes(searchLower) ||
      order.user.email.toLowerCase().includes(searchLower) ||
      (order.shippingAddress?.phone?.toLowerCase() || '').includes(searchLower) ||
      (order.shippingAddress?.addressLine?.toLowerCase() || '').includes(searchLower) ||
      (order.shippingAddress?.ward?.toLowerCase() || '').includes(searchLower) ||
      (order.shippingAddress?.district?.toLowerCase() || '').includes(searchLower) ||
      (order.shippingAddress?.province?.toLowerCase() || '').includes(searchLower) ||
      order.paymentMethod.toLowerCase().includes(searchLower) ||
      getVietnameseStatus(order.orderStatus).includes(searchLower) ||
      order.items.some(item => item.product.name.toLowerCase().includes(searchLower))
    );
  });

  // Calculate pagination with filtered orders
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    orderId: string;
    newStatus: Order["orderStatus"];
  } | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Please login again');
          }
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders);
        setTotalOrders(data.orders.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching orders');
        if (err instanceof Error && err.message === 'No authentication token found') {
          console.log('Please login to view orders');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order["orderStatus"]) => {
    // Show confirmation dialog first
    setPendingStatusUpdate({ orderId, newStatus });
    setConfirmDialogOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!pendingStatusUpdate) return;

    const { orderId, newStatus } = pendingStatusUpdate;
    setIsUpdating(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please login again');
        }
        throw new Error('Failed to update order status');
      }

      // Update local state after successful API call
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      
      // Show success toast
      toast.success('Order status updated successfully', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff',
        },
      });

      // Close dialogs
      setStatusDialogOpen(false);
      setConfirmDialogOpen(false);
      setPendingStatusUpdate(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: Order["orderStatus"]) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "PENDING":
        return "warning";
      case "PROCESSING":
        return "info";
      case "CANCELLED":
        return "error";
      case "SHIPPED":
        return "info";
      default:
        return "light";
    }
  };

  const handleExportExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = filteredOrders.map(order => ({
        'Mã đơn hàng': order._id,
        'Ngày đặt': new Date(order.createdAt).toLocaleString('vi-VN'),
        'Khách hàng': order.user.fullName,
        'Email': order.user.email,
        'Số điện thoại': order.shippingAddress?.phone || 'N/A',
        'Địa chỉ': order.shippingAddress ? 
          `${order.shippingAddress.addressLine}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.province}` 
          : 'N/A',
        'Tổng tiền': order.totalAmount.toLocaleString('vi-VN') + 'đ',
        'Phương thức thanh toán': order.paymentMethod,
        'Trạng thái thanh toán': order.paymentStatus === "PAID" ? "Đã thanh toán" :
                                order.paymentStatus === "PENDING" ? "Chờ thanh toán" :
                                "Thanh toán thất bại",
        'Trạng thái đơn hàng': order.orderStatus === "PENDING" ? "Chờ xử lý" :
                              order.orderStatus === "PROCESSING" ? "Đang xử lý" :
                              order.orderStatus === "DELIVERED" ? "Đã giao" :
                              order.orderStatus === "SHIPPED" ? "Đang giao" :
                              order.orderStatus === "CANCELLED" ? "Đã hủy" :
                              "Không xác định"
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Đơn hàng");

      // Generate Excel file
      const fileName = `danh-sach-don-hang-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success('Xuất file Excel thành công!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Có lỗi xảy ra khi xuất file Excel', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex justify-between">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Quản lý đơn hàng
          </h4>
          <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            Quản lý và theo dõi đơn hàng của khách hàng
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px]"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 dark:border-primary dark:text-primary dark:hover:bg-primary/10"
          >
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Đang tải đơn hàng...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? "Không tìm thấy đơn hàng nào phù hợp với từ khóa tìm kiếm" : "Không tìm thấy đơn hàng nào"}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-boxdark-2 border-t border-stroke dark:border-strokedark">
                <TableRow>
                  <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                    Thông tin đơn hàng
                  </TableCell>
                  <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                    Khách hàng
                  </TableCell>
                  <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                    Tổng tiền
                  </TableCell>
                  <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                    Trạng thái
                  </TableCell>
                  <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.map((order) => (
                  <TableRow key={order._id} className="border-b border-stroke dark:border-strokedark last:border-none hover:bg-gray-50 dark:hover:bg-boxdark-2">
                    <TableCell className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Image
                            src={order.items[0].product.images[0]}
                            alt={order.items[0].product.name}
                            width={48}
                            height={48}
                            className="rounded-lg border border-stroke dark:border-strokedark"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-black dark:text-white">
                            Đơn hàng #{order._id.slice(-6)}
                          </h5>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-4">
                      <div>
                        <h5 className="font-medium text-black dark:text-white">
                          {order.user.fullName}
                        </h5>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{order.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-4">
                      <p className="text-black dark:text-white font-medium">{order.totalAmount.toLocaleString('vi-VN')}đ</p>
                    </TableCell>
                    <TableCell className="py-5 px-4">
                      <Badge color={getStatusColor(order.orderStatus)}>
                        {order.orderStatus === "PENDING" ? "Chờ xử lý" :
                         order.orderStatus === "PROCESSING" ? "Đang xử lý" :
                         order.orderStatus === "DELIVERED" ? "Đã giao" :
                         order.orderStatus === "SHIPPED" ? "Đang giao" :
                         order.orderStatus === "CANCELLED" ? "Đã hủy" :
                         "Không xác định"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 px-4">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDetailsDialogOpen(true);
                          }}
                          className="text-primary hover:bg-primary/10 dark:text-primary dark:hover:bg-primary/10"
                        >
                          Chi tiết
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setStatusDialogOpen(true);
                          }}
                          className="bg-accent hover:bg-accent/90"
                          disabled={order.orderStatus === "CANCELLED"}
                        >
                          Cập nhật trạng thái
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav>
                <ul className="flex items-center space-x-2">
                  <li>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-strokedark dark:text-gray-400 dark:hover:bg-boxdark-2"
                    >
                      Trước
                    </Button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i}>
                      <Button
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
                        className={
                          currentPage === i + 1
                            ? "bg-primary hover:bg-primary/90"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-strokedark dark:text-gray-400 dark:hover:bg-boxdark-2"
                        }
                      >
                        {i + 1}
                      </Button>
                    </li>
                  ))}
                  <li>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-strokedark dark:text-gray-400 dark:hover:bg-boxdark-2"
                    >
                      Tiếp
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="bg-white dark:bg-boxdark max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black dark:text-white">Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Thông tin chung</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p>Mã đơn hàng: <span className="font-medium text-black dark:text-white">#{selectedOrder._id.slice(-6)}</span></p>
                    <p>Ngày đặt: <span className="font-medium text-black dark:text-white">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</span></p>
                    <p>Tổng tiền: <span className="font-medium text-black dark:text-white">{selectedOrder.totalAmount.toLocaleString('vi-VN')}đ</span></p>
                    <p>Phương thức thanh toán: <span className="font-medium text-black dark:text-white">{selectedOrder.paymentMethod}</span></p>
                    <p>Trạng thái thanh toán:
                      <Badge color={selectedOrder.paymentStatus === "PAID" ? "success" : selectedOrder.paymentStatus === "PENDING" ? "warning" : "error"}>
                       {selectedOrder.paymentStatus === "PAID" ? "Đã thanh toán" :
                       selectedOrder.paymentStatus === "PENDING" ? "Chờ thanh toán" :
                       "Thanh toán thất bại"}
                      </Badge>
                    </p>
                    <p>Trạng thái đơn hàng:
                      <Badge color={getStatusColor(selectedOrder.orderStatus)}>
                        {selectedOrder.orderStatus === "PENDING" ? "Chờ xử lý" :
                         selectedOrder.orderStatus === "PROCESSING" ? "Đang xử lý" :
                         selectedOrder.orderStatus === "DELIVERED" ? "Đã giao" :
                         selectedOrder.orderStatus === "SHIPPED" ? "Đang giao" :
                         selectedOrder.orderStatus === "CANCELLED" ? "Đã hủy" :
                         "Không xác định"}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Thông tin khách hàng</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p>Tên: <span className="text-black dark:text-white">{selectedOrder.user.fullName}</span></p>
                    <p>Email: <span className="text-black dark:text-white">{selectedOrder.user.email}</span></p>
                    <p>Tên người nhận: <span className="text-black dark:text-white">{selectedOrder.shippingAddress?.name || 'Chưa có tên'}</span></p>
                    <p>Số điện thoại: <span className="text-black dark:text-white">{selectedOrder.shippingAddress?.phone || 'Chưa có số điện thoại'}</span></p>
                    <p>Địa chỉ: <span className="text-black dark:text-white">
                      {selectedOrder.shippingAddress ?
                        `${selectedOrder.shippingAddress.addressLine}, ${selectedOrder.shippingAddress.ward}, ${selectedOrder.shippingAddress.district}, ${selectedOrder.shippingAddress.province}`
                        : 'Chưa có địa chỉ'}
                    </span></p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Sản phẩm</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-3 rounded-lg border border-stroke dark:border-strokedark">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={60}
                        height={60}
                        className="rounded-lg border border-stroke dark:border-strokedark"
                      />
                      <div>
                        <p className="font-medium text-black dark:text-white">{item.product.name}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {item.quantity} x {item.price.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-stroke dark:border-strokedark">
                <h3 className="text-lg font-semibold text-black dark:text-white">Tổng tiền</h3>
                <p className="text-xl font-semibold text-black dark:text-white">{selectedOrder.totalAmount.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailsDialogOpen(false)}
              className="border-primary text-primary  dark:border-primary dark:text-primary dark:hover:bg-primary"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setError(null);
          setPendingStatusUpdate(null);
        }
        setStatusDialogOpen(open);
      }}>
        <DialogContent className="bg-white dark:bg-boxdark">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black dark:text-white">Cập nhật trạng thái đơn hàng</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">Trạng thái hiện tại:
                  <Badge color={getStatusColor(selectedOrder?.orderStatus)}>
                    {selectedOrder?.orderStatus === "PENDING" ? "Chờ xử lý" :
                     selectedOrder?.orderStatus === "PROCESSING" ? "Đang xử lý" :
                     selectedOrder?.orderStatus === "DELIVERED" ? "Đã giao" :
                     selectedOrder?.orderStatus === "SHIPPED" ? "Đang giao" :
                     selectedOrder?.orderStatus === "CANCELLED" ? "Đã hủy" :
                     "Không xác định"}
                  </Badge>
                </p>
                <Select
                  onValueChange={(value: Order["orderStatus"]) =>
                    handleStatusUpdate(selectedOrder?._id, value)
                  }
                  defaultValue={selectedOrder?.orderStatus}
                  disabled={isUpdating || selectedOrder?.orderStatus === "CANCELLED"}
                >
                  <SelectTrigger className="w-full border-stroke dark:border-strokedark">
                    <SelectValue placeholder="Chọn trạng thái mới" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                    <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                    <SelectItem value="DELIVERED">Đã giao</SelectItem>
                    <SelectItem value="SHIPPED">Đang giao</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
                {error && (
                  <div className="text-sm text-red-500 mt-2 transition-all duration-200 ease-in-out">
                    {error}
                  </div>
                )}
              </div>
              <DialogFooter>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusDialogOpen(false);
                      setError(null);
                      setPendingStatusUpdate(null);
                    }}
                    className="border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-strokedark dark:text-gray-400 dark:hover:bg-boxdark-2"
                    disabled={isUpdating}
                  >
                    Hủy
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="bg-white dark:bg-boxdark">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black dark:text-white">
              Xác nhận cập nhật trạng thái
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400">
              Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành{' '}
              <span className="font-medium text-black dark:text-white">
                {pendingStatusUpdate?.newStatus === "PENDING" ? "Chờ xử lý" :
                 pendingStatusUpdate?.newStatus === "PROCESSING" ? "Đang xử lý" :
                 pendingStatusUpdate?.newStatus === "DELIVERED" ? "Đã giao" :
                 pendingStatusUpdate?.newStatus === "SHIPPED" ? "Đang giao" :
                 pendingStatusUpdate?.newStatus === "CANCELLED" ? "Đã hủy" :
                 "Không xác định"}
              </span>?
            </p>
          </div>
          <DialogFooter>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmDialogOpen(false);
                  setPendingStatusUpdate(null);
                }}
                disabled={isUpdating}
                className="border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-strokedark dark:text-gray-400 dark:hover:bg-boxdark-2"
              >
                Hủy
              </Button>
              <Button
                onClick={confirmStatusUpdate}
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isUpdating && (
        <div className="fixed top-4 right-4 z-50 bg-primary/10 text-primary px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200 ease-in-out">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Updating order status...</span>
        </div>
      )}
    </div>
  );
}
