import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = () => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hình nền"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-8">
                  <div className="flex-1">
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                      <a href="#"> iPhone 14 Plus & 14 Pro Max </a>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        Ưu đãi có thời hạn
                      </p>
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-heading-5 text-red text-sm">
                          {formatPrice(16990000)}
                        </span>
                        <span className="font-medium text-dark-4 line-through text-sm">
                          {formatPrice(24990000)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Image
                      src="/images/hero/hero-02.png"
                      alt="hình ảnh điện thoại"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-8">
                  <div className="flex-1">
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                      <a href="#"> Tai nghe không dây </a>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        Ưu đãi có thời hạn
                      </p>
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-heading-5 text-red text-sm">
                          {formatPrice(1699000)}
                        </span>
                        <span className="font-medium text-dark-4 line-through text-sm">
                          {formatPrice(2499000)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Image
                      src="/images/hero/hero-01.png"
                      alt="hình ảnh tai nghe"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
