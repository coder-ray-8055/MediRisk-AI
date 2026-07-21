import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PatientForm from './components/PatientForm';
import PredictionResult from './components/PredictionResult';
import FollowUpForm from './components/FollowUpForm';
import ReportView from './components/ReportView';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastProvider, useToast } from './components/Toast';
import './App.css';

const API_URL = 'http://localhost:5000';

/* ── Disease Registry ──────────────────────────────────────────────────
   Single source of truth for all diseases. To add a new disease,
   just add an entry here + its FIELDS/FOLLOWUP config in the
   relevant component.
   ────────────────────────────────────────────────────────────────────── */
export const DISEASE_REGISTRY = {
  diabetes: {
    id: 'diabetes',
    name: 'Diabetes Prediction',
    shortName: 'Diabetes',
    icon: '🩺',
    color: '#0F6FFF',
    gradient: 'linear-gradient(135deg, #0F6FFF, #6C3CE9)',
    endpoint: '/api/predict/diabetes',
    description: 'Analyze glucose, BMI, and metabolic markers to assess diabetes risk using our trained ANN.',
    available: true,
  },
  heart: {
    id: 'heart',
    name: 'Heart Disease Assessment',
    shortName: 'Heart Disease',
    icon: '❤️',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444, #F97316)',
    endpoint: '/api/predict/heart',
    description: 'Evaluate cardiovascular risk factors including ECG, cholesterol, and exercise tolerance.',
    available: true,
  },
  kidney: {
    id: 'kidney',
    name: 'Chronic Kidney Disease',
    shortName: 'Kidney Disease',
    icon: '🫘',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #06B6D4)',
    endpoint: '/api/predict/kidney',
    description: 'Screen for CKD risk using blood panel, urine markers, and clinical indicators.',
    available: true,
  },
};

function AppContent() {
  const toast = useToast();

  // View: 'home' | 'patient-form' | 'prediction-result' | 'followup-form' | 'report-view'
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  // Active disease key
  const [selectedDisease, setSelectedDisease] = useState(null);

  // Data state
  const [medicalInputs, setMedicalInputs] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [followup, setFollowup] = useState(null);

  const handleSelectDisease = (diseaseId) => {
    const disease = DISEASE_REGISTRY[diseaseId];
    if (!disease || !disease.available) return;
    setSelectedDisease(diseaseId);
    setMedicalInputs(null);
    setPrediction(null);
    setFollowup(null);
    setCurrentView('patient-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePatientSubmit = async (data) => {
    if (!selectedDisease) return;
    setMedicalInputs(data);
    setIsLoading(true);

    const disease = DISEASE_REGISTRY[selectedDisease];
    try {
      const response = await fetch(`${API_URL}${disease.endpoint}`, {
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
    setSelectedDisease(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestAnother = () => {
    setMedicalInputs(null);
    setPrediction(null);
    setFollowup(null);
    setSelectedDisease(null);
    setCurrentView('home');
    // Scroll to disease selector
    setTimeout(() => {
      const el = document.getElementById('disease-selector');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBackToHome = () => {
    handleRestart();
  };

  const diseaseInfo = selectedDisease ? DISEASE_REGISTRY[selectedDisease] : null;

  return (
    <>
      <Navbar
        currentView={currentView}
        diseaseInfo={diseaseInfo}
        onHomeClick={handleBackToHome}
      />

      <main className="main-content">
        {currentView === 'home' && (
          <Home onSelectDisease={handleSelectDisease} />
        )}

        {currentView === 'patient-form' && selectedDisease && (
          <PatientForm
            disease={selectedDisease}
            diseaseInfo={diseaseInfo}
            onSubmit={handlePatientSubmit}
            onBack={handleBackToHome}
            isLoading={isLoading}
          />
        )}

        {currentView === 'prediction-result' && prediction && (
          <PredictionResult
            result={prediction}
            disease={selectedDisease}
            diseaseInfo={diseaseInfo}
            onContinue={handleContinueToFollowUp}
          />
        )}

        {currentView === 'followup-form' && selectedDisease && (
          <FollowUpForm
            disease={selectedDisease}
            diseaseInfo={diseaseInfo}
            onSubmit={handleFollowUpSubmit}
            onBack={() => { setCurrentView('prediction-result'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {currentView === 'report-view' && followup && (
          <ReportView
            reportData={{ medicalInputs, prediction, followup }}
            disease={selectedDisease}
            diseaseInfo={diseaseInfo}
            onRestart={handleRestart}
            onTestAnother={handleTestAnother}
          />
        )}
      </main>

      {isLoading && <LoadingSpinner message={`Analyzing ${diseaseInfo?.shortName || 'Medical'} Data...`} />}
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
