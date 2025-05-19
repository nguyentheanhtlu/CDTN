import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface Customer {
  id: number;
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

// Dữ liệu mẫu khách hàng
const customers: Customer[] = [
  {
    id: 1,
    avatar: "/images/user/user-17.jpg",
    fullName: "Lindsey Curtis",
    email: "lindsey.curtis@example.com",
    phone: "0987654321",
    status: "Active",
    createdAt: "2023-01-10",
  },
  {
    id: 2,
    avatar: "/images/user/user-18.jpg",
    fullName: "Kaiya George",
    email: "kaiya.george@example.com",
    phone: "0912345678",
    status: "Inactive",
    createdAt: "2022-12-05",
  },
  {
    id: 3,
    avatar: "/images/user/user-19.jpg",
    fullName: "Zain Geidt",
    email: "zain.geidt@example.com",
    phone: "0901234567",
    status: "Active",
    createdAt: "2023-02-20",
  },
  {
    id: 4,
    avatar: "/images/user/user-20.jpg",
    fullName: "Abram Schleifer",
    email: "abram.schleifer@example.com",
    phone: "0934567890",
    status: "Active",
    createdAt: "2023-03-15",
  },
  {
    id: 5,
    avatar: "/images/user/user-21.jpg",
    fullName: "Carla George",
    email: "carla.george@example.com",
    phone: "0976543210",
    status: "Inactive",
    createdAt: "2022-11-28",
  },
];

export default function CustomerTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Avatar
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Full Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Phone
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Created At
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={customer.avatar}
                          alt={customer.fullName}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {customer.fullName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {customer.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {customer.phone}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={customer.status === "Active" ? "success" : "error"}
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {customer.createdAt}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">View</button>
                      <button className="text-yellow-600 hover:text-yellow-700 text-xs font-medium">Edit</button>
                      <button className="text-red-600 hover:text-red-700 text-xs font-medium">Delete</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
