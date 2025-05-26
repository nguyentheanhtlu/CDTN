"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';

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
    type: 'discount' | 'free_shipping';
    value: number;
    status: 'active' | 'used' | 'expired';
    expiredAt: string;
  }[];
}

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data.user);
      } catch (error) {
        toast.error('Không thể tải thông tin người dùng');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (!user) {
    return <div className="text-center py-4">Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Thông tin chi tiết khách hàng</h1>
        <div className="bg-white rounded-lg shadow p-6">
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
      </div>

      {/* Danh sách địa chỉ */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Địa chỉ giao hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses.map((address) => (
            <div key={address._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{address.name}</h3>
                {address.isDefault && (
                  <Badge size="sm" color="success">Mặc định</Badge>
                )}
              </div>
              <p className="text-gray-600">{address.phone}</p>
              <p className="text-gray-600">
                {address.addressLine}, {address.ward}, {address.district}, {address.province}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách voucher */}
      <div>
        <h2 className="text-xl font-bold mb-4">Voucher</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.vouchers.map((voucher) => (
            <div key={`${voucher.type}-${voucher.value}-${voucher.expiredAt}`} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">
                  {voucher.type === 'discount' ? 'Giảm giá' : 'Miễn phí vận chuyển'}
                </h3>
                <Badge
                  size="sm"
                  color={
                    voucher.status === 'active' ? 'success' :
                    voucher.status === 'used' ? 'error' : 'warning'
                  }
                >
                  {voucher.status === 'active' ? 'Còn hiệu lực' :
                   voucher.status === 'used' ? 'Đã sử dụng' : 'Hết hạn'}
                </Badge>
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
    </div>
  );
} 