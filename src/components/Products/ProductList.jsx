import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import Banner from '../Banner/Banner';
import { imageMap } from '../../utils/ProductImages';
import './ProductList.css';

const PRODUCTS_PER_PAGE = 6;
const jsonBase = import.meta.env.BASE_URL || '/';

const ProductList = ({ initialCategoryName = null }) => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState(null); // for category groups like "Phụ kiện"
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(`${jsonBase}products.json`),
                    fetch(`${jsonBase}category.json`)
                ]);
                if (!productsRes.ok) {
                    throw new Error('Không thể tải dữ liệu sản phẩm');
                }
                const data = await productsRes.json();
                const mappedProducts = data.map((item) => ({
                    ...item,
                    image: imageMap[item.imageKey] || item.image
                }));
                setProducts(mappedProducts);
                if (categoriesRes.ok) {
                    const catData = await categoriesRes.json();
                    setCategories(Array.isArray(catData) ? catData : []);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);
    const filteredProducts = (() => {
        if (searchQuery.trim()) {
            return products.filter(p => p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // No category selected -> show all
        if (selectedCategoryId == null && (!selectedCategoryIds || selectedCategoryIds.length === 0)) {
            return products;
        }

        // Single category
        if (selectedCategoryId != null) {
            return products.filter((p) => Number(p.idcategory) === Number(selectedCategoryId));
        }

        // Multiple categories (group)
        if (selectedCategoryIds && selectedCategoryIds.length > 0) {
            const idSet = new Set(selectedCategoryIds.map((id) => Number(id)));
            return products.filter((p) => idSet.has(Number(p.idcategory)));
        }

        return products;
    })();

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

    useEffect(() => {
        setCurrentPage((p) => Math.min(p, totalPages));
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategoryId]);

    // If an initial category name is provided (from Category pages), map it to one or more category ids
    useEffect(() => {
        if (!initialCategoryName || categories.length === 0) return;
        const target = initialCategoryName.toLowerCase().trim();
        const exact = categories.find((c) => c.name && c.name.toLowerCase() === target);
        if (exact) {
            setSelectedCategoryId(exact.id);
            setSelectedCategoryIds(null);
            return;
        }

        if (target.includes('tất cả') || target.includes('tat ca')) {
            setSelectedCategoryId(null);
            setSelectedCategoryIds(null);
            return;
        }

        // Map "phụ kiện" to several accessory categories (túi, thắt lưng, kính, mũ/nón)
        if (target.includes('phụ') || target.includes('phu')) {
            const accessoryKeywords = ['túi', 'tui', 'thắt', 'that', 'kính', 'kinh', 'mũ', 'mu', 'nón', 'non'];
            const matches = categories.filter((c) => {
                const name = (c.name || '').toLowerCase();
                return accessoryKeywords.some((kw) => name.includes(kw));
            }).map((c) => c.id);

            if (matches.length > 0) {
                setSelectedCategoryIds(matches);
                setSelectedCategoryId(null);
                return;
            }
        }

        // Fallback: try substring match against category names
        const partial = categories.filter((c) => (c.name || '').toLowerCase().includes(target)).map((c) => c.id);
        if (partial.length === 1) {
            setSelectedCategoryId(partial[0]);
            setSelectedCategoryIds(null);
        } else if (partial.length > 1) {
            setSelectedCategoryIds(partial);
            setSelectedCategoryId(null);
        } else {
            // no match -> show all
            setSelectedCategoryId(null);
            setSelectedCategoryIds(null);
        }
    }, [initialCategoryName, categories]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PRODUCTS_PER_PAGE;
    const visibleProducts = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
    const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
    const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

    if (isLoading) {
        return <div className="product-list-container">Đang tải sản phẩm...</div>;
    }

    if (error) {
        return <div className="product-list-container">Lỗi: {error}</div>;
    }
    
    return (
        <div className="product-list-container">
            <div className="product-list-layout">
                {categories.length > 0 && (
                    <aside className="product-list-sidebar" aria-label="Lọc theo danh mục">
                        <h2 className="product-list-sidebar__title">Danh mục</h2>
                        <ul className="product-list-sidebar__list">
                            <li>
                                <button
                                    type="button"
                                    className={`product-list-sidebar__btn${(selectedCategoryId == null && (!selectedCategoryIds || selectedCategoryIds.length === 0)) ? ' product-list-sidebar__btn--active' : ''}`}
                                    onClick={() => { setSelectedCategoryId(null); setSelectedCategoryIds(null); }}
                                >
                                    Tất cả
                                </button>
                            </li>

                            {categories.map((cat) => {
                                const isActive = selectedCategoryId === cat.id || (selectedCategoryIds && selectedCategoryIds.includes(cat.id));
                                return (
                                    <li key={cat.id}>
                                        <button
                                            type="button"
                                            className={`product-list-sidebar__btn${isActive ? ' product-list-sidebar__btn--active' : ''}`}
                                            onClick={() => { setSelectedCategoryId(cat.id); setSelectedCategoryIds(null); }}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </aside>
                )
                }
                <div className="product-list-main">
                    <Banner />
                    {searchQuery.trim() && (
                        <div className="product-list-search-header">
                            <h2>Kết quả tìm kiếm cho: <strong>"{searchQuery}"</strong></h2>
                            <p>{filteredProducts.length} sản phẩm được tìm thấy</p>
                        </div>
                    )}
                    {filteredProducts.length === 0 ? (
                        <p className="product-list-empty">
                            {searchQuery.trim() ? `Không tìm thấy sản phẩm với từ khóa "${searchQuery}". Thử từ khóa khác.` : 'Không có sản phẩm trong danh mục này.'}
                        </p>
                    ) : (
                        <div className="product-list">
                            {visibleProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    {filteredProducts.length > PRODUCTS_PER_PAGE && filteredProducts.length > 0 && (

                        <div className="product-list-pagination" role="navigation" aria-label="Phân trang sản phẩm">
                            <button
                                type="button"
                                className="product-list-pagination__btn"
                                onClick={goPrev}
                                disabled={safePage <= 1}
                            >
                                ← Trang trước
                            </button>

                            <span className="product-list-pagination__info">
                                Trang {safePage} / {totalPages}
                            </span>
                            <button
                                type="button"
                                className="product-list-pagination__btn"
                                onClick={goNext}
                                disabled={safePage >= totalPages}
                            >
                                Trang sau →
                            </button>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};
export default ProductList;