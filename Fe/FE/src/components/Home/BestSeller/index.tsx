"use client";
import React, { useEffect, useState } from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import { apiService } from "@/services/api.service";
import { Product, ProductResponse } from "@/types/product";

const BestSeller = () => {
  const [products, setProducts] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        if (response) {
          setProducts(response);
          setError(null);
        } else {
          setError('Phản hồi không hợp lệ từ máy chủ');
        }
      } catch (err) {
        setError('Không thể tải sản phẩm bán chạy');
        console.error('Lỗi khi tải sản phẩm bán chạy:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  if (loading) {
    return (
      <section className="overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center py-8">Đang tải sản phẩm bán chạy...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center py-8 text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  if (!products || !products.products || products.products.length === 0) {
    return (
      <section className="overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center py-8">Không tìm thấy sản phẩm</div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="biểu tượng"
                width={17}
                height={17}
              />
              Tháng này
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Sản phẩm bán chạy
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {/* <!-- Best Sellers item --> */}
          {products.products
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 6)
            .map((item) => (
              <SingleItem item={item} key={item._id} />
            ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
