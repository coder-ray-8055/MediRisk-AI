import './PredictionResult.css';

export default function PredictionResult({ result, onContinue }) {
  const isDiabetic = result.predicted_class === 1;

  return (
    <div className="prediction-result animate-fade-in-up" id="prediction-result-page">
      <div className="result-card">
        <div className={`result-icon ${isDiabetic ? 'result-icon--danger' : 'result-icon--safe'}`}>
          {isDiabetic ? (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
          )}
        </div>

        <h2 className="result-title">Prediction Complete</h2>

        <div className={`result-status ${isDiabetic ? 'result-status--danger' : 'result-status--safe'}`}>
          {isDiabetic ? 'Likely Diabetic' : 'Likely Non-Diabetic'}
        </div>

        <p className="result-message">{result.message}</p>

        <div className="result-stats">
          <div className="result-stat">
            <span className="result-stat__label">Status</span>
            <span className={`result-stat__value ${isDiabetic ? 'text-danger' : 'text-success'}`}>
              {result.status}
            </span>
          </div>
          <div className="result-stat">
            <span className="result-stat__label">Confidence</span>
            <span className="result-stat__value">{result.confidence}%</span>
          </div>
          <div className="result-stat">
            <span className="result-stat__label">Risk Level</span>
            <span className={`result-stat__value ${isDiabetic ? 'text-danger' : 'text-success'}`}>
              {isDiabetic ? 'High' : 'Low'}
            </span>
          </div>
        </div>

        <div className="result-actions">
          <button className="btn btn--primary btn--lg" onClick={onContinue} id="continue-followup-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Continue to Follow-Up Questions
          </button>
        </div>

        <p className="result-disclaimer">
          This is an AI-based screening result and should not be considered a medical diagnosis.
        </p>
      </div>
    </div>
  );
}
