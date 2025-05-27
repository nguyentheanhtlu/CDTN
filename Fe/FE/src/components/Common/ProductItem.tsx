"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { addToCart } from "@/redux/actions/cart.action";

interface ProductItemProps {
  item: Product;
  viewMode?: 'grid' | 'list';
}

const ProductItem = ({ item, viewMode = 'grid' }: ProductItemProps) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Get the first preview image or use a fallback
  const previewImage = item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.png';

  // update the QuickView state
  const handleQuickView = () => {
    dispatch(updateQuickView(item));
    openModal();
  };

  // add to cart
  const handleAddToCart = () => {
    dispatch(addToCart({ productId: item._id, quantity: 1}));
    toast.success('Added to cart');
  };

  const handleAddToWishlist = () => {
    dispatch(addItemToWishlist(item));
    toast.success('Added to wishlist');
  };

  const handleProductDetail = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/products/${item._id}`);
      if (!response.ok) throw new Error('Failed to fetch product details');
      const productDetail = await response.json();
      
      // Lưu vào localStorage trước
      localStorage.setItem('productDetails', JSON.stringify(productDetail));
      
      // Sau đó dispatch vào Redux
      dispatch(updateproductDetails(productDetail));
      
      // Đợi một chút để đảm bảo Redux đã cập nhật
      setTimeout(() => {
        window.location.href = `/products/${item._id}`;
      }, 100);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    }
  };

  const hasDiscount = item.discount > 0;
  const discountedPrice = hasDiscount
    ? item.price * (1 - item.discount / 100)
    : item.price;

  return (
    <div className={`product-item  rounded-2xl shadow-lg p-5 flex flex-col items-center transition hover:shadow-2xl ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
      <div className="relative w-full flex flex-col items-center justify-center min-h-[220px]">
        <Link href={`/products/${item._id}`} className="block w-full" onClick={handleProductDetail}>
          <Image
            src={previewImage}
            alt={item.name}
            width={220}
            height={220}
            className="object-contain w-full h-44 mx-auto rounded-xl "
          />
        </Link>
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
            -{item.discount}%
          </span>
        )}
        <div className="flex justify-center gap-3 mt-3">
          <button
            className="border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-blue-50 hover:text-blue-600 transition"
            onClick={handleQuickView}
            title="Xem nhanh"
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
              <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
          </button>
          <button
            className="border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-pink-50 hover:text-pink-500 transition"
            onClick={handleAddToWishlist}
            title="Yêu thích"
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"/>
            </svg>
          </button>
          <button
            className="bg-blue-600 border border-gray-200  rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-blue-700 transition"
            onClick={handleAddToCart}
            title="Thêm vào giỏ"
          >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between w-full mt-4">
        <div className="flex items-center gap-1 mb-1 justify-center">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`text-lg ${
                index < Math.round(item.averageRating || 0) ? 'text-yellow-light' : 'text-gray-200'
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-xs text-gray-500 ml-1">({Array.isArray(item.reviews) ? item.reviews.length : (item.reviewCount || 0)})</span>
        </div>
        <h3 className="product-title font-semibold text-base leading-tight mb-2 min-h-[40px] text-center text-gray-900">
          <Link href={`/product/${item._id}`}>{item.name}</Link>
        </h3>
        <div className="product-price mb-2 flex items-end gap-2 justify-center">
          {hasDiscount ? (
            <>
              <span className="price-new text-blue-600 font-bold text-lg">{discountedPrice.toLocaleString('vi-VN')}₫</span>
              <span className="price-old text-gray-400 line-through text-sm">{item.price.toLocaleString('vi-VN')}₫</span>
            </>
          ) : (
            <span className="price text-blue-600 font-bold text-lg">{item.price.toLocaleString('vi-VN')}₫</span>
          )}
        </div>
        {viewMode === 'list' && (
          <div className="product-meta text-sm text-gray-500 flex flex-wrap gap-2">
            <span className="stock-status">
              {item.isAvailable ? 'Còn hàng' : 'Hết hàng'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
