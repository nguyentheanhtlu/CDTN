"use client";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { apiService } from '@/services/api.service';
import { Category } from '@/types/category';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to load categories');
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Đang tải danh mục...</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Lỗi: {error}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
  //     <div className="container">
  //       <div className="row">
  //         <div className="col-12">
  //           <div className="section-title text-center mb-8">
  //             <h2 className="text-3xl font-bold text-gray-800 mb-2">Danh Mục Sản Phẩm</h2>
  //             <p className="text-gray-500 text-base">Chọn danh mục sản phẩm bạn muốn xem</p>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="flex flex-wrap justify-center gap-8">
  //         {categories.slice(0, 5).map((category) => (
  //           <Link
  //             key={category._id}
  //             href={`/shop/category/${category._id}`}
  //             className="group flex flex-col items-center w-40"
  //           >
  //             <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-md group-hover:bg-blue-100 transition mb-3">
  //               <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 text-center px-2">
  //                 {category.name}
  //               </span>
  //             </div>
  //             <div className="text-center text-gray-500 text-sm min-h-[32px]">{category.description}</div>
  //           </Link>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Categories;
