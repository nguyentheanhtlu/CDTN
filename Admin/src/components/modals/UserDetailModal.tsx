"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';
import { Button } from '@/components/ui/button';
import { getUserById, addVoucherToUser, removeVoucherFromUser, deleteUserAddress, setDefaultAddress } from '@/api/user';

interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  vipLevel: number;
  vipRank: string;
  totalSpent: number;
  createdAt: string;
  addresses: {
    _id: string;
    name: string;
    phone: string;
    addressLine: string;
    ward: string;
    district: string;
    province: string;
    isDefault: boolean;
  }[];
  vouchers: {
    _id: string;
    type: 'discount' | 'free_shipping';
    value: number;
    status: 'active' | 'used' | 'expired';
    expiredAt: string;
  }[];
}

interface UserDetailModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ userId, isOpen, onClose }: UserDetailModalProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newVoucher, setNewVoucher] = useState({
    type: 'discount' as 'discount' | 'free_shipping',
    value: 0,
    expiredAt: ''
  });

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetail();
    }
  }, [userId, isOpen]);

  const fetchUserDetail = async () => {
    try {
      const response = await getUserById(userId);
      setUser(response.user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        // TODO: Redirect to login page
      } else {
        toast.error('Không thể tải thông tin người dùng');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVoucher = async () => {
    try {
      await addVoucherToUser(userId, newVoucher);
      toast.success('Thêm voucher thành công');
      fetchUserDetail();
      setNewVoucher({ type: 'discount', value: 0, expiredAt: '' });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        // TODO: Redirect to login page
      } else {
        toast.error('Không thể thêm voucher');
      }
      console.error(error);
    }
  };

  const handleRemoveVoucher = async (voucherId: string) => {
    try {
      await removeVoucherFromUser(userId, voucherId);
      toast.success('Xóa voucher thành công');
      fetchUserDetail();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        // TODO: Redirect to login page
      } else {
        toast.error('Không thể xóa voucher');
      }
      console.error(error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteUserAddress(addressId);
      toast.success('Xóa địa chỉ thành công');
      fetchUserDetail();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        // TODO: Redirect to login page
      } else {
        toast.error('Không thể xóa địa chỉ');
      }
      console.error(error);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      toast.success('Đặt địa chỉ mặc định thành công');
      fetchUserDetail();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        // TODO: Redirect to login page
      } else {
        toast.error('Không thể đặt địa chỉ mặc định');
      }
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Thông tin chi tiết khách hàng</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : !user ? (
              <div className="text-center py-4">Không tìm thấy thông tin người dùng</div>
            ) : (
              <>
                {/* User Info */}
                <div className="mb-6">
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      <Image
                        width={128}
                        height={128}
                        src={user.avatar || "/images/user/default-avatar.jpg"}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{user.fullName}</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600">Email: {user.email}</p>
                          <p className="text-gray-600">Số điện thoại: {user.phone}</p>
                          <p className="text-gray-600">Ngày tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            Cấp độ VIP: 
                            <Badge
                              size="sm"
                              color={user.vipLevel > 0 ? "warning" : "info"}
                            >
                              {user.vipLevel > 0 ? `VIP ${user.vipLevel}` : 'Thường'}
                            </Badge>
                          </p>
                          <p className="text-gray-600">Hạng: {user.vipRank}</p>
                          <p className="text-gray-600">Tổng chi tiêu: {user.totalSpent.toLocaleString('vi-VN')}đ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Địa chỉ giao hàng</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <div key={address._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{address.name}</h3>
                          <div className="flex gap-2">
                            {!address.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefaultAddress(address._id)}
                              >
                                Đặt mặc định
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAddress(address._id)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600">{address.phone}</p>
                        <p className="text-gray-600">
                          {address.addressLine}, {address.ward}, {address.district}, {address.province}
                        </p>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-700">
                            Địa chỉ mặc định
                          </h3>
                          {address.isDefault && (
                            <Badge size="sm" color="success">
                              Mặc định
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vouchers */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Voucher</h2>
                    <div className="flex gap-4">
                      <select
                        value={newVoucher.type}
                        onChange={(e) => setNewVoucher({ ...newVoucher, type: e.target.value as 'discount' | 'free_shipping' })}
                        className="border rounded px-2 py-1"
                      >
                        <option value="discount">Giảm giá</option>
                        <option value="free_shipping">Miễn phí vận chuyển</option>
                      </select>
                      {newVoucher.type === 'discount' && (
                        <input
                          type="number"
                          value={newVoucher.value}
                          onChange={(e) => setNewVoucher({ ...newVoucher, value: Number(e.target.value) })}
                          placeholder="Giá trị (%)"
                          className="border rounded px-2 py-1 w-24"
                        />
                      )}
                      <input
                        type="date"
                        value={newVoucher.expiredAt}
                        onChange={(e) => setNewVoucher({ ...newVoucher, expiredAt: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                      <Button
                        onClick={handleAddVoucher}
                        disabled={!newVoucher.expiredAt || (newVoucher.type === 'discount' && newVoucher.value <= 0)}
                      >
                        Thêm voucher
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.vouchers.map((voucher) => (
                      <div key={voucher._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">
                            {voucher.type === 'discount' ? 'Giảm giá' : 'Miễn phí vận chuyển'}
                          </h3>
                          <div className="flex gap-2">
                            <h3 className="text-sm font-medium text-gray-700">
                              Trạng thái
                            </h3>
                            <div className="flex gap-2">
                              <Badge
                                size="sm"
                                color={
                                  voucher.status === 'active' ? 'success' :
                                  voucher.status === 'used' ? 'error' : 'warning'
                                }
                              >
                                {voucher.status === 'active' ? 'Đang hoạt động' :
                                 voucher.status === 'used' ? 'Đã sử dụng' : 'Hết hạn'}
                              </Badge>
                              {voucher.status === 'active' && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemoveVoucher(voucher._id)}
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">
                          {voucher.type === 'discount' ? `Giảm ${voucher.value}%` : 'Miễn phí vận chuyển'}
                        </p>
                        <p className="text-gray-600">
                          Hết hạn: {new Date(voucher.expiredAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 