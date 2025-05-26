"use client";
import { loadCart } from "@/redux/actions/cart.action";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CartModalContextType {
  isCartModalOpen: boolean;
  openCartModal: () => void;
  closeCartModal: () => void;
}

const CartModalContext = createContext<CartModalContextType | undefined>(
  undefined
);

export const useCartModalContext = () => {
  const context = useContext(CartModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

export const CartModalProvider = ({ children }) => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { loggedIn } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (loggedIn) dispatch(loadCart())
  }, [loggedIn]);

  const openCartModal = () => {
    setIsCartModalOpen(true);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  return (
    <CartModalContext.Provider
      value={{ isCartModalOpen, openCartModal, closeCartModal }}
    >
      {children}
    </CartModalContext.Provider>
  );
};
