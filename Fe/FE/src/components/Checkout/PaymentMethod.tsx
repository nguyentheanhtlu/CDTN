import React, { useState } from "react";
import Image from "next/image";

const PaymentMethod = () => {
  const [payment, setPayment] = useState("VNPay");

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Phương thức thanh toán</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          {/* VNPay */}
          <label
            htmlFor="VNPay"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="payment"
                id="VNPay"
                className="sr-only"
                onChange={() => setPayment("VNPay")}
                checked={payment === "VNPay"}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "VNPay"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none ${
                payment === "VNPay"
                  ? "border-transparent bg-gray-2"
                  : "border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/vnpay.png" alt="VNPay" width={75} height={20}/>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Thanh toán qua VNPay</p>
                </div>
              </div>
            </div>
          </label>

          {/* MoMo */}
          <label
            htmlFor="MoMo"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="payment"
                id="MoMo"
                className="sr-only"
                onChange={() => setPayment("MoMo")}
                checked={payment === "MoMo"}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "MoMo"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none ${
                payment === "MoMo"
                  ? "border-transparent bg-gray-2"
                  : "border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/momo.png" alt="MoMo" width={75} height={20}/>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Thanh toán qua MoMo</p>
                </div>
              </div>
            </div>
          </label>

          {/* COD */}
          <label
            htmlFor="COD"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="payment"
                id="COD"
                className="sr-only"
                onChange={() => setPayment("COD")}
                checked={payment === "COD"}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "COD"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none ${
                payment === "COD"
                  ? "border-transparent bg-gray-2"
                  : "border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/cod.png" alt="COD" width={21} height={21}/>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Thanh toán khi nhận hàng (COD)</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
