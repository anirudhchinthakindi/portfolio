import React, { useState, useEffect } from 'react';
import { resumeData } from '../data/resume';

const GUI = ({ onSwitchToTerminal, onSwitchToGallery }) => {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            // Check if we are at the bottom of the page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                setActiveSection('gallery-preview');
                return;
            }

            const sections = document.querySelectorAll('.gui-section');
            let currentActive = '';
            const checkLine = window.innerHeight / 3;

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                // Check if the section contains the checkLine
                if (rect.top <= checkLine && rect.bottom > checkLine) {
                    currentActive = section.id;
                }
            });

            if (currentActive) {
                setActiveSection(currentActive);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className="gui-container professional-theme">
            <header className="gui-header">
                <div className="header-content">
                    <h1 className="gui-title">{resumeData.name}</h1>
                    <div className="header-info-row">
                        <div className="header-text-info">
                            <p className="gui-subtitle">Undergraduate Student at the University of Virginia</p>
                            <div className="contact-info">
                                <a href={`mailto:${resumeData.contact.email}`}>{resumeData.contact.email}</a>
                                <span>•</span>
                                <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                <span>•</span>
                                <span>{resumeData.contact.location}</span>
                            </div>
                        </div>
                        <div className="header-buttons">
                            <button className={activeSection === 'gallery-preview' ? 'nav-btn active gallery-btn' : 'nav-btn gallery-btn'} onClick={onSwitchToGallery}>Photo Gallery</button>
                            <button className="nav-btn terminal-toggle" onClick={onSwitchToTerminal}>
                                Terminal Mode
                            </button>
                        </div>
                    </div>
                </div>
                <nav className="gui-nav">
                    <a href="#education" className={activeSection === 'education' ? 'active' : ''}>Education</a>
                    <a href="#research" className={activeSection === 'research' ? 'active' : ''}>Research</a>
                    <a href="#skills" className={activeSection === 'skills' ? 'active' : ''}>Skills</a>
                    <a href="#leadership" className={activeSection === 'leadership' ? 'active' : ''}>Leadership</a>
                    <a href="#volunteering" className={activeSection === 'volunteering' ? 'active' : ''}>Volunteering</a>
                    <a href="#work" className={activeSection === 'work' ? 'active' : ''}>Work</a>
                    <a href="#awards" className={activeSection === 'awards' ? 'active' : ''}>Awards</a>
                </nav>
            </header>

            <main className="gui-content">
                <section id="education" className="gui-section">
                    <h2 className="section-title">Education</h2>
                    <div className="grid-col-1">
                        {resumeData.education.map((edu, index) => (
                            <div key={index} className="card education-card">
                                <div className="card-header">
                                    <h3>{edu.school}</h3>
                                    <span className="date">{edu.date}</span>
                                </div>
                                <div className="card-subheader">
                                    <h4>{edu.degree}</h4>
                                    <span>{edu.location}</span>
                                </div>
                                <div className="details">
                                    {Array.isArray(edu.details) ? (
                                        edu.details.map((line, i) => (
                                            <p key={i} style={{ margin: '5px 0' }}>{line}</p>
                                        ))
                                    ) : (
                                        <p>{edu.details}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="research" className="gui-section">
                    <h2 className="section-title">Research Experience</h2>
                    <div className="grid-col-1">
                        {resumeData.research.map((role, index) => (
                            <div key={index} className="card research-card">
                                <div className="card-header">
                                    <h3>{role.lab}, {role.institution}</h3>
                                    <span className="date">{role.date}</span>
                                </div>
                                <div className="card-subheader">
                                    <h4>{role.role}</h4>
                                    <span>{role.location}</span>
                                </div>
                                <ul className="details-list">
                                    {role.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="skills" className="gui-section">
                    <h2 className="section-title">Skills & Techniques</h2>
                    <div className="skills-grid">
                        {Object.entries(resumeData.skills).map(([category, skills], index) => (
                            <div key={index} className="skill-category">
                                <h3>{category}</h3>
                                <div className="skill-tags">
                                    {skills.map((skill, i) => (
                                        <span key={i} className="tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="leadership" className="gui-section">
                    <h2 className="section-title">Leadership & Service</h2>
                    <div className="grid-col-1">
                        {resumeData.leadership.map((item, index) => (
                            <div key={index} className="card">
                                {item.roles ? (
                                    <>
                                        <div className="card-header">
                                            <h3>{item.organization}</h3>
                                            <span className="date">{item.location}</span>
                                        </div>
                                        {item.roles.map((role, rIndex) => (
                                            <div key={rIndex} className="role-block" style={{ marginTop: rIndex > 0 ? '20px' : '10px', borderTop: rIndex > 0 ? '1px solid var(--border-color)' : 'none', paddingTop: rIndex > 0 ? '15px' : '0' }}>
                                                <div className="card-header" style={{ marginBottom: '5px' }}>
                                                    <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>{role.role}</h4>
                                                    <span className="date">{role.date}</span>
                                                </div>
                                                <p style={{ margin: '5px 0 0 0', fontSize: '0.95rem' }}>{role.details}</p>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <div className="card-header">
                                            <h3>{item.role}</h3>
                                            <span className="date">{item.date}</span>
                                        </div>
                                        <h4>{item.organization} | {item.location}</h4>
                                        <p>{item.details}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section id="volunteering" className="gui-section">
                    <h2 className="section-title">Volunteering</h2>
                    <div className="grid-col-1">
                        {resumeData.volunteering.map((role, index) => (
                            <div key={index} className="card">
                                <div className="card-header">
                                    <h3>{role.role}</h3>
                                    <span className="date">{role.date}</span>
                                </div>
                                <h4>{role.organization} | {role.location}</h4>
                                <p>{role.details}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="work" className="gui-section">
                    <h2 className="section-title">Work Experience</h2>
                    <div className="grid-col-1">
                        {resumeData.work.map((job, index) => (
                            <div key={index} className="card">
                                <div className="card-header">
                                    <h3>{job.role}</h3>
                                    <span className="date">{job.date}</span>
                                </div>
                                <h4>{job.organization} | {job.location}</h4>
                                <p>{job.details}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="awards" className="gui-section">
                    <h2 className="section-title">Awards & Certifications</h2>
                    <ul className="awards-list">
                        {resumeData.awards.map((award, index) => (
                            <li key={index}>
                                <strong>{award.name}</strong>
                                {award.description && (
                                    <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                                        <li style={{ listStyleType: 'circle' }}>{award.description}</li>
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                <section id="gallery-preview" className="gui-section">
                    <h2 className="section-title">Gallery</h2>
                    <div className="gallery-preview-grid">
                        {resumeData.gallery.slice(0, 4).map((item, index) => (
                            <div key={index} className="preview-item">
                                <img src={item.src} alt={item.title} />
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button className="nav-btn terminal-toggle" onClick={onSwitchToGallery} style={{ fontSize: '1.1rem', padding: '12px 24px' }}>
                            View Full Gallery
                        </button>
                    </div>
                </section>
            </main>

            <footer className="gui-footer">
                <p>© {new Date().getFullYear()} {resumeData.name}. Built with Love.</p>
            </footer>
        </div>
    );
};

export default GUI;
