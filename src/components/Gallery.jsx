import React, { useState, useEffect } from 'react';
import { resumeData } from '../data/resume';

const Gallery = ({ onBack, initialTargetId }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (initialTargetId) {
            const target = resumeData.gallery.find(item => item.id === initialTargetId);
            if (target) {
                setSelectedImage(target);
            }
        }
    }, [initialTargetId]);

    const handleImageClick = (item) => {
        setImageLoaded(false);
        setSelectedImage(item);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
        setImageLoaded(false);
    };

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
                            <img src={item.src} alt={item.title} loading="lazy" />
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
                            {!imageLoaded && (
                                <div className="lightbox-loading">Loading image...</div>
                            )}
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.title}
                                onLoad={() => setImageLoaded(true)}
                                style={{ display: imageLoaded ? 'block' : 'none' }}
                            />
                            <div className="lightbox-caption">
                                <span className="lightbox-date">{selectedImage.date}</span>
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
