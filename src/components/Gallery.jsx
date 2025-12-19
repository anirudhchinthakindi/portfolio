import React, { useState, useEffect } from 'react';
import { resumeData } from '../data/resume';

const Gallery = ({ onBack, initialTargetId }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (initialTargetId) {
            const target = resumeData.gallery.find(item => item.id === initialTargetId);
            if (target) {
                setSelectedImage(target);
            }
        }
    }, [initialTargetId]);

    return (
        <div className="gallery-page professional-theme">
            <header className="gallery-header">
                <button className="nav-btn back-btn" onClick={onBack}>← Back to Portfolio</button>
                <h1>Photo Gallery</h1>
            </header>

            <div className="gallery-grid">
                {resumeData.gallery.map((item, index) => (
                    <div key={index} className="gallery-item" onClick={() => setSelectedImage(item)}>
                        <div className="img-wrapper">
                            <img src={item.src} alt={item.title} loading="lazy" />
                        </div>
                        <div className="caption-preview">
                            <h3>{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="lightbox" onClick={() => setSelectedImage(null)}>
                    <div className="lightbox-wrapper" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedImage(null)}>×</button>
                        <div className="lightbox-content">
                            <img src={selectedImage.src} alt={selectedImage.title} />
                            <div className="lightbox-caption">
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
