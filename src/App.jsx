import React, { useState } from 'react';
import Intro from './components/Intro';
import Terminal from './components/Terminal';
import GUI from './components/GUI';
import Gallery from './components/Gallery';

function App() {
    const [view, setView] = useState('intro'); // 'intro', 'terminal', 'gui', 'gallery'
    const [lastView, setLastView] = useState('terminal'); // To return from gallery

    const [galleryTargetId, setGalleryTargetId] = useState(null); // For direct terminal access

    const handleIntroComplete = () => {
        setView('terminal'); // Default to Terminal
    };

    const switchToTerminal = () => {
        setView('terminal');
    };

    const switchToGUI = () => {
        setView('gui');
    };

    const switchToGallery = () => {
        setGalleryTargetId(null);
        setLastView(view);
        setView('gallery');
    };

    const switchToGalleryWithImage = (imageId) => {
        setGalleryTargetId(imageId);
        setLastView(view);
        setView('gallery');
    };

    const backFromGallery = () => {
        setView(lastView);
    };

    return (
        <div className="app-container">
            <div className="crt-overlay"></div>
            <div className="scanline"></div>

            {view === 'intro' && <Intro onComplete={handleIntroComplete} />}

            {view !== 'intro' && (
                <div style={{ display: view === 'terminal' ? 'block' : 'none' }}>
                    <Terminal
                        onSwitchToGUI={switchToGUI}
                        onOpenImage={switchToGalleryWithImage}
                        isActive={view === 'terminal'}
                    />
                </div>
            )}

            {view === 'gui' && (
                <GUI
                    onSwitchToTerminal={switchToTerminal}
                    onSwitchToGallery={switchToGallery}
                />
            )}

            {view === 'gallery' && (
                <Gallery
                    onBack={backFromGallery}
                    initialTargetId={galleryTargetId}
                />
            )}
        </div>
    );
}

export default App;
