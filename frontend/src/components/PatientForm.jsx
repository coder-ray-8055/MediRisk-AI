import { useState } from 'react';
import { useToast } from './Toast';
import './PatientForm.css';

const FIELDS = [
  { key: 'pregnancies', label: 'Pregnancies', placeholder: 'e.g., 2', unit: 'times', icon: '👶', hint: 'How many times has the patient been pregnant?' },
  { key: 'glucose', label: 'Glucose Level', placeholder: 'e.g., 120', unit: 'mg/dL', icon: '🩸', hint: 'Plasma glucose concentration (2hrs in OGTT)' },
  { key: 'blood_pressure', label: 'Blood Pressure', placeholder: 'e.g., 70', unit: 'mm Hg', icon: '💓', hint: 'Diastolic blood pressure' },
  { key: 'skin_thickness', label: 'Skin Thickness', placeholder: 'e.g., 20', unit: 'mm', icon: '📏', hint: 'Triceps skin fold thickness' },
  { key: 'insulin', label: 'Insulin Level', placeholder: 'e.g., 80', unit: 'mu U/ml', icon: '💉', hint: '2-hour serum insulin level' },
  { key: 'bmi', label: 'Body Mass Index (BMI)', placeholder: 'e.g., 25.6', unit: 'kg/m²', icon: '⚖️', hint: 'Weight (kg) / Height² (m²)' },
  { key: 'diabetes_pedigree', label: 'Diabetes Pedigree Function', placeholder: 'e.g., 0.627', unit: 'score', icon: '🧬', hint: 'Family history score (usually 0.1 – 2.5)' },
  { key: 'age', label: 'Age', placeholder: 'e.g., 45', unit: 'years', icon: '🎂', hint: 'Age of the patient in years' },
];

export default function PatientForm({ onSubmit, isLoading }) {
  const toast = useToast();
  const [form, setForm] = useState({
    pregnancies: '', glucose: '', blood_pressure: '', skin_thickness: '',
    insulin: '', bmi: '', diabetes_pedigree: '', age: '',
  });

  const handleChange = (key, value) => {
    // Allow empty string, digits, decimal point, and minus sign
    if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) return;
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    for (const field of FIELDS) {
      const val = form[field.key].trim();
      if (!val) {
        toast.error(`${field.label} is required.`);
        return;
      }
      const num = parseFloat(val);
      if (isNaN(num)) {
        toast.error(`${field.label} must be a valid number.`);
        return;
      }
      if (num < 0 && field.key !== 'diabetes_pedigree') {
        toast.error(`${field.label} cannot be negative.`);
        return;
      }
    }

    // Additional validations
    const glucose = parseFloat(form.glucose);
    const bp = parseFloat(form.blood_pressure);
    const bmi = parseFloat(form.bmi);
    const age = parseFloat(form.age);

    if (glucose > 300) { toast.warning('Glucose level seems unusually high. Please verify.'); }
    if (bp > 200) { toast.warning('Blood pressure seems unusually high. Please verify.'); }
    if (bmi > 70) { toast.warning('BMI seems unusually high. Please verify.'); }
    if (age < 1 || age > 120) { toast.error('Please enter a valid age (1-120).'); return; }

    const data = {};
    for (const field of FIELDS) {
      data[field.key] = parseFloat(form[field.key]);
    }

    toast.info('Running ANN prediction...');
    onSubmit(data);
  };

  return (
    <div className="patient-form-page animate-fade-in-up" id="patient-form-page">
      <div className="form-header">
        <div className="form-header__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          </svg>
        </div>
        <h2 className="form-header__title">Patient Medical Data</h2>
        <p className="form-header__subtitle">
          Enter the patient's medical details carefully. All fields are required for an accurate prediction.
        </p>
      </div>

      <form className="patient-form" onSubmit={handleSubmit} id="patient-details-form">
        <div className="patient-form__grid">
          {FIELDS.map(field => (
            <div className="form-field" key={field.key}>
              <label className="form-field__label" htmlFor={`input-${field.key}`}>
                <span className="form-field__emoji">{field.icon}</span>
                {field.label}
              </label>
              <div className="form-field__input-wrapper">
                <input
                  type="text"
                  inputMode="decimal"
                  id={`input-${field.key}`}
                  className="form-field__input"
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  disabled={isLoading}
                />
                <span className="form-field__unit">{field.unit}</span>
              </div>
              <span className="form-field__hint">{field.hint}</span>
            </div>
          ))}
        </div>

        <div className="patient-form__actions">
          <button
            type="submit"
            className="btn btn--primary btn--lg"
            id="predict-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
                </svg>
                Run ANN Prediction
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
