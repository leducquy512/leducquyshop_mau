import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { imageMap } from '../../utils/ProductImages';
import './DetailProduct.css';

const DetailProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(location.state?.product || null);
    const [isLoading, setIsLoading] = useState(!location.state?.product);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (product) return;
        
        const fetchProduct = async () => {
            try{    
                const response = await fetch('/products.json');
                if(!response.ok) {
                    throw new Error('Không thể tải thông tin sản phẩm');
                }

                const data = await response.json();
                const found = data.find((item) => String(item.id) === String(id));

                if(!found){
                    throw new Error('sản phẩm không tồn tại');
                }

                setProduct({
                    ...found,
                    image: imageMap[found.imageKey] || found.image
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id, product]);

    if (isLoading) {
        return <div className="detail-container">Đang tải chi tiết sản phẩm..</div>;
    }
    
    if (error){
        return <div className="detail-container">Lỗi: {error}</div>;
    }

    if (!product) {
        return null;
    }

    const currentPrice = Number(product.currentPrice ?? product.price ?? 0);
    const originalPrice = Number(product.price ?? product.originalPrice ?? 0);
    const discountPercent = originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : Number(product.discount) || 0;
    const hasDiscount = discountPercent > 0 && originalPrice > currentPrice;

    return (
        <div className="detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>

            <div className="detail-card">
                <div className="detail-image">
                    <img 
                        src={product.image || 'https://via.placeholder.com/500x350'}
                        alt={product.name}
                    />
                </div>

                <div className="detail-info">
                    <h2>{product.name}</h2>
                    <p className="detail-price">
                        <span className="current-price">{currentPrice.toLocaleString('vi-VN')} đ</span>
                        {hasDiscount && (
                            <>
                                <span className="original-price">{originalPrice.toLocaleString('vi-VN')} đ</span>
                                <span className="discount">-{discountPercent}%</span>
                            </>
                        )}
                    </p>

                    <div className="product-ram-ssd">
                    {product.sizes?.includes('S') && <button className="ram-ssd-tag">S</button>}
                    {product.sizes?.includes('M') && <button className="ram-ssd-tag">M</button>}
                    {product.sizes?.includes('L') && <button className="ram-ssd-tag">L</button>}
                    </div>

                    <div className="detail-meta">
                        {product.rating && <span>⭐ {product.rating}</span>}
                        {product.sold && <span>Đã Bán {product.sold}</span>}
                    </div>

                    <button className="buy-now-button" onClick={() => {
                        const savedCart = localStorage.getItem('cart');
                        const cart = savedCart ? JSON.parse(savedCart) : [];
                        const existingItemIndex = cart.findIndex(item => item.id === product.id);
                        if (existingItemIndex >= 0){
                            cart[existingItemIndex].quantity += 1;
                        } else {
                            cart.push({
                                ...product,
                                quantity: 1
                            });
                        }

                        localStorage.setItem('cart', JSON.stringify(cart));
                        window.dispatchEvent(new Event('cartUpdated'));

                        navigate('/cart');
                    }}>
                        Thêm vào giỏ hàng
                    </button>
                    <button className="go-cart-button" onClick={() => navigate('/cart')}>
                        Xem giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailProduct;