import React from 'react';
import './About.css';

const About = () => {
  return (
    <main className="about-page">
      <section className="about-hero">
        <h1>Về chúng tôi</h1>
        <p>SaleMini - Thương hiệu thời trang trực tuyến dành cho bạn.</p>
      </section>

      <section className="about-content">
        <div className="about-row">
          <div className="about-text">
            <h2>Sứ mệnh</h2>
            <p>Chúng tôi cung cấp trang phục và phụ kiện chất lượng với giá hợp lý, mang lại trải nghiệm mua sắm tiện lợi và thân thiện.</p>

            <h2>Tầm nhìn</h2>
            <p>Trở thành điểm đến mua sắm trực tuyến được yêu thích tại Việt Nam, chú trọng vào chất lượng và dịch vụ khách hàng.</p>

            <h2>Liên hệ</h2>
            <p>Email: support@salemini.example | Hotline: 1900-0000</p>
          </div>
          <div className="about-media">
            <img src="/src/img/logo.png" alt="SaleMini logo" />
          </div>
        </div>

        <div className="about-values">
          <article>
            <h3>Chất lượng</h3>
            <p>Chúng tôi chọn lọc sản phẩm đảm bảo tiêu chuẩn.</p>
          </article>
          <article>
            <h3>Dịch vụ</h3>
            <p>Hỗ trợ tận tâm, giao hàng nhanh chóng.</p>
          </article>
          <article>
            <h3>Bền vững</h3>
            <p>Hướng tới các lựa chọn thân thiện môi trường.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default About;
