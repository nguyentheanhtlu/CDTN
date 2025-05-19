"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import toast from 'react-hot-toast';

interface ProductItemProps {
  item: Product;
  viewMode?: 'grid' | 'list';
}

const ProductItem = ({ item, viewMode = 'grid' }: ProductItemProps) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // Get the first preview image or use a fallback
  const previewImage = item.images?.previews?.[0] || '/images/placeholder.png';

  // update the QuickView state
  const handleQuickView = () => {
    dispatch(updateQuickView(item));
  };

  // add to cart
  const handleAddToCart = () => {
    dispatch(addToCart(item._id, 1));
    toast.success('Added to cart');
  };

  const handleAddToWishlist = () => {
    dispatch(addItemToWishlist(item));
    toast.success('Added to wishlist');
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  const hasDiscount = item.discount > 0;
  const discountPercentage = item.discount;

  return (
    <div className={`product-item ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
      <div className="product-image">
        <Link href={`/product/${item._id}`}>
          <Image
            src={previewImage}
            alt={item.title}
            width={400}
            height={400}
            className="img-fluid"
          />
        </Link>
        {hasDiscount && (
          <span className="discount-badge">-{discountPercentage}%</span>
        )}
        <div className="product-actions">
          <button
            className="action-btn quick-view"
            onClick={handleQuickView}
            title="Quick View"
          >
            <i className="far fa-eye"></i>
          </button>
          <button
            className="action-btn wishlist"
            onClick={handleAddToWishlist}
            title="Add to Wishlist"
          >
            <i className="far fa-heart"></i>
          </button>
          <button
            className="action-btn cart"
            onClick={handleAddToCart}
            title="Add to Cart"
          >
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
      <div className="product-content">
        <h3 className="product-title">
          <Link href={`/product/${item._id}`}>{item.title}</Link>
        </h3>
        {viewMode === 'list' && (
          <p className="product-description">{item.description}</p>
        )}
        <div className="product-price">
          {hasDiscount ? (
            <>
              <span className="price-old">${item.price.toFixed(2)}</span>
              <span className="price-new">${item.discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="price">${item.price.toFixed(2)}</span>
          )}
        </div>
        <div className="product-rating">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`fas fa-star ${
                index < Math.round(item.averageRating) ? 'active' : ''
              }`}
            ></i>
          ))}
          <span className="rating-count">({item.reviews})</span>
        </div>
        {viewMode === 'list' && (
          <div className="product-meta">
            <span className="stock-status">
              {item.isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
            <span className="category">
              Category: {item.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
