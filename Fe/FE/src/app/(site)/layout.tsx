"use client";
import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import Chatbot from "@/components/Common/Chatbot";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/store";

let timeoutId;
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    timeoutId = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeoutId)
  }, []);

  return (
    <>
      {loading ? (
        <PreLoader />
      ) : (
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
          <Toaster position="top-right" />
        </>
      )}
    </>
  );
}
