import './PredictionResult.css';

export default function PredictionResult({ result, disease, diseaseInfo, onContinue }) {
  const isHighRisk = result.predicted_class === 1;

  // Map disease-specific status titles
  const getRiskLabel = () => {
    if (disease === 'diabetes') {
      return isHighRisk ? 'Likely Diabetic' : 'Likely Non-Diabetic';
    } else if (disease === 'heart') {
      return isHighRisk ? 'High Cardiovascular Risk' : 'Low Cardiovascular Risk';
    } else if (disease === 'kidney') {
      return isHighRisk ? 'Chronic Kidney Disease Risk' : 'Low Chronic Kidney Disease Risk';
    }
    return isHighRisk ? 'High Risk' : 'Low Risk';
  };

  // Circular progress stroke calculation: circumference for r=45 is 2 * Math.PI * 45 = 282.74
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const confidenceVal = parseFloat(result.confidence) || 0;
  const strokeDashoffset = circumference - (confidenceVal / 100) * circumference;

  return (
    <div className="prediction-result animate-fade-in-up" id="prediction-result-page">
      <div className="result-card">
        <div className={`result-icon ${isHighRisk ? 'result-icon--danger' : 'result-icon--safe'}`}>
          {isHighRisk ? (
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

        <div className="confidence-meter-container">
          <div className="confidence-ring-wrapper">
            <svg width="120" height="120" viewBox="0 0 120 120" className="confidence-ring">
              <circle cx="60" cy="60" r={radius} stroke="var(--color-gray-200)" strokeWidth="8" fill="transparent" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke={isHighRisk ? 'var(--color-danger)' : 'var(--color-success)'}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="confidence-ring__circle"
              />
            </svg>
            <div className="confidence-ring__text">
              <span className="confidence-ring__percentage">{result.confidence}%</span>
              <span className="confidence-ring__label">Confidence</span>
            </div>
          </div>
        </div>

        <div className={`result-status ${isHighRisk ? 'result-status--danger' : 'result-status--safe'}`}>
          {getRiskLabel()}
        </div>

        <p className="result-message">{result.message}</p>

        <div className="result-stats">
          <div className="result-stat">
            <span className="result-stat__label">Status</span>
            <span className={`result-stat__value ${isHighRisk ? 'text-danger' : 'text-success'}`}>
              {result.status}
            </span>
          </div>
          <div className="result-stat">
            <span className="result-stat__label">Category</span>
            <span className="result-stat__value">{diseaseInfo?.shortName || 'Assessment'}</span>
          </div>
          <div className="result-stat">
            <span className="result-stat__label">Risk Level</span>
            <span className={`result-stat__value ${isHighRisk ? 'text-danger' : 'text-success'}`}>
              {isHighRisk ? 'High' : 'Low'}
            </span>
          </div>
        </div>

        <div className="result-actions">
          <button 
            className="btn btn--primary btn--lg" 
            style={{ backgroundColor: diseaseInfo?.color, boxShadow: `0 4px 14px ${diseaseInfo?.color}35` }}
            onClick={onContinue} 
            id="continue-followup-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Continue to Follow-Up Questions
          </button>
        </div>

        <p className="result-disclaimer">
          This screening tool represents an AI recommendation engine and is not a clinical substitute for a medical diagnosis.
        </p>
      </div>
    </div>
  );
}
