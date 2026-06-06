import React, { useState, useEffect } from 'react';
import './Banner.css';
import banner1Image from '../../img/banner1.jpg';
import banner2Image from '../../img/banner2.jpg';
import banner3Image from '../../img/banner3.jpg';
import banner4Image from '../../img/banner4.png';

const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const banners = [banner1Image, banner2Image, banner3Image, banner4Image];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % banners.length
            );
        }, 5000); // Chuyển ảnh mỗi 5 giây

        return () => clearInterval(interval);
    }, [banners.length]);

    return (
        <div className="banner-carousel">
            <div className="banner-wrapper">
                {banners.map((banner, index) => (
                    <div
                        key={index}
                        className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
                    >
                        <img
                            src={banner}
                            alt={`Banner ${index + 1}`}
                            className="banner-image"
                        />
                    </div>
                ))}
            </div>

            {/* Dots indicator (optional) */}
            <div className="banner-dots">
                {banners.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Banner;