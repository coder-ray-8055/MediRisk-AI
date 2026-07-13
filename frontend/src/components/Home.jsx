import './Home.css';

export default function Home({ onStart }) {
  return (
    <div className="home" id="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <div className="hero__badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            AI-Powered Health Screening
          </div>
          <h1 className="hero__title">
            Diabetes Risk <br />
            <span className="hero__title-accent">Assessment Portal</span>
          </h1>
          <p className="hero__description">
            Our advanced Artificial Neural Network analyzes your medical data to provide 
            an early diabetes risk assessment. Get a comprehensive health report in minutes.
          </p>
          <button className="hero__cta" id="start-assessment-btn" onClick={onStart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v-2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Start Assessment
          </button>
        </div>

        <div className="hero__visual">
          <div className="hero__card hero__card--1">
            <div className="hero__card-icon hero__card-icon--red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </div>
            <span className="hero__card-label">Heart Health</span>
            <span className="hero__card-value">Monitored</span>
          </div>

          <div className="hero__card hero__card--2">
            <div className="hero__card-icon hero__card-icon--green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="hero__card-label">ANN Model</span>
            <span className="hero__card-value">Active</span>
          </div>

          <div className="hero__card hero__card--3">
            <div className="hero__card-icon hero__card-icon--orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <span className="hero__card-label">PDF Report</span>
            <span className="hero__card-value">Generated</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features-section">
        <h2 className="features__title">How It Works</h2>
        <div className="features__grid">
          <div className="feature-card">
            <div className="feature-card__step">01</div>
            <div className="feature-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <h3>Enter Medical Data</h3>
            <p>Fill in your glucose, blood pressure, BMI, and other health metrics.</p>
          </div>

          <div className="feature-card">
            <div className="feature-card__step">02</div>
            <div className="feature-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3>AI Prediction</h3>
            <p>Our trained neural network processes your data and predicts diabetes risk.</p>
          </div>

          <div className="feature-card">
            <div className="feature-card__step">03</div>
            <div className="feature-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <h3>Follow-Up</h3>
            <p>Answer quick follow-up questions about symptoms, family history, and lifestyle.</p>
          </div>

          <div className="feature-card">
            <div className="feature-card__step">04</div>
            <div className="feature-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h3>Download Report</h3>
            <p>Get a professional medical report as a downloadable PDF document.</p>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="trust-banner">
        <div className="trust-banner__inner">
          <div className="trust-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>Secure & Private</span>
          </div>
          <div className="trust-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <span>Clinically Informed</span>
          </div>
          <div className="trust-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span>Results in Minutes</span>
          </div>
        </div>
      </section>
    </div>
  );
}
