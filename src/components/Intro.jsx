import React, { useEffect, useState } from 'react';
import { resumeData } from '../data/resume';

const Intro = ({ onComplete }) => {
    const [text, setText] = useState('');
    const fullText = "INITIALIZING SYSTEM...\nLOADING KERNEL...\nUSER AUTHENTICATED.\n\nWELCOME TO ANIRUDH CHINTHAKINDI'S PORTFOLIO.\n\nPRESS ANY KEY TO ENTER TERMINAL...";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) {
                clearInterval(interval);
            }
        }, 30); // Typing speed

        const handleKeyPress = () => {
            onComplete();
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('click', handleKeyPress);

        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('click', handleKeyPress);
        };
    }, [onComplete]);

    return (
        <div className="intro-container">
            <pre className="intro-text">{text}<span className="cursor">_</span></pre>
            <footer className="intro-footer">
                <p>© {new Date().getFullYear()} {resumeData.name}. Built with Love.</p>
            </footer>
        </div>
    );
};

export default Intro;
