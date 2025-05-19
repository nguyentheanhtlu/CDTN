"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import ProductItem from "@/components/Common/ProductItem";
import { apiService } from "@/services/api.service";
import { Product } from "@/types/product";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";

const RecentlyViewdItems = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load recently viewed products');
        console.error('Error loading recently viewed products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  if (loading) {
    return (
      <section className="overflow-hidden pt-17.5">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
          <div className="text-center py-8">Loading recently viewed products...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden pt-17.5">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
          <div className="text-center py-8 text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="flex items-center justify-between mb-7.5">
          <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
            Recently Viewed
          </h2>

          <div className="flex items-center gap-2.5">
            <button onClick={handlePrev} className="swiper-button-prev">
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
                  d="M15.4881 4.43057C15.1736 4.161 14.7001 4.19743 14.4305 4.51192L8.43054 11.5119C8.18983 11.7928 8.18983 12.2072 8.43054 12.4881L14.4305 19.4881C14.7001 19.8026 15.1736 19.839 15.4881 19.5695C15.8026 19.2999 15.839 18.8264 15.5695 18.5119L9.98783 12L15.5695 5.48811C15.839 5.17361 15.8026 4.70014 15.4881 4.43057Z"
                  fill=""
                />
              </svg>
            </button>

            <button onClick={handleNext} className="swiper-button-next">
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
                  d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
        </div>

        <Swiper
          ref={sliderRef}
          slidesPerView={4}
          spaceBetween={20}
          className="justify-between"
        >
          {products.map((item) => (
            <SwiperSlide key={item._id}>
              <ProductItem item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RecentlyViewdItems;
