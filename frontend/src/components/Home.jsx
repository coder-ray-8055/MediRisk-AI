import { DISEASE_REGISTRY } from '../App';
import './Home.css';

export default function Home({ onSelectDisease }) {
  const diseases = Object.values(DISEASE_REGISTRY);

  return (
    <div className="home" id="home-page">

      {/* ═══ 1. HERO SECTION ═══ */}
      <section className="hero">
        <div className="hero__bg-orbs">
          <div className="hero__orb hero__orb--1"></div>
          <div className="hero__orb hero__orb--2"></div>
          <div className="hero__orb hero__orb--3"></div>
        </div>

        <div className="hero__content">
          <div className="hero__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            PyTorch Neural Network Powered
          </div>

          <h1 className="hero__title">
            AI-Powered Early<br />
            <span className="hero__title-gradient">Disease Risk Detection</span>
          </h1>

          <p className="hero__description">
            Get instant, accurate health risk assessments using our trained Artificial Neural Networks.
            Screen for multiple diseases with clinical-grade confidence — all in one platform.
          </p>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">3+</span>
              <span className="hero__stat-label">Disease Models</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-value">~90%</span>
              <span className="hero__stat-label">Accuracy</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-value">&lt;3s</span>
              <span className="hero__stat-label">Prediction Time</span>
            </div>
          </div>

          <a href="#disease-selector" className="btn btn--primary btn--xl hero__cta" id="get-started-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            Get Started — It&apos;s Free
          </a>
        </div>

        <div className="hero__visual">
          <div className="hero__card hero__card--1 animate-float-1">
            <div className="hero__card-icon" style={{ background: 'linear-gradient(135deg, #0F6FFF, #6C3CE9)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span className="hero__card-label">ANN Model</span>
            <span className="hero__card-value hero__card-value--active">Active</span>
          </div>
          <div className="hero__card hero__card--2 animate-float-2">
            <div className="hero__card-icon" style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 12l2 2 4-4"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>
            </div>
            <span className="hero__card-label">Accuracy</span>
            <span className="hero__card-value">89.4%</span>
          </div>
          <div className="hero__card hero__card--3 animate-float-3">
            <div className="hero__card-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
            </div>
            <span className="hero__card-label">PDF Report</span>
            <span className="hero__card-value">Instant</span>
          </div>
        </div>
      </section>

      {/* ═══ 2. DISEASE SELECTION ═══ */}
      <section className="disease-select" id="disease-selector">
        <div className="disease-select__header">
          <span className="section-badge">Select a Disease Model</span>
          <h2 className="section-title">Choose Your Health Assessment</h2>
          <p className="section-subtitle">
            Select a condition below to begin your AI-powered risk assessment. Each model is specifically trained on clinical datasets.
          </p>
        </div>

        <div className="disease-select__grid">
          {diseases.map((disease) => (
            <button
              key={disease.id}
              className={`disease-card ${!disease.available ? 'disease-card--disabled' : ''}`}
              onClick={() => disease.available && onSelectDisease(disease.id)}
              id={`disease-card-${disease.id}`}
              type="button"
            >
              <div className="disease-card__glow" style={{ background: disease.gradient }}></div>
              <div className="disease-card__icon" style={{ background: disease.gradient }}>
                <span>{disease.icon}</span>
              </div>
              <h3 className="disease-card__title">{disease.name}</h3>
              <p className="disease-card__desc">{disease.description}</p>
              <div className="disease-card__footer">
                <span className="disease-card__status" style={{ color: disease.color }}>
                  {disease.available ? '● Model Ready' : '○ Coming Soon'}
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
                </svg>
              </div>
            </button>
          ))}

          {/* Placeholder "More Coming" Card */}
          <div className="disease-card disease-card--coming-soon">
            <div className="disease-card__icon disease-card__icon--muted">
              <span>➕</span>
            </div>
            <h3 className="disease-card__title">More Models Coming</h3>
            <p className="disease-card__desc">
              We&apos;re training additional AI models for Liver Disease, Parkinson&apos;s, and more. Stay tuned!
            </p>
            <div className="disease-card__footer">
              <span className="disease-card__status disease-card__status--muted">○ In Development</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. HOW IT WORKS ═══ */}
      <section className="how-it-works" id="how-it-works">
        <div className="how-it-works__header">
          <span className="section-badge">Simple 3-Step Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            From clinical data input to a comprehensive PDF health report — in under 3 minutes.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-card__number">01</div>
            <div className="step-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <h3 className="step-card__title">Enter Clinical Metrics</h3>
            <p className="step-card__desc">
              Fill in your health data — glucose, blood pressure, BMI, cholesterol, and other disease-specific clinical markers.
            </p>
          </div>

          <div className="step-card__connector">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" strokeWidth="2"><polyline points="9,6 15,12 9,18"/></svg>
          </div>

          <div className="step-card">
            <div className="step-card__number">02</div>
            <div className="step-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3 className="step-card__title">AI Confidence Prediction</h3>
            <p className="step-card__desc">
              Our trained PyTorch ANN model processes your data and delivers an instant risk prediction with confidence scores.
            </p>
          </div>

          <div className="step-card__connector">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" strokeWidth="2"><polyline points="9,6 15,12 9,18"/></svg>
          </div>

          <div className="step-card">
            <div className="step-card__number">03</div>
            <div className="step-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h3 className="step-card__title">Follow-Up & PDF Report</h3>
            <p className="step-card__desc">
              Complete a quick lifestyle assessment, then download or print a comprehensive medical summary report.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 4. ABOUT / METHODOLOGY ═══ */}
      <section className="about" id="about-section">
        <div className="about__inner">
          <div className="about__text">
            <span className="section-badge">About Our Technology</span>
            <h2 className="section-title">Clinical-Grade AI Methodology</h2>
            <p className="about__desc">
              Our platform uses <strong>Artificial Neural Networks (ANNs)</strong> built with PyTorch, trained on
              publicly available clinical research datasets. Each model undergoes rigorous cross-validation to
              ensure reliable predictions.
            </p>
            <div className="about__features">
              <div className="about__feature">
                <div className="about__feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
                <div>
                  <strong>Data Privacy</strong>
                  <p>No data is stored or shared. All processing happens in your session.</p>
                </div>
              </div>
              <div className="about__feature">
                <div className="about__feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
                </div>
                <div>
                  <strong>Validated Models</strong>
                  <p>Each model is tested against clinical benchmarks with accuracy metrics.</p>
                </div>
              </div>
              <div className="about__feature">
                <div className="about__feature-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                </div>
                <div>
                  <strong>Instant Results</strong>
                  <p>Get predictions in seconds — no queues, no appointments needed.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="about__disclaimer-card">
            <div className="about__disclaimer-icon">⚕️</div>
            <h3>Medical Disclaimer</h3>
            <p>
              These AI predictions are designed for <strong>screening and educational purposes only</strong>.
              They do not constitute medical advice, diagnosis, or treatment.
              Always consult a qualified healthcare professional before making any medical decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 5. FOOTER ═══ */}
      <footer className="footer" id="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <span className="footer__title">DiabetePred<span className="footer__title-dot">.AI</span></span>
              <p className="footer__tagline">AI-Powered Disease Risk Assessment</p>
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__link-group">
              <h4>Platform</h4>
              <a href="#disease-selector">Disease Models</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#about-section">About</a>
            </div>
            <div className="footer__link-group">
              <h4>Models</h4>
              <a href="#disease-selector">Diabetes</a>
              <a href="#disease-selector">Heart Disease</a>
              <a href="#disease-selector">Kidney Disease</a>
            </div>
            <div className="footer__link-group">
              <h4>Legal</h4>
              <a href="#about-section">Medical Disclaimer</a>
              <a href="#about-section">Privacy</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} DiabetePred.AI — Built with PyTorch & React. For educational purposes only.</p>
          <p className="footer__disclaimer">AI predictions support — not replace — professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
