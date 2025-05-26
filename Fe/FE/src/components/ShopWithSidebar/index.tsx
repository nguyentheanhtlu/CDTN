"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { apiService } from '@/services/api.service';
import ProductList from '../Common/ProductList';
import CategorySidebar from '../Shop/CategorySidebar';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

const ShopWithSidebar = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productSidebar, setProductSidebar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
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
      const response = await apiService.getProducts(
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
              {/* Product List */}
              <ProductList products={products.products}/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
