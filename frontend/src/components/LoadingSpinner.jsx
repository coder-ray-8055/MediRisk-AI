import './LoadingSpinner.css';

export default function LoadingSpinner({ message = 'Processing...' }) {
  return (
    <div className="spinner-overlay" id="loading-spinner">
      <div className="spinner-card">
        <div className="spinner-ring">
          <div className="spinner-heartbeat">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        </div>
        <p className="spinner-message">{message}</p>
        <div className="spinner-bar">
          <div className="spinner-bar-fill"></div>
        </div>
      </div>
    </div>
  );
}
