'use client';

import { useState } from "react";
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

interface Order {
  id: number;
  name: string;
  customer: string;
  email: string;
  products: {
    name: string;
    quantity: number;
    price: string;
    image: string;
  }[];
  total: string;
  date: string;
  status: "Delivered" | "Pending" | "Canceled";
}

const initialOrders: Order[] = [
  {
    id: 1,
    name: "Order #12345",
    customer: "John Doe",
    email: "john@example.com",
    products: [
      {
        name: "MacBook Pro 13\"",
        quantity: 1,
        price: "$2399.00",
        image: "/images/product/product-01.jpg",
      }
    ],
    total: "$2399.00",
    date: "2024-03-15",
    status: "Delivered",
  },
  {
    id: 2,
    name: "Order #12346",
    customer: "Jane Smith",
    email: "jane@example.com",
    products: [
      {
        name: "Apple Watch Ultra",
        quantity: 1,
        price: "$879.00",
        image: "/images/product/product-02.jpg",
      }
    ],
    total: "$879.00",
    date: "2024-03-16",
    status: "Pending",
  },
  {
    id: 3,
    name: "Order #12347",
    customer: "Mike Johnson",
    email: "mike@example.com",
    products: [
      {
        name: "iPhone 15 Pro Max",
        quantity: 1,
        price: "$1869.00",
        image: "/images/product/product-03.jpg",
      }
    ],
    total: "$1869.00",
    date: "2024-03-16",
    status: "Canceled",
  },
];

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const handleStatusUpdate = (orderId: number, newStatus: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setStatusDialogOpen(false);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Pending":
        return "warning";
      case "Canceled":
        return "error";
      default:
        return "success";
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex justify-between">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Orders Management
          </h4>
          <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            Manage and track customer orders
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-boxdark-2 border-t border-stroke dark:border-strokedark">
            <TableRow>
              <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                Order Info
              </TableCell>
              <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                Customer
              </TableCell>
              <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                Total
              </TableCell>
              <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                Status
              </TableCell>
              <TableCell className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-b border-stroke dark:border-strokedark last:border-none hover:bg-gray-50 dark:hover:bg-boxdark-2">
                <TableCell className="py-5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={order.products[0].image}
                        alt={order.products[0].name}
                        width={48}
                        height={48}
                        className="rounded-lg border border-stroke dark:border-strokedark"
                      />
                    </div>
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        {order.name}
                      </h5>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-5 px-4">
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {order.customer}
                    </h5>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell className="py-5 px-4">
                  <p className="text-black dark:text-white font-medium">{order.total}</p>
                </TableCell>
                <TableCell className="py-5 px-4">
                  <Badge color={getStatusColor(order.status)}>
                    {order.status}
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
                      className="border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-primary dark:hover:bg-primary"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setStatusDialogOpen(true);
                      }}
                      className="border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-primary dark:hover:bg-primary"
                    >
                      Update Status
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="bg-white dark:bg-boxdark">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black dark:text-white">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Order Information</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  <p>Order ID: <span className="text-black dark:text-white">{selectedOrder.name}</span></p>
                  <p>Date: <span className="text-black dark:text-white">{selectedOrder.date}</span></p>
                  <p>Status: 
                    <Badge color={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Customer Information</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  <p>Name: <span className="text-black dark:text-white">{selectedOrder.customer}</span></p>
                  <p>Email: <span className="text-black dark:text-white">{selectedOrder.email}</span></p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Products</h3>
                <div className="space-y-4">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-stroke dark:border-strokedark">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="rounded-lg border border-stroke dark:border-strokedark"
                      />
                      <div>
                        <p className="font-medium text-black dark:text-white">{product.name}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {product.quantity} x {product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-stroke dark:border-strokedark">
                <h3 className="text-lg font-semibold text-black dark:text-white">Total Amount</h3>
                <p className="text-xl font-semibold text-black dark:text-white">{selectedOrder.total}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDetailsDialogOpen(false)}
              className="border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-primary dark:hover:bg-primary"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="bg-white dark:bg-boxdark">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black dark:text-white">Update Order Status</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">Current Status: 
                  <Badge color={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </p>
                <Select
                  onValueChange={(value: Order["status"]) =>
                    handleStatusUpdate(selectedOrder.id, value)
                  }
                  defaultValue={selectedOrder.status}
                >
                  <SelectTrigger className="w-full border-stroke dark:border-strokedark">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStatusDialogOpen(false)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-strokedark dark:text-gray-400 dark:hover:bg-boxdark-2"
                  >
                    Cancel
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
