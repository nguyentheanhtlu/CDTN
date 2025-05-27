"use client";
import { ReduxProvider } from "@/redux/provider";
import { ModalProvider } from "@/app/context/QuickViewModalContext";
import { CartModalProvider } from "@/app/context/CartSidebarModalContext";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import Chatbot from "@/components/Common/Chatbot";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReduxProvider>
        <CartModalProvider>
          <ModalProvider>
            <PreviewSliderProvider>
              <Header />
              {children}
              <QuickViewModal />
              <CartSidebarModal />
              <PreviewSliderModal />
              <Chatbot />
            </PreviewSliderProvider>
          </ModalProvider>
        </CartModalProvider>
      </ReduxProvider>
      <ScrollToTop />
      <Footer />
    </>
  );
}
