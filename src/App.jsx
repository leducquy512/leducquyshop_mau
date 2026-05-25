import React from 'react';
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

function App() {
  const location = useLocation();
  const hideChrome =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/admin';

  return (
    <>
      {!hideChrome && <Header />}
      <Routes>
        <Route path="/" element={<ProductList />} />
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