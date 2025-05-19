import React from "react";

const Billing = () => {
  return (
    <div className="w-full">
      <h2 className="font-medium text-2xl text-dark mb-7.5">Thông tin thanh toán</h2>

      <div className="mb-5">
        <label htmlFor="address" className="block mb-2.5">
          Địa chỉ
          <span className="text-red">*</span>
        </label>

        <input
          type="text"
          name="address"
          id="address"
          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="city" className="block mb-2.5">
          Thành phố
          <span className="text-red">*</span>
        </label>

        <input
          type="text"
          name="city"
          id="city"
          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="state" className="block mb-2.5">
          Tỉnh/ Thành phố
          <span className="text-red">*</span>
        </label>

        <input
          type="text"
          name="state"
          id="state"
          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="phone" className="block mb-2.5">
          Số điện thoại <span className="text-red">*</span>
        </label>

        <input
          type="text"
          name="phone"
          id="phone"
          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        />
      </div>

      <div className="mb-5.5">
        <label htmlFor="email" className="block mb-2.5">
          Địa chỉ email <span className="text-red">*</span>
        </label>

        <input
          type="email"
          name="email"
          id="email"
          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        />
      </div>
    </div>
  );
};

export default Billing;
