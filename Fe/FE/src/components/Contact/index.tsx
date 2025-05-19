import React from "react";
import Breadcrumb from "../Common/Breadcrumb";

const Contact = () => {
  return (
    <>
      <Breadcrumb title={"Liên hệ"} pages={["liên hệ"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">
                  Thông tin liên hệ
                </p>
              </div>

              <div className="p-4 sm:p-7.5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex w-12 h-12 rounded-full bg-gray-1 items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-medium text-dark mb-1">Địa chỉ</h4>
                      <p className="text-dark-2">123 Đường ABC, Quận XYZ, TP.HCM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex w-12 h-12 rounded-full bg-gray-1 items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 8H17"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 13H13"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-medium text-dark mb-1">Email</h4>
                      <p className="text-dark-2">info@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex w-12 h-12 rounded-full bg-gray-1 items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.9965 11H16.0054"
                          stroke="#292D32"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.9955 11H12.0045"
                          stroke="#292D32"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.99451 11H8.00349"
                          stroke="#292D32"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-medium text-dark mb-1">Điện thoại</h4>
                      <p className="text-dark-2">+84 123 456 789</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">
                  Gửi tin nhắn cho chúng tôi
                </p>
              </div>

              <div className="p-4 sm:p-7.5">
                <form>
                  <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label htmlFor="name" className="block mb-2.5">
                        Họ và tên
                      </label>

                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Nhập họ và tên của bạn"
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <div className="w-full">
                      <label htmlFor="email" className="block mb-2.5">
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Nhập email của bạn"
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label htmlFor="subject" className="block mb-2.5">
                        Tiêu đề
                      </label>

                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        placeholder="Nhập tiêu đề tin nhắn"
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <div className="w-full">
                      <label htmlFor="phone" className="block mb-2.5">
                        Điện thoại
                      </label>

                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="Nhập số điện thoại của bạn"
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>
                  </div>

                  <div className="mb-7.5">
                    <label htmlFor="message" className="block mb-2.5">
                      Tin nhắn
                    </label>

                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      placeholder="Nhập nội dung tin nhắn của bạn"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex font-medium text-white text-custom-sm rounded-md bg-blue py-3 px-9 ease-out duration-200 hover:bg-blue-dark"
                  >
                    Gửi tin nhắn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
