import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <div className="navbar__logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="navbar__title-group">
            <span className="navbar__title">AI Smart Hospital</span>
            <span className="navbar__subtitle">Diabetes Prediction System</span>
          </div>
        </div>
        <div className="navbar__badge">
          <span className="navbar__badge-dot"></span>
          AI Powered
        </div>
      </div>
    </nav>
  );
}
