'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import ApiProducts from '@/api/products';
import ApiCategories from '@/api/categories';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: (string | File)[];
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface Category {
  _id: string;
  name: string;
}

interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [newProductImages, setNewProductImages] = useState<File[]>([]);
  const [editProductImages, setEditProductImages] = useState<File[]>([]);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedProductReviews, setSelectedProductReviews] = useState<Review[]>([]);
  const [selectedProductName, setSelectedProductName] = useState<string>("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await ApiProducts.getAllProducts();
      const productsWithStatus = response.data.products.map((product: Product) => ({
        ...product,
        status: product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock'
      }));
      setProducts(productsWithStatus);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ApiCategories.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.category && newProduct.stock) {
      try {
        await ApiProducts.createProduct({
          name: newProduct.name,
          description: newProduct.description || '',
          price: Number(newProduct.price),
          category: newProduct.category,
          stock: Number(newProduct.stock),
          images: newProductImages,
        });
        await fetchProducts();
        setNewProduct({});
        setNewProductImages([]);
        setIsAddDialogOpen(false);
        toast.success('Thêm sản phẩm thành công!');
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  const handleEditProduct = async () => {
    if (editingProduct && editingProduct.name && editingProduct.price && editingProduct.category && editingProduct.stock) {
      try {
        await ApiProducts.updateProduct(editingProduct._id, {
          name: editingProduct.name,
          description: editingProduct.description,
          price: Number(editingProduct.price),
          category: editingProduct.category,
          stock: Number(editingProduct.stock),
          images: editProductImages.length > 0 ? editProductImages : undefined,
        });
        await fetchProducts();
        setEditingProduct(null);
        setEditProductImages([]);
        setIsEditDialogOpen(false);
        toast.success('Cập nhật sản phẩm thành công!');
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleStartDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await ApiProducts.deleteProduct(productToDelete);
        await fetchProducts();
        setProductToDelete(null);
        setIsDeleteDialogOpen(false);
        toast.success('Xóa sản phẩm thành công!');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const fetchReviews = (product: Product) => {
    setSelectedProductName(product.name);
    const reviews = (product as any).reviews || [];
    setSelectedProductReviews(
      reviews.map((review: any) => ({
        _id: review._id,
        user: review.user?.fullName || 'Ẩn danh',
        rating: review.rating,
        comment: review.comment,
        createdAt: new Date(review.createdAt).toLocaleDateString('vi-VN'),
      }))
    );
    setIsReviewDialogOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Quản lý sản phẩm</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Thêm sản phẩm</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Thêm sản phẩm mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tên sản phẩm
                </label>
                <Input
                  id="name"
                  placeholder="Nhập tên sản phẩm"
                  value={newProduct.name || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mô tả
                </label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả sản phẩm"
                  value={newProduct.description || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Giá
                </label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Nhập giá"
                  value={newProduct.price || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Danh mục
                </label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="stock" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Số lượng
                </label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Nhập số lượng"
                  value={newProduct.stock || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="images" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hình ảnh sản phẩm
                </label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => setNewProductImages(e.target.files ? Array.from(e.target.files) : [])}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddProduct}>Lưu sản phẩm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Chỉnh sửa sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên sản phẩm
              </label>
              <Input
                id="edit-name"
                placeholder="Nhập tên sản phẩm"
                value={editingProduct?.name || ''}
                onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, name: e.target.value } : null)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mô tả
              </label>
              <Textarea
                id="edit-description"
                placeholder="Nhập mô tả sản phẩm"
                value={editingProduct?.description || ''}
                onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, description: e.target.value } : null)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-price" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Giá
              </label>
              <Input
                id="edit-price"
                type="number"
                placeholder="Nhập giá"
                value={editingProduct?.price || ''}
                onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, price: parseFloat(e.target.value) } : null)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Danh mục
              </label>
              <Select
                value={editingProduct?.category}
                onValueChange={(value) => setEditingProduct(editingProduct ? { ...editingProduct, category: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-stock" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Số lượng
              </label>
              <Input
                id="edit-stock"
                type="number"
                placeholder="Nhập số lượng"
                value={editingProduct?.stock || ''}
                onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, stock: parseInt(e.target.value, 10) } : null)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-images" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hình ảnh sản phẩm
              </label>
              <input
                id="edit-images"
                type="file"
                multiple
                accept="image/*"
                onChange={e => setEditProductImages(e.target.files ? Array.from(e.target.files) : [])}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              {editingProduct && editingProduct.images && editingProduct.images.length > 0 && editProductImages.length === 0 && (
                <div className="flex mt-2 -space-x-2">
                  {editingProduct.images.slice(0, 3).map((img, idx) => (
                    typeof img === 'string' ? (
                      <div key={idx} className={`w-10 h-10 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${idx > 0 ? 'relative -ml-4' : ''}`}>
                        <Image width={40} height={40} src={img} alt={`Ảnh ${idx + 1}`} className="object-cover" />
                      </div>
                    ) : null
                  ))}
                  {editingProduct.images.length > 3 && (
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 relative -ml-4">
                      <span className="text-xs text-gray-600 dark:text-gray-400">+{editingProduct.images.length - 3}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditProduct}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 dark:text-gray-300">
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Sản phẩm
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Danh mục
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Giá
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Số lượng
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Trạng thái
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      {product.images && product.images.length > 0 && (
                        <div className="flex -space-x-2">
                          {product.images.slice(0, 2).map((image, index) => (
                            typeof image === 'string' ? (
                              <div 
                                key={index} 
                                className={`w-10 h-10 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${
                                  index > 0 ? 'relative -ml-4' : ''
                                }`}
                              >
                                <Image
                                  width={40}
                                  height={40}
                                  src={image}
                                  alt={`${product.name} - Ảnh ${index + 1}`}
                                  className="object-cover"
                                />
                              </div>
                            ) : null
                          ))}
                          {product.images.length > 2 && (
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 relative -ml-4">
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                +{product.images.length - 2}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {product.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {product.description}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {categories.find(c => c._id === product.category)?.name || product.category}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {product.price.toLocaleString('vi-VN')}đ
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {product.stock}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status === 'In Stock' ? 'Còn hàng' : 
                       product.status === 'Low Stock' ? 'Sắp hết hàng' : 'Hết hàng'}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => handleStartEdit(product)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStartDelete(product._id)}
                      >
                        Xóa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => fetchReviews(product)}
                      >
                        Xem đánh giá
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Dialog xem đánh giá */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Đánh giá sản phẩm: {selectedProductName}</DialogTitle>
          </DialogHeader>
          <div className="py-2 max-h-[400px] overflow-y-auto">
            {selectedProductReviews.length === 0 ? (
              <div className="text-gray-500 text-center">Chưa có đánh giá nào.</div>
            ) : (
              selectedProductReviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800 dark:text-white/90">{review.user}</span>
                    <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <span className="text-xs text-gray-400 ml-auto">{review.createdAt}</span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-200">{review.comment}</div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 