"use client";
import React from "react";
import ProductList from "@/components/Common/ProductList";

const ShopPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <ProductList />
    </div>
  );
};

export default ShopPage; 