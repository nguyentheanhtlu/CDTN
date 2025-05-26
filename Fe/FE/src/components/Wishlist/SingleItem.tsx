import React from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

import { removeFromWishlist } from "@/redux/features/wishlist-slice";
import { addToCart } from "@/redux/features/cart-slice";

import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromWishlist = () => {
    dispatch(removeFromWishlist(item._id));
  };

  const handleAddToCart = () => {
    dispatch(addToCart(item._id, 1));
  };

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-10">
      <div className="min-w-[83px]">
        <button
          onClick={() => handleRemoveFromWishlist()}
          aria-label="nút xóa sản phẩm khỏi danh sách yêu thích"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1L1 13M1 1L13 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="min-w-[387px] flex items-center gap-5">
        <div className="max-w-[83px] w-full h-[83px]">
          <Image
            src={item.images[0]}
            alt="sản phẩm"
            width={83}
            height={83}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h5 className="font-medium text-dark mb-2.5">
            <Link href={`/product/${item._id}`}>{item.name}</Link>
          </h5>
          <p className="text-gray-6">{item.description}</p>
        </div>
      </div>

      <div className="min-w-[205px]">
        <p className="text-dark">{item.price.toLocaleString('vi-VN')} VNĐ</p>
      </div>

      <div className="min-w-[265px]">
        <p className="text-dark">Còn hàng</p>
      </div>

      <div className="min-w-[150px] text-right">
        <button
          onClick={() => handleAddToCart()}
          className="inline-block text-blue hover:text-dark"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
