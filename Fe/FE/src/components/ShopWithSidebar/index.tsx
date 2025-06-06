"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { apiService } from '@/services/api.service';
import ProductList from '../Common/ProductList';
import CategorySidebar from '../Shop/CategorySidebar';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const ShopWithSidebar = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any>({ products: [] });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productSidebar, setProductSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all<any>([
          apiService.getProducts(),
          apiService.getCategories()
        ]);
        setProducts(productsRes);
        setCategories(categoriesRes);
        setError(null);
      } catch (err) {
        setError('Failed to load shop data');
        console.error('Error loading shop data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategorySelect = async (categoryId: string | null) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      const response: any = await apiService.getProducts(
        categoryId ? { category: categoryId } : undefined
      );
      setProducts(response);
      setError(null);
    } catch (err) {
      setError('Failed to load products for selected category');
      console.error('Error loading category products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lọc sản phẩm dựa trên từ khóa tìm kiếm
  const filteredProducts = products.products?.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Tính toán phân trang
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Xử lý thay đổi số sản phẩm trên mỗi trang
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="shop-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-8">Loading shop data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-8 text-red-500">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        title={"Khám phá tất cả sản phẩm"}
        pages={["Cửa hàng", "/", "Cửa hàng có sidebar"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* Sidebar */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className="xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1"
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <div className="flex flex-col gap-6">
                {/* Category Sidebar */}
                <CategorySidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                />
              </div>
            </div>

            {/* Content */}
            <div className="xl:max-w-[870px] w-full">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Product List */}
              {currentProducts.length > 0 ? (
                <ProductList products={currentProducts} />
              ) : (
                <div className="text-center py-8">
                  {searchQuery ? 'Không tìm thấy sản phẩm phù hợp' : 'Không có sản phẩm nào'}
                </div>
              )}

              {/* Pagination */}
              {totalProducts > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Hiển thị</span>
                    <select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                      <option value={4}>4</option>
                      <option value={8}>8</option>
                      <option value={12}>12</option>
                      <option value={16}>16</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      của {totalProducts} sản phẩm
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
                    >
                      <ChevronsLeft size={20} />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
                    >
                      <ChevronsRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
