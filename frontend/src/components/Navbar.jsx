import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ currentView, diseaseInfo, onHomeClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__inner">
        <button className="navbar__brand" onClick={onHomeClick} type="button" id="navbar-home-btn">
          <div className="navbar__logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="navbar__title-group">
            <span className="navbar__title">DiabetePred<span className="navbar__title-dot">.AI</span></span>
            <span className="navbar__subtitle">Multi-Disease Risk Assessment</span>
          </div>
        </button>

        <div className="navbar__right">
          {currentView !== 'home' && diseaseInfo && (
            <div
              className="navbar__disease-badge"
              style={{ background: diseaseInfo.gradient }}
            >
              <span>{diseaseInfo.icon}</span>
              <span>{diseaseInfo.shortName}</span>
            </div>
          )}
          <div className="navbar__status-badge">
            <span className="navbar__badge-dot"></span>
            AI Powered
          </div>
        </div>
      </div>
    </nav>
  );
}
