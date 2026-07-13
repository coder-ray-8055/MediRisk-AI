import { useState } from 'react';
import { useToast } from './Toast';
import './ReportView.css';

const API_URL = 'http://localhost:5000';

export default function ReportView({ reportData, onRestart }) {
  const toast = useToast();
  const [downloading, setDownloading] = useState(false);

  const prediction = reportData.prediction || {};
  const medicalInputs = reportData.medicalInputs || {};
  const followup = reportData.followup || {};
  const general = followup.general || {};
  const symptoms = followup.symptoms || {};
  const family = followup.family || {};
  const lifestyle = followup.lifestyle || {};
  const isDiabetic = prediction.predicted_class === 1;

  const symptomLabels = {
    excessive_thirst: 'Excessive Thirst',
    frequent_urination: 'Frequent Urination',
    sudden_weight_loss: 'Sudden Weight Loss',
    fatigue: 'Fatigue',
    blurred_vision: 'Blurred Vision',
    slow_wound_healing: 'Slow Wound Healing',
    frequent_infections: 'Frequent Infections',
    numbness: 'Numbness in Hands/Feet',
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const payload = {
        age: general.age || medicalInputs.age,
        gender: general.gender,
        pregnancies: medicalInputs.pregnancies,
        followup_pregnancies: general.pregnancies,
        reason_for_visit: general.reason,
        glucose: medicalInputs.glucose,
        blood_pressure: medicalInputs.blood_pressure,
        skin_thickness: medicalInputs.skin_thickness,
        insulin: medicalInputs.insulin,
        bmi: medicalInputs.bmi,
        diabetes_pedigree: medicalInputs.diabetes_pedigree,
        prediction_status: prediction.status,
        confidence: prediction.confidence,
        predicted_class: prediction.predicted_class,
        symptoms, family_diabetic_count: family.diabetic_count || '0',
        lifestyle,
      };
      const response = await fetch(`${API_URL}/api/generate_report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      const blob = await response.blob();
      if (blob.size < 100) throw new Error('Generated PDF appears to be empty');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AI_Smart_Hospital_Diabetes_Report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!');
    } catch (err) {
      toast.error(`Download failed: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => { window.print(); toast.info('Print dialog opened.'); };

  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : 'N/A';

  const SymptomRow = ({ label, value }) => (
    <div className="report-symptom-row">
      <span className="report-symptom-label">{label}</span>
      <span className={`report-symptom-badge ${value === 'yes' ? 'report-symptom-badge--yes' : 'report-symptom-badge--no'}`}>
        {value === 'yes' ? '✓ Yes' : '✗ No'}
      </span>
    </div>
  );

  const riskSummary = (() => {
    const f = [];
    if (isDiabetic) f.push('the ANN model predicted a diabetic outcome');
    const sc = Object.values(symptoms).filter(v => v === 'yes').length;
    if (sc > 0) f.push(`the patient reports ${sc} diabetes-related symptom(s)`);
    if (parseInt(family.diabetic_count) > 0) f.push(`${family.diabetic_count} family member(s) have a diabetes diagnosis`);
    if (lifestyle.exercise === 'no') f.push('the patient does not exercise regularly');
    if (lifestyle.smoking === 'yes') f.push('the patient is a smoker');
    if (lifestyle.alcohol === 'yes') f.push('the patient consumes alcohol regularly');
    return f.length > 0
      ? `Based on the provided information, ${f.join(', ')}. These factors suggest an elevated risk profile that warrants professional medical evaluation.`
      : 'Based on the provided information, the patient shows a relatively low-risk profile. However, regular health check-ups and a healthy lifestyle are always recommended.';
  })();

  const recommendations = [
    'Maintain a healthy, balanced diet rich in whole grains, vegetables, and lean protein.',
    'Engage in regular physical exercise (at least 150 minutes per week).',
    'Monitor blood sugar levels regularly, especially if risk factors are present.',
    'Consult a qualified healthcare professional if symptoms persist or worsen.',
    'Maintain a healthy weight appropriate for your age and height.',
    'Avoid smoking and limit tobacco usage.',
    'Limit consumption of sugary drinks, processed foods, and refined carbohydrates.',
  ];

  return (
    <div className="report-page animate-fade-in-up" id="report-page">
      <div className="report-banner">
        <div className="report-banner__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <h1 className="report-banner__title">AI Smart Hospital</h1>
        <h2 className="report-banner__subtitle">Diabetes Health Assessment Report</h2>
        <p className="report-banner__date">{new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })} • {new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}</p>
      </div>

      <div className="report-actions report-actions--top">
        <button className="btn btn--primary btn--md" onClick={handleDownloadPDF} disabled={downloading} id="download-pdf-btn">
          {downloading ? <><span className="btn-spinner"></span>Generating PDF...</> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download PDF</>}
        </button>
        <button className="btn btn--outline btn--md" onClick={handlePrint} id="print-report-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Print Report
        </button>
      </div>

      {/* 1. Patient Info */}
      <div className="report-section"><h3 className="report-section__title"><span className="report-section__number">1</span>Patient Information</h3>
        <div className="report-info-grid">
          <div className="report-info-item"><span className="report-info-label">Age</span><span className="report-info-value">{general.age || medicalInputs.age} years</span></div>
          <div className="report-info-item"><span className="report-info-label">Gender</span><span className="report-info-value">{cap(general.gender)}</span></div>
          <div className="report-info-item"><span className="report-info-label">Pregnancies</span><span className="report-info-value">{general.gender === 'male' ? '0 (Male)' : general.pregnancies || medicalInputs.pregnancies}</span></div>
          <div className="report-info-item"><span className="report-info-label">Reason for Visit</span><span className="report-info-value">{general.reason || 'N/A'}</span></div>
        </div>
      </div>

      {/* 2. ANN Prediction */}
      <div className="report-section"><h3 className="report-section__title"><span className="report-section__number">2</span>ANN Prediction Result</h3>
        <div className={`report-prediction-card ${isDiabetic ? 'report-prediction-card--danger' : 'report-prediction-card--safe'}`}>
          <div className="report-prediction-status">{prediction.status}</div>
          <div className="report-prediction-detail">Likelihood: <strong>{isDiabetic ? 'High Risk' : 'Low Risk'}</strong> &nbsp;|&nbsp; Confidence: <strong>{prediction.confidence}%</strong></div>
        </div>
      </div>

      {/* 3. Medical Inputs */}
      <div className="report-section"><h3 className="report-section__title"><span className="report-section__number">3</span>Medical Inputs</h3>
        <div className="report-info-grid report-info-grid--4">
          {[['Pregnancies',medicalInputs.pregnancies,''],['Glucose',medicalInputs.glucose,'mg/dL'],['Blood Pressure',medicalInputs.blood_pressure,'mm Hg'],['Skin Thickness',medicalInputs.skin_thickness,'mm'],['Insulin',medicalInputs.insulin,'mu U/ml'],['BMI',medicalInputs.bmi,'kg/m²'],['Diabetes Pedigree',medicalInputs.diabetes_pedigree,''],['Age',medicalInputs.age,'years']].map(([l,v,u]) => (
            <div className="report-metric-card" key={l}><span className="report-metric-label">{l}</span><span className="report-metric-value">{v} <small>{u}</small></span></div>
          ))}
        </div>
      </div>

      {/* 4. Symptoms */}
      <div className="report-section"><h3 className="report-section__title"><span className="report-section__number">4</span>Patient Symptoms</h3>
        <div className="report-symptoms-grid">{Object.entries(symptomLabels).map(([k,l]) => <SymptomRow key={k} label={l} value={symptoms[k]||'no'}/>)}</div>
      </div>

      {/* 5. Family */}
      <div className="report-section"><h3 className="report-section__title"><span className="report-section__number">5</span>Family History</h3>
        <div className="report-text-box"><strong>{family.diabetic_count||'0'}</strong> family member(s) diagnosed with diabetes.{parseInt(family.diabetic_count)>0&&' This increases the patient\'s risk factor.'}</div>
      </div>

      {/* 6. Lifestyle */}
      <div className="report-section"><h3 className="report-section__title"><span className="report-section__number">6</span>Lifestyle Assessment</h3>
        <div className="report-info-grid">
          <div className="report-info-item"><span className="report-info-label">Exercise</span><span className="report-info-value">{cap(lifestyle.exercise)}</span></div>
          <div className="report-info-item"><span className="report-info-label">Days/Week</span><span className="report-info-value">{lifestyle.exercise_days||'N/A'}</span></div>
          <div className="report-info-item"><span className="report-info-label">Sugary Food</span><span className="report-info-value">{cap(lifestyle.sugary_food)}</span></div>
          <div className="report-info-item"><span className="report-info-label">Smoking</span><span className="report-info-value">{cap(lifestyle.smoking)}</span></div>
          <div className="report-info-item"><span className="report-info-label">Alcohol</span><span className="report-info-value">{cap(lifestyle.alcohol)}</span></div>
        </div>
      </div>

      {/* 7. Risk Summary */}
      <div className="report-section"><h3 className="report-section__title"><span className="report-section__number">7</span>Risk Summary</h3>
        <div className="report-text-box report-text-box--highlight">{riskSummary}</div>
      </div>

      {/* 8. Recommendations */}
      <div className="report-section"><h3 className="report-section__title"><span className="report-section__number">8</span>Recommendations</h3>
        <div className="report-recommendations">{recommendations.map((r,i)=><div className="report-rec-item" key={i}><span className="report-rec-number">{i+1}</span><span>{r}</span></div>)}</div>
      </div>

      {/* 9. Disclaimer */}
      <div className="report-section report-section--disclaimer"><h3 className="report-section__title"><span className="report-section__number">9</span>Disclaimer</h3>
        <p className="report-disclaimer-text">This AI prediction is intended for educational and screening purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.</p>
      </div>

      <div className="report-actions report-actions--bottom">
        <button className="btn btn--primary btn--lg" onClick={handleDownloadPDF} disabled={downloading} id="download-pdf-bottom">{downloading?<><span className="btn-spinner"></span>Generating...</>:<>Download PDF</>}</button>
        <button className="btn btn--outline btn--lg" onClick={handlePrint} id="print-bottom">Print Report</button>
        <button className="btn btn--outline btn--lg" onClick={onRestart} id="new-assessment-btn">New Assessment</button>
      </div>
    </div>
  );
}
