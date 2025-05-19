import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import Image from "next/image";

const Error = () => {
  return (
    <>
      <Breadcrumb title={"Lỗi"} pages={["lỗi"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              <Image
                src="/images/404.svg"
                alt="404"
                className="mx-auto mb-8 w-1/2 sm:w-auto"
                width={288}
                height={190}
              />

              <h2 className="font-medium text-dark text-xl sm:text-2xl mb-3">
                Xin lỗi, không tìm thấy trang
              </h2>

              <p className="max-w-[410px] w-full mx-auto mb-7.5">
                Trang bạn đang tìm kiếm có thể đã bị di chuyển, xóa hoặc không tồn tại.
              </p>

              <Link
                href="/"
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-blue py-3 px-9 ease-out duration-200 hover:bg-blue-dark"
              >
                Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Error;
