"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import SingleItem from "./SingleItem";
import { clearWishlist } from "@/redux/features/wishlist-slice";

export const Wishlist = () => {
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const dispatch = useAppDispatch();

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  }; 

  return (
    <>
      <Breadcrumb title={"Danh sách yêu thích"} pages={["Danh sách yêu thích"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">Danh sách yêu thích của bạn</h2>
            {wishlistItems.length > 0 && (
              <button className="text-blue" onClick={handleClearWishlist}>Xóa tất cả</button>
            )}
          </div>

          <div className="bg-white rounded-[10px] shadow-1">
            {wishlistItems.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-6 text-lg">Chưa có sản phẩm yêu thích nào</p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  {/* <!-- table header --> */}
                  <div className="flex items-center py-5.5 px-10">
                    <div className="min-w-[83px]"></div>
                    <div className="min-w-[387px]">
                      <p className="text-dark">Sản phẩm</p>
                    </div>

                    <div className="min-w-[205px]">
                      <p className="text-dark">Đơn giá</p>
                    </div>

                    <div className="min-w-[265px]">
                      <p className="text-dark">Tình trạng</p>
                    </div>

                    <div className="min-w-[150px]">
                      <p className="text-dark text-right">Thao tác</p>
                    </div>
                  </div>

                  {/* <!-- wish item --> */}
                  {wishlistItems.map((item, key) => (
                    <SingleItem item={item} key={key} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
