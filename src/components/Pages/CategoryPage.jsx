import React from 'react';
import './CategoryPage.css';
import ProductList from '../Products/ProductList';

const CategoryPage = ({ category, title }) => {
  const headerTitle = title || (category && category.name) || 'Danh mục';

  return (
    <main className="category-page">
      <header className="category-hero">
        <h1>{headerTitle}</h1>
        <p>Danh sách sản phẩm thuộc mục {headerTitle}</p>
      </header>

      <section className="category-list">
        <ProductList initialCategoryName={headerTitle} />
      </section>
    </main>
  );
};

export default CategoryPage;
