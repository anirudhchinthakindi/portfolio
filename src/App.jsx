import React, { useState } from 'react';
import Intro from './components/Intro';
import Terminal from './components/Terminal';
import GUI from './components/GUI';
import Gallery from './components/Gallery';

function App() {
    const [view, setView] = useState('intro'); // 'intro', 'terminal', 'gui', 'gallery'
    const [lastView, setLastView] = useState('gui'); // To return from gallery

    const handleIntroComplete = () => {
        setView('gui'); // Default to GUI as requested
    };

    const switchToTerminal = () => {
        setView('terminal');
    };

    const switchToGUI = () => {
        setView('gui');
    };

    const switchToGallery = () => {
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

            {view === 'terminal' && (
                <Terminal onSwitchToGUI={switchToGUI} />
            )}

            {view === 'gui' && (
                <GUI
                    onSwitchToTerminal={switchToTerminal}
                    onSwitchToGallery={switchToGallery}
                />
            )}

            {view === 'gallery' && (
                <Gallery onBack={backFromGallery} />
            )}
        </div>
    );
}

export default App;
