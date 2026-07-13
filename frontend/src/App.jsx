import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PatientForm from './components/PatientForm';
import PredictionResult from './components/PredictionResult';
import FollowUpForm from './components/FollowUpForm';
import ReportView from './components/ReportView';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastProvider, useToast } from './components/Toast';

const API_URL = 'http://localhost:5000';

function AppContent() {
  const toast = useToast();
  
  // State: 'home', 'patient-form', 'prediction-result', 'followup-form', 'report-view'
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  
  const [medicalInputs, setMedicalInputs] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [followup, setFollowup] = useState(null);

  const handleStart = () => {
    setCurrentView('patient-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePatientSubmit = async (data) => {
    setMedicalInputs(data);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Prediction request failed');
      }
      
      const result = await response.json();
      setPrediction(result);
      
      // Artificial delay for UI smoothness
      setTimeout(() => {
        setIsLoading(false);
        setCurrentView('prediction-result');
        toast.success('Prediction completed successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
      
    } catch (err) {
      setIsLoading(false);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleContinueToFollowUp = () => {
    setCurrentView('followup-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFollowUpSubmit = (data) => {
    setFollowup(data);
    setCurrentView('report-view');
    toast.success('Report generated successfully!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setMedicalInputs(null);
    setPrediction(null);
    setFollowup(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      
      <main className="main-content">
        {currentView === 'home' && <Home onStart={handleStart} />}
        
        {currentView === 'patient-form' && (
          <PatientForm onSubmit={handlePatientSubmit} isLoading={isLoading} />
        )}
        
        {currentView === 'prediction-result' && prediction && (
          <PredictionResult result={prediction} onContinue={handleContinueToFollowUp} />
        )}
        
        {currentView === 'followup-form' && (
          <FollowUpForm onSubmit={handleFollowUpSubmit} />
        )}
        
        {currentView === 'report-view' && followup && (
          <ReportView 
            reportData={{ medicalInputs, prediction, followup }} 
            onRestart={handleRestart} 
          />
        )}
      </main>
      
      {isLoading && <LoadingSpinner message="Analyzing Medical Data..." />}
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
