import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import DetailProduct from './components/Products/DetailProduct';
import ProductList from "./components/Products/ProductList";
import Cart from "./components/Pages/Cart";
import LogIn from "./components/Pages/LogIn";
import Profile from "./components/Pages/Profile";
import Signup from "./components/Pages/Signup";
import Admin from './components/Pages/Admin';
import Promotions from './components/Pages/Promotions';
import About from './components/Pages/About';
import CategoryPage from './components/Pages/CategoryPage';
import './App.css';

function App() {
  const location = useLocation();
  const [showPromo, setShowPromo] = useState(false);
  const hideChrome =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/admin';

  useEffect(() => {
    if (hideChrome) return;
    const timer = window.setTimeout(() => setShowPromo(true), 400);
    return () => window.clearTimeout(timer);
  }, [hideChrome]);

  return (
    <>
      {!hideChrome && <Header />}

      {showPromo && (
        <div className="promo-modal-backdrop" onClick={() => setShowPromo(false)}>
          <div className="promo-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="promo-modal__close"
              onClick={() => setShowPromo(false)}
              aria-label="Đóng quảng cáo"
            >
              ×
            </button>
            <div className="promo-modal__content">
              <p className="promo-modal__tag">FLASH SALE</p>
              <h2 className="promo-modal__title">Ưu đãi khai trương</h2>
              <p className="promo-modal__text">Giảm đến 30% cho đơn hàng đầu tiên và miễn phí giao hàng toàn quốc.</p>
              <div className="promo-modal__offer">Nhập mã: WELCOME30</div>
              <button
                type="button"
                className="promo-modal__button"
                onClick={() => setShowPromo(false)}
              >
                Xem ngay
              </button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/khuyen-mai" element={<Promotions />} />
        <Route path="/ve-chung-toi" element={<About />} />
        <Route path="/tat-ca-san-pham" element={<CategoryPage title="Tất cả sản phẩm" />} />
        <Route path="/ao" element={<CategoryPage title="Áo" />} />
        <Route path="/quan" element={<CategoryPage title="Quần" />} />
        <Route path="/phu-kien" element={<CategoryPage title="Phụ kiện" />} />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}

export default App;