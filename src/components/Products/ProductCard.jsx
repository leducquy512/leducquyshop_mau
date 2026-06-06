import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './ProductCard.css';

const productsUrl = `${import.meta.env.BASE_URL}products.json`;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const originalPrice = Number(product.price ?? product.originalPrice ?? 0);
  const currentPrice = Number(product.currentPrice ?? product.price ?? 0);
  const computedDiscount = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const discountPercent = Number.isFinite(Number(product.discount)) && Number(product.discount) > 0
    ? Number(product.discount)
    : computedDiscount;
  const hasDiscount = discountPercent > 0;

  const formattedCurrentPrice = currentPrice.toLocaleString('vi-VN');
  const formattedOriginalPrice = originalPrice.toLocaleString('vi-VN');

  const handleAddToCart = () => {
    setError(null);
    try {
      const savedCart = localStorage.getItem('cart');
      const cart = savedCart ? JSON.parse(savedCart) : [];
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          ...product,
          quantity: 1
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setError('Không thêm được vào giỏ hàng');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="product-image"
        />
      </div>
      <h3 className="product-name">{product.name}</h3>
     <div className="product-ram-ssd">
  {product.sizes?.includes('S') && <button className="ram-ssd-tag">S</button>}
  {product.sizes?.includes('M') && <button className="ram-ssd-tag">M</button>}
  {product.sizes?.includes('L') && <button className="ram-ssd-tag">L</button>}
</div>
      <div className="product-pricing">
        <div className="current-price">{formattedCurrentPrice} đ</div>
        {hasDiscount && (
          <div className="original-price-section">
            <span className="original-price">{formattedOriginalPrice} đ</span>
            <span className="discount">-{discountPercent}%</span>
          </div>
        )}
      </div>

      <div className="product-rating-sales">
        <span className="rating">⭐ {product.rating}</span>
        <span className="sales">Đã bán {product.sold}</span>
      </div>

      <div className="product-actions">
        <button className="buy-now-button" onClick={handleBuyNow}>
          Mua ngay
        </button>
        <button className="compare-button" onClick={handleAddToCart}>
          Thêm vào giỏ hàng
        </button>
      </div>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
};

export default ProductCard;
