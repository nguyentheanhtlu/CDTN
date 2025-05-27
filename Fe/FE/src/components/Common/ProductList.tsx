"use client";
import React from "react";
import { Product } from "@/types/product";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
  if (!products?.length) {
    return (
      <div className="text-center py-8">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className={'product-list grid-view'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <ProductItem key={product._id} item={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList; 
