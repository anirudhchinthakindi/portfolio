import React, { useState, useEffect, useCallback } from 'react';
import { resumeData } from '../data/resume';

const Gallery = ({ onBack, initialTargetId }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Helper to check if an item is a carousel (has images array)
    const isCarousel = (item) => item && Array.isArray(item.images) && item.images.length > 0;

    // Get the current image source for an item
    const getItemSrc = (item, index = 0) => {
        if (isCarousel(item)) {
            return item.images[index];
        }
        return item.src;
    };

    // Get total images count for an item
    const getImageCount = (item) => {
        if (isCarousel(item)) {
            return item.images.length;
        }
        return 1;
    };

    useEffect(() => {
        if (initialTargetId) {
            const target = resumeData.gallery.find(item => item.id === initialTargetId);
            if (target) {
                setSelectedImage(target);
                setCarouselIndex(0);
            }
        }
    }, [initialTargetId]);

    const handleImageClick = (item) => {
        setImageLoaded(false);
        setSelectedImage(item);
        setCarouselIndex(0);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
        setImageLoaded(false);
        setCarouselIndex(0);
    };

    const handlePrevImage = useCallback((e) => {
        e.stopPropagation();
        if (!selectedImage || !isCarousel(selectedImage)) return;
        setImageLoaded(false);
        setCarouselIndex((prev) =>
            prev === 0 ? selectedImage.images.length - 1 : prev - 1
        );
    }, [selectedImage]);

    const handleNextImage = useCallback((e) => {
        e.stopPropagation();
        if (!selectedImage || !isCarousel(selectedImage)) return;
        setImageLoaded(false);
        setCarouselIndex((prev) =>
            prev === selectedImage.images.length - 1 ? 0 : prev + 1
        );
    }, [selectedImage]);

    // Keyboard navigation for carousel
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage || !isCarousel(selectedImage)) return;
            if (e.key === 'ArrowLeft') {
                handlePrevImage(e);
            } else if (e.key === 'ArrowRight') {
                handleNextImage(e);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, handlePrevImage, handleNextImage]);

    return (
        <div className="gallery-page professional-theme">
            <header className="gallery-header">
                <button className="nav-btn back-btn" onClick={onBack}>← Back to Portfolio</button>
                <h1>Photo Gallery</h1>
            </header>

            <div className="gallery-grid">
                {resumeData.gallery.map((item, index) => (
                    <div key={index} className="gallery-item" onClick={() => handleImageClick(item)}>
                        <div className="img-wrapper">
                            <span className="gallery-date-overlay">{item.date}</span>
                            {isCarousel(item) && (
                                <span className="gallery-carousel-badge">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                        <path d="M4 6h2v12H4zm14 0h2v12h-2zM8 4h8v16H8z" />
                                    </svg>
                                    {item.images.length}
                                </span>
                            )}
                            <img src={getItemSrc(item)} alt={item.title} loading="lazy" />
                        </div>
                        <div className="caption-preview">
                            <h3>{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="lightbox" onClick={handleCloseModal}>
                    <div className="lightbox-wrapper" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={handleCloseModal}>×</button>
                        <div className="lightbox-content">
                            {isCarousel(selectedImage) && (
                                <button
                                    className="carousel-nav carousel-nav-prev"
                                    onClick={handlePrevImage}
                                    aria-label="Previous image"
                                >
                                    ‹
                                </button>
                            )}

                            {!imageLoaded && (
                                <div className="lightbox-loading">Loading image...</div>
                            )}
                            <img
                                src={getItemSrc(selectedImage, carouselIndex)}
                                alt={`${selectedImage.title}${isCarousel(selectedImage) ? ` - Image ${carouselIndex + 1}` : ''}`}
                                onLoad={() => setImageLoaded(true)}
                                style={{ display: imageLoaded ? 'block' : 'none' }}
                            />

                            {isCarousel(selectedImage) && (
                                <button
                                    className="carousel-nav carousel-nav-next"
                                    onClick={handleNextImage}
                                    aria-label="Next image"
                                >
                                    ›
                                </button>
                            )}

                            <div className="lightbox-caption">
                                <span className="lightbox-date">{selectedImage.date}</span>
                                {isCarousel(selectedImage) && (
                                    <div className="carousel-indicators">
                                        {selectedImage.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                className={`carousel-dot ${idx === carouselIndex ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImageLoaded(false);
                                                    setCarouselIndex(idx);
                                                }}
                                                aria-label={`Go to image ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                                <h2>{selectedImage.title}</h2>
                                <p>{selectedImage.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
