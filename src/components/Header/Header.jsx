import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/logo.png'; // Giữ nguyên đường dẫn logo của bạn

const jsonBase = import.meta.env.BASE_URL || '/';

const Header = () => {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    
    // Các State & Ref xử lý tìm kiếm và menu của thầy
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const searchBoxRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const navigate = useNavigate();

    // Tự định nghĩa hàm lọc tìm kiếm ngay tại đây để không bị lỗi thiếu file utils của thầy
    const searchMatches = useMemo(() => {
        if (!searchQuery.trim()) return [];
        
        // Chuyển chữ về dạng thường để tìm kiếm không phân biệt hoa thường
        const query = searchQuery.toLowerCase().trim();
        
        return products
            .filter(product => product.name && product.name.toLowerCase().includes(query))
            .slice(0, 10); // Lấy tối đa 10 sản phẩm gợi ý
    }, [products, searchQuery]);

    // Đồng bộ giỏ hàng và thông tin user (Giữ nguyên logic gốc của bạn)
    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem('cart');
            if (!savedCart) {
                setCartCount(0);
            } else {
                try {
                    const cart = JSON.parse(savedCart);
                    const totalItems = cart.reduce(
                        (sum, item) => sum + (item.quantity || 0),
                        0
                    );
                    setCartCount(totalItems);
                } catch (error) {
                    console.error('Lỗi đọc giỏ hàng:', error);
                    setCartCount(0);
                }
            }
        };

        const updateCurrentUser = () => {
            const savedUser = localStorage.getItem('currentUser');
            if (!savedUser) {
                setCurrentUser(null);
                return;
            }
            try {
                const user = JSON.parse(savedUser);
                setCurrentUser(user);
            } catch (error) {
                console.error('Lỗi đọc thông tin người dùng:', error);
                setCurrentUser(null);
            }
        };

        updateCartCount();
        updateCurrentUser();

        window.addEventListener('cartUpdated', updateCartCount);
        window.addEventListener('userUpdated', updateCurrentUser);
        
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('userUpdated', updateCurrentUser);
        };
    }, []);

    // Tải danh sách sản phẩm từ file json để phục vụ ô tìm kiếm
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${jsonBase}products.json`);
                if (!res.ok) return;
                const data = await res.json();
                if (cancelled) return;
                
                // Giữ nguyên đường dẫn ảnh gốc trong file JSON của bạn, không qua hàm map của thầy nữa
                setProducts(data);
            } catch (err) {
                console.error('Lỗi tải sản phẩm cho tìm kiếm:', err);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Ẩn hộp tìm kiếm khi click ra ngoài
    useEffect(() => {
        if (!searchFocused) return;
        const onPointerDown = (e) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [searchFocused]);

    // Ẩn menu user khi click ra ngoài
    useEffect(() => {
        if (!userMenuOpen) return;
        const onPointerDown = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [userMenuOpen]);

    useEffect(() => {
        if (!currentUser) setUserMenuOpen(false);
    }, [currentUser]);

    // Các hàm xử lý hành động
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setUserMenuOpen(false);
        window.dispatchEvent(new Event('userUpdated'));
        navigate('/');
    };

    const goToProduct = (product) => {
        setSearchQuery('');
        setSearchFocused(false);
        navigate(`/product/${product.id}`, { state: { product } });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchFocused(false);
    };

    const userLabel = currentUser ? (currentUser.name || currentUser.user) : 'Đăng nhập';

    const coffeeMenuItems = [
        { text: 'Hành trình tách cà phê đậm', href: '/coffee/hanh-trinh-tach-ca-phe' },
        { text: 'Hạt cà phê Phúc Long', href: '/coffee/hat-ca-phe-phuc-long' },
        { text: 'Nghệ thuật pha chế', href: '/coffee/nghe-thuat-pha-che' }
    ];

    return (
        <header className="phuclong-header">
            {/* Top Section: Header Bar */}
            <div className="header-top-bar">
                <div className="header-top-content">
                    {/* Left: Free Delivery Info */}
                    <div className="header-delivery-info">
                        <span className="delivery-text">Free Delivery</span>
                        <i className="fas fa-phone delivery-icon"></i>
                        <span className="delivery-phone">1800 6779</span>
                        <div className="delivery-scooter">
                            <i className="fas fa-motorcycle"></i>
                        </div>
                    </div>

                    {/* Center: Logo button */}
                    <div className="header-logo-container">
                        <div className="phuclong-logo">
                            <button
                                type="button"
                                className="header-logo-btn"
                                onClick={() => navigate('/')}
                                aria-label="Về trang chủ"
                            >
                                <img src={logoImage} alt="Logo" className="header-logo-image" />
                            </button>
                        </div>
                    </div>

                    {/* Right: User Actions & Giỏ hàng */}
                    <div className="header-user-actions">
                        {currentUser ? (
                            <div className="header-user-menu" ref={userMenuRef}>
                                <button
                                    type="button"
                                    className="login-link header-user-menu__trigger"
                                    aria-expanded={userMenuOpen}
                                    aria-haspopup="true"
                                    onClick={() => setUserMenuOpen((o) => !o)}
                                >
                                    {userLabel}
                                    <i className={`fas fa-chevron-down header-user-menu__caret ${userMenuOpen ? 'is-open' : ''}`} aria-hidden />
                                </button>
                                {userMenuOpen && (
                                    <div className="header-user-dropdown" role="menu">
                                        <button
                                            type="button"
                                            className="header-user-dropdown__item"
                                            role="menuitem"
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                navigate('/profile');
                                            }}
                                        >
                                            Hồ sơ
                                        </button>
                                        {currentUser.role === 'staff' && (
                                            <button
                                                type="button"
                                                className="header-user-dropdown__item"
                                                role="menuitem"
                                                onClick={() => {
                                                    setUserMenuOpen(false);
                                                    navigate('/admin');
                                                }}
                                            >
                                                Quản trị
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="header-user-dropdown__item header-user-dropdown__item--logout"
                                            role="menuitem"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="login-link"
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập
                            </button>
                        )}
                        <span className="action-separator">|</span>
                        <div className="language-selector">
                            <span className="lang-active">VN</span>
                            <span className="lang-separator">|</span>
                            <span className="lang-option">EN</span>
                        </div>
                        <button
                            type="button"
                            className="cart-button"
                            onClick={() => navigate('/cart')}
                        >
                            <i className="fas fa-shopping-cart"></i>
                            <span>Giỏ hàng</span>
                            <span className="cart-badge">{cartCount}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dải tìm kiếm (Search Strip) của thầy */}
            <div className="header-search-strip" aria-label="Tìm kiếm">
                <div className="header-search-strip__inner" ref={searchBoxRef}>
                    <form
                        className="header-search__form"
                        onSubmit={handleSearchSubmit}
                        role="search"
                    >
                        <i className="fas fa-search header-search__icon" aria-hidden />
                        <input
                            type="search"
                            className="header-search__input"
                            placeholder="Bạn muốn mua gì.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            aria-label="Tìm kiếm sản phẩm"
                            aria-autocomplete="list"
                            aria-controls="header-search-suggestions"
                            autoComplete="off"
                        />
                        <button type="submit" className="header-search__submit">
                            Tìm
                        </button>
                    </form>
                    {searchFocused && searchQuery.trim().length > 0 && (
                        <ul
                            id="header-search-suggestions"
                            className="header-search__dropdown"
                            role="listbox"
                            aria-label="Gợi ý sản phẩm"
                        >
                            {searchMatches.length === 0 ? (
                                <li className="header-search__empty" role="status">
                                    Không tìm thấy sản phẩm gần giống. Thử từ khóa khác.
                                </li>
                            ) : (
                                searchMatches.map((p) => (
                                    <li key={p.id} role="presentation">
                                        <button
                                            type="button"
                                            className="header-search__option"
                                            role="option"
                                            onClick={() => goToProduct(p)}
                                        >
                                            <span className="header-search__thumb-wrap">
                                                <img
                                                    src={p.image || 'https://via.placeholder.com/88'}
                                                    alt=""
                                                    className="header-search__thumb"
                                                    loading="lazy"
                                                />
                                            </span>
                                            <span className="header-search__meta">
                                                <span className="header-search__name">{p.name}</span>
                                                {p.currentPrice && (
                                                    <span className="header-search__price">
                                                        {p.currentPrice}
                                                    </span>
                                                )}
                                            </span>
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Bottom Section: Navigation Bar (Giữ nguyên menu điều hướng của riêng bạn) */}
            <nav className="header-navigation" aria-label="Điều hướng chính">
                <div className="nav-content">
                    <a href="/" className="nav-link">TRANG CHỦ</a>

                    {/* CÀ PHÊ với Dropdown */}
                    <div
                        className="nav-item-with-dropdown"
                        onMouseEnter={() => setHoveredMenu('coffee')}
                        onMouseLeave={() => setHoveredMenu(null)}
                    >
                        <a href="/coffee" className={`nav-link ${hoveredMenu === 'coffee' ? 'active' : ''}`}>
                            CÀ PHÊ
                        </a>
                        {hoveredMenu === 'coffee' && (
                            <div className="dropdown-menu">
                                {coffeeMenuItems.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className="dropdown-item"
                                    >
                                        {item.text}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Toàn bộ menu gốc của bạn được giữ lại nguyên vẹn */}
                    <a href="/tat-ca-san-pham" className="nav-link">SẢN PHẨM</a>
                    <a href="/ao" className="nav-link">ÁO</a>
                    <a href="/quan" className="nav-link">QUẦN</a>
                    <a href="/phu-kien" className="nav-link">PHỤ KIỆN</a>
                    <a href="/khuyen-mai" className="nav-link">KHUYẾN MÃI</a>
                    <a href="/ve-chung-toi" className="nav-link">VỀ CHÚNG TÔI</a>
                </div>
            </nav>
        </header>
    );
};

export default Header;