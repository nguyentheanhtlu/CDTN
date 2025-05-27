import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";

const MailSuccess = () => {
  return (
    <>
      <Breadcrumb title={"Thành công"} pages={["thành công"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              <h2 className="font-bold text-blue text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
                Thành công!
              </h2>

              <h3 className="font-medium text-dark text-xl sm:text-2xl mb-3">
                Tin nhắn của bạn đã được gửi thành công
              </h3>

              <p className="max-w-[491px] w-full mx-auto mb-7.5">
                Cảm ơn bạn đã gửi tin nhắn cho chúng tôi. Chúng tôi sẽ kiểm tra email thường xuyên và cố gắng phản hồi sớm nhất có thể.
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

export default MailSuccess;
