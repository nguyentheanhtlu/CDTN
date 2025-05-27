"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { User, getAllUsers, deleteUser, updateUserStatus } from "@/api/user";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserDetailModal from '@/components/modals/UserDetailModal';

export default function CustomerTable() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Không thể tải danh sách khách hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        await deleteUser(userId);
        toast.success("Xóa khách hàng thành công");
        fetchUsers(); // Refresh the list
      } catch (error) {
        toast.error("Không thể xóa khách hàng");
        console.error(error);
      }
    }
  };

  const handleStatusChange = async (userId: string, currentStatus: "Active" | "Inactive") => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await updateUserStatus(userId, newStatus);
      toast.success("Cập nhật trạng thái thành công");
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
      console.error(error);
    }
  };

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Ảnh đại diện
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Họ và tên
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Email
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Cấp độ VIP
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tổng chi tiêu
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Ngày tạo
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {users?.map((user) => (
                  <TableRow key={`user-${user._id}`}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={user.avatar || "/images/user/default-avatar.jpg"}
                            alt={user.fullName}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {user.fullName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge
                        size="sm"
                        color={user.vipLevel > 0 ? "warning" : "info"}
                      >
                        {user.vipLevel > 0 ? `VIP ${user.vipLevel}` : 'Thường'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.totalSpent.toLocaleString('vi-VN')}đ
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                          onClick={() => handleViewDetails(user._id)}
                        >
                          Xem
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        userId={selectedUserId || ''}
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </>
  );
}
