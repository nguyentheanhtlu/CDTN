"use client";
import React, { useEffect, useState, use } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { addToCart } from '@/redux/features/cart-slice';
import { AppDispatch } from '@/redux/store';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const TABS = [
  { id: 'description', label: 'Mô tả' },
  { id: 'additional', label: 'Thông tin thêm' },
  { id: 'reviews', label: 'Đánh giá' },
];

const ProductDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('black');
  const [activeImg, setActiveImg] = useState(0);
  const productDetail = useSelector((state: RootState) => state.productDetailsReducer.value);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!productDetail) {
          const storedProduct = localStorage.getItem('productDetails');
          if (storedProduct) return;
          const response = await fetch(`http://localhost:5000/api/products/${id}`);
          if (!response.ok) throw new Error('Không thể tải thông tin sản phẩm');
          const data = await response.json();
          localStorage.setItem('productDetails', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id, productDetail]);

  const storedProduct = typeof window !== 'undefined' ? localStorage.getItem('productDetails') : null;
  const product = productDetail || (storedProduct ? JSON.parse(storedProduct) : null);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      dispatch(addToCart(product._id, quantity));
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error) {
      toast.error('Không thể thêm vào giỏ hàng');
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    try {
      // Thêm vào giỏ hàng trước
      dispatch(addToCart(product._id, quantity));
      // Chuyển đến trang thanh toán
      router.push('/checkout');
    } catch (error) {
      toast.error('Không thể thực hiện mua hàng');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p>Không tìm thấy thông tin sản phẩm</p>
        </div>
      </div>
    );
  }

  // Xử lý ảnh
  const previews = product.images?.length ? product.images : ['/images/placeholder.png'];

  return (
    <div className="container mx-auto px-4 py-8 mt-50">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Thư viện ảnh */}
        <div className="flex flex-col items-center md:w-1/2">
          <div className="relative w-full flex items-center justify-center bg-white rounded-lg shadow p-4 min-h-[350px]">
            <button className="absolute top-4 right-4 bg-white rounded-full shadow p-2 border border-gray-200 hover:bg-gray-100 transition" title="Phóng to">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#333" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6Z"/></svg>
            </button>
            <Image src={previews[activeImg]} alt={product.name} width={300} height={300} className="object-contain max-h-[300px]" />
          </div>
          <div className="flex gap-2 mt-4">
            {previews.map((img: string, idx: number) => (
              <button key={idx} onClick={() => setActiveImg(idx)} className={`border-2 rounded-lg p-1 w-16 h-16 flex items-center justify-center ${activeImg === idx ? 'border-blue-500' : 'border-gray-200'}`}> 
                <Image src={img} alt={`thumb-${idx}`} width={50} height={50} className="object-contain max-h-14" />
              </button>
            ))}
          </div>
        </div>
        {/* Thông tin sản phẩm */}
        <div className="md:w-1/2 flex flex-col gap-2">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`text-lg ${
                    index < Math.round(product.averageRating) ? 'text-yellow-light' : 'text-gray-200'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount || 0} đánh giá)</span>
            <span className="ml-2 text-green-600 text-sm font-medium">{product.isAvailable ? 'Còn hàng' : 'Hết hàng'}</span>
            {product.discount > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">Giảm {product.discount}%</span>
            )}
          </div>
          <div className="mb-2">
            <span className="text-xl font-bold text-blue-700 mr-2">{((product.price * (1 - product.discount / 100)).toLocaleString('vi-VN'))}₫</span>
            {product.discount > 0 && (
              <span className="text-gray-400 line-through text-base">{product.price.toLocaleString('vi-VN')}₫</span>
            )}
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-medium">Số lượng:</span>
            <button className="border rounded w-8 h-8" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span className="px-2">{quantity}</span>
            <button className="border rounded w-8 h-8" onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleBuyNow}
              className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              Mua ngay
            </button>
            <button 
              onClick={handleAddToCart}
              className="inline-flex font-medium text-white bg-dark py-3 px-7 rounded-md ease-out duration-200 hover:bg-dark-2"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mt-10">
        <div className="flex border-b">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-3 text-sm font-medium focus:outline-none ${activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'description' && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Thông số kỹ thuật:</h2>
              <p className="text-gray-700 text-sm">{product.description || 'Chưa có mô tả sản phẩm.'}</p>
            </div>
          )}
          {activeTab === 'additional' && (
            <div>
              <p className="text-gray-700 text-sm">Thông tin bổ sung sẽ được hiển thị ở đây.</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-yellow-light">{product.averageRating}</span>
                  <span className="text-3xl text-yellow-light ml-1">★</span>
                </div>
                <div className="text-gray-600">
                  <p className="font-medium">{product.reviewCount} đánh giá</p>
                  <p className="text-sm">Dựa trên {product.reviewCount} đánh giá của khách hàng</p>
                </div>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <span
                              key={index}
                              className={`text-xl ${
                                index < review.rating ? 'text-yellow-light' : 'text-gray-200'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Chưa có đánh giá nào cho sản phẩm này.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 