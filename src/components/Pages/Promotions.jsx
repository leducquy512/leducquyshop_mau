import React from 'react';
import './Promotions.css';
import { useNavigate } from 'react-router-dom';

const promos = [
  {
    id: 1,
    title: 'Giảm 30% - Bộ sưu tập hè',
    subtitle: 'Áo + Quần - Chỉ trong tuần này',
    code: 'SUMMER30',
    img: '/src/img/lsp1/sp1.jpg'
  },
  {
    id: 2,
    title: 'Mua 1 Tặng 1 - Phụ kiện',
    subtitle: 'Túi, nón, dây chuyền',
    code: 'BUNDLE',
    img: '/src/img/lsp1/sp2.jpg'
  },
  {
    id: 3,
    title: 'Flash Sale: Đồng giá 99K',
    subtitle: 'Số lượng có hạn mỗi ngày',
    code: '99K',
    img: '/src/img/lsp1/sp3.jpg'
  }
];

const Promotions = () => {
  const navigate = useNavigate();

  return (
    <main className="promotions-page">
      <header className="promotions-hero">
        <h1>Khuyến mãi</h1>
        <p>Những ưu đãi tốt nhất dành cho bạn</p>
      </header>

      <section className="promotions-grid">
        {promos.map((p) => (
          <article className="promo-card" key={p.id}>
            <div className="promo-media">
              <img src={p.img} alt={p.title} onError={(e)=>{e.target.src='/src/img/logo.png'}}/>
            </div>
            <div className="promo-body">
              <h3>{p.title}</h3>
              <p className="promo-sub">{p.subtitle}</p>
              <div className="promo-actions">
                <span className="promo-code">Mã: <strong>{p.code}</strong></span>
                <button className="promo-btn" onClick={()=>navigate('/tat-ca-san-pham')}>Mua ngay</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Promotions;
