"use client";
import React from "react";
import { Product } from "@/types/product";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
}

const ProductList = ({ products, viewMode = 'grid' }: ProductListProps) => {
  if (!products?.length) {
    return (
      <div className="text-center py-8">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className={`product-list ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
      <div className="row">
        {products?.map((product) => (
          <div
            key={product._id}
            className={`col-12 ${
              viewMode === 'list' ? 'col-lg-12' : 'col-sm-6 col-lg-4'
            }`}
          >
            <ProductItem item={product} viewMode={viewMode} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 