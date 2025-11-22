import React from 'react';

const Output = ({ output }) => {
    // Function to render text with clickable links
    const renderTextWithLinks = (text) => {
        // Regular expressions for email and URLs
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        let parts = [text];

        // First, split by URLs
        parts = parts.flatMap(part => {
            if (typeof part === 'string') {
                const urlParts = part.split(urlRegex);
                return urlParts.map((p, i) => {
                    if (urlRegex.test(p)) {
                        return <a key={`url-${i}`} href={p} target="_blank" rel="noopener noreferrer" className="terminal-link">{p}</a>;
                    }
                    return p;
                });
            }
            return part;
        });

        // Then, split by emails
        parts = parts.flatMap(part => {
            if (typeof part === 'string') {
                const emailParts = part.split(emailRegex);
                return emailParts.map((p, i) => {
                    if (emailRegex.test(p)) {
                        return <a key={`email-${i}`} href={`mailto:${p}`} className="terminal-link">{p}</a>;
                    }
                    return p;
                });
            }
            return part;
        });

        return parts;
    };

    return (
        <div className="output-container">
            {output.map((item, index) => (
                <div key={index} className="output-item">
                    {item.type === 'command' && (
                        <div className="command-echo">
                            <span className="prompt-label">{item.prompt}</span>
                            {item.content}
                        </div>
                    )}
                    {item.type === 'text' && (
                        <div className="text-content">{renderTextWithLinks(item.content)}</div>
                    )}

                    {item.type === 'ascii' && (
                        <div className="ascii-art">{item.content}</div>
                    )}

                    {item.type === 'welcome' && (
                        <div className="welcome-text">{item.content}</div>
                    )}

                    {item.type === 'error' && (
                        <div className="error-content" style={{ color: 'red' }}>{item.content}</div>
                    )}

                    {item.type === 'list' && (
                        <ul className="list-content">
                            {item.content.map((li, i) => (
                                <li key={i}>{li}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Output;
