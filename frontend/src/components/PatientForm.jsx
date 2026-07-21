import { useState } from 'react';
import { useToast } from './Toast';
import './PatientForm.css';

const DISEASE_FIELDS = {
  diabetes: [
    { key: 'pregnancies', label: 'Pregnancies', placeholder: 'e.g., 2', unit: 'times', icon: '👶', hint: 'How many times has the patient been pregnant?', type: 'text' },
    { key: 'glucose', label: 'Glucose Level', placeholder: 'e.g., 120', unit: 'mg/dL', icon: '🩸', hint: 'Plasma glucose concentration (2hrs in OGTT)', type: 'text' },
    { key: 'blood_pressure', label: 'Blood Pressure', placeholder: 'e.g., 70', unit: 'mm Hg', icon: '💓', hint: 'Diastolic blood pressure', type: 'text' },
    { key: 'skin_thickness', label: 'Skin Thickness', placeholder: 'e.g., 20', unit: 'mm', icon: '📏', hint: 'Triceps skin fold thickness', type: 'text' },
    { key: 'insulin', label: 'Insulin Level', placeholder: 'e.g., 80', unit: 'mu U/ml', icon: '💉', hint: '2-hour serum insulin level', type: 'text' },
    { key: 'bmi', label: 'Body Mass Index (BMI)', placeholder: 'e.g., 25.6', unit: 'kg/m²', icon: '⚖️', hint: 'Weight (kg) / Height² (m²)', type: 'text' },
    { key: 'diabetes_pedigree', label: 'Diabetes Pedigree Function', placeholder: 'e.g., 0.627', unit: 'score', icon: '🧬', hint: 'Family history score (usually 0.1 – 2.5)', type: 'text' },
    { key: 'age', label: 'Age', placeholder: 'e.g., 45', unit: 'years', icon: '🎂', hint: 'Age of the patient in years', type: 'text' },
  ],
  heart: [
    { key: 'age', label: 'Age', placeholder: 'e.g., 55', unit: 'years', icon: '🎂', hint: 'Age of the patient in years', type: 'text' },
    {
      key: 'sex', label: 'Biological Sex', icon: '🧬', hint: 'Biological sex of the patient', type: 'select',
      options: [{ value: '1', label: 'Male' }, { value: '0', label: 'Female' }]
    },
    {
      key: 'cp', label: 'Chest Pain Type', icon: '💔', hint: 'Type of chest pain experienced', type: 'select',
      options: [
        { value: '0', label: 'Typical Angina' },
        { value: '1', label: 'Atypical Angina' },
        { value: '2', label: 'Non-anginal Pain' },
        { value: '3', label: 'Asymptomatic' }
      ]
    },
    { key: 'trestbps', label: 'Resting Blood Pressure', placeholder: 'e.g., 130', unit: 'mm Hg', icon: '💓', hint: 'Resting blood pressure on admission', type: 'text' },
    { key: 'chol', label: 'Serum Cholesterol', placeholder: 'e.g., 240', unit: 'mg/dL', icon: '🧪', hint: 'Serum cholesterol level in mg/dL', type: 'text' },
    {
      key: 'fbs', label: 'Fasting Blood Sugar', icon: '🩸', hint: 'Fasting blood sugar > 120 mg/dL', type: 'select',
      options: [{ value: '0', label: 'FBS <= 120 mg/dL' }, { value: '1', label: 'FBS > 120 mg/dL' }]
    },
    {
      key: 'restecg', label: 'Resting ECG Results', icon: '📈', hint: 'Resting electrocardiographic results', type: 'select',
      options: [
        { value: '0', label: 'Normal' },
        { value: '1', label: 'ST-T Wave Abnormality' },
        { value: '2', label: 'Left Ventricular Hypertrophy' }
      ]
    },
    { key: 'thalachh', label: 'Max Heart Rate', placeholder: 'e.g., 150', unit: 'bpm', icon: '⚡', hint: 'Maximum heart rate achieved', type: 'text' },
    {
      key: 'exang', label: 'Exercise Induced Angina', icon: '🏃‍♂️', hint: 'Exercise induced angina experienced', type: 'select',
      options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }]
    },
    { key: 'oldpeak', label: 'ST Depression (Oldpeak)', placeholder: 'e.g., 1.5', unit: 'mm', icon: '📉', hint: 'ST depression induced by exercise relative to rest', type: 'text' },
    {
      key: 'slope', label: 'ST Segment Slope', icon: '📊', hint: 'Slope of peak exercise ST segment', type: 'select',
      options: [
        { value: '0', label: 'Upsloping' },
        { value: '1', label: 'Flat' },
        { value: '2', label: 'Downsloping' }
      ]
    },
    {
      key: 'ca', label: 'Vessels Colored (CA)', icon: '🕵️‍♂️', hint: 'Number of major vessels colored by fluoroscopy', type: 'select',
      options: [
        { value: '0', label: '0 vessels' },
        { value: '1', label: '1 vessel' },
        { value: '2', label: '2 vessels' },
        { value: '3', label: '3 vessels' }
      ]
    },
    {
      key: 'thal', label: 'Thalassemia (Thal)', icon: '🩺', hint: 'Thalassemia blood disorder type', type: 'select',
      options: [
        { value: '1', label: 'Normal' },
        { value: '2', label: 'Fixed Defect' },
        { value: '3', label: 'Reversible Defect' }
      ]
    },
  ],
  kidney: [
    // Clinical Markers Tab
    { key: 'age', label: 'Age', placeholder: 'e.g., 48', unit: 'years', icon: '🎂', hint: 'Age of the patient', type: 'text', group: 'clinical' },
    { key: 'bp', label: 'Blood Pressure', placeholder: 'e.g., 80', unit: 'mm Hg', icon: '💓', hint: 'Systolic/Diastolic pressure status', type: 'text', group: 'clinical' },
    { key: 'bgr', label: 'Blood Glucose Random', placeholder: 'e.g., 121', unit: 'mg/dL', icon: '🩸', hint: 'Random blood glucose level', type: 'text', group: 'clinical' },
    { key: 'bu', label: 'Blood Urea', placeholder: 'e.g., 36', unit: 'mg/dL', icon: '🧪', hint: 'Blood urea measurement', type: 'text', group: 'clinical' },
    { key: 'sc', label: 'Serum Creatinine', placeholder: 'e.g., 1.2', unit: 'mg/dL', icon: '🔬', hint: 'Serum creatinine level (critical filtration marker)', type: 'text', group: 'clinical' },
    { key: 'sod', label: 'Sodium', placeholder: 'e.g., 138', unit: 'mEq/L', icon: '🧂', hint: 'Blood sodium level', type: 'text', group: 'clinical' },
    { key: 'pot', label: 'Potassium', placeholder: 'e.g., 4.4', unit: 'mEq/L', icon: '🍌', hint: 'Blood potassium level', type: 'text', group: 'clinical' },
    { key: 'hemo', label: 'Hemoglobin', placeholder: 'e.g., 15.4', unit: 'g/dL', icon: '🔴', hint: 'Hemoglobin concentration', type: 'text', group: 'clinical' },
    { key: 'pcv', label: 'Packed Cell Volume', placeholder: 'e.g., 44', unit: '%', icon: '📊', hint: 'Volume percentage of RBCs in blood', type: 'text', group: 'clinical' },
    { key: 'wc', label: 'White Blood Cell Count', placeholder: 'e.g., 7800', unit: '/cumm', icon: '🛡️', hint: 'Total WBC count', type: 'text', group: 'clinical' },
    { key: 'rc', label: 'Red Blood Cell Count', placeholder: 'e.g., 5.2', unit: 'm/cmm', icon: '⭕', hint: 'Total RBC count', type: 'text', group: 'clinical' },

    // Laboratory Panels Tab
    {
      key: 'sg', label: 'Specific Gravity', icon: '💧', hint: 'Urine specific gravity density marker', type: 'select', group: 'laboratory',
      options: [
        { value: '1.005', label: '1.005' },
        { value: '1.010', label: '1.010' },
        { value: '1.015', label: '1.015' },
        { value: '1.020', label: '1.020' },
        { value: '1.025', label: '1.025' }
      ]
    },
    {
      key: 'al', label: 'Albumin Level', icon: '🥚', hint: 'Urine albumin score (proteinuria marker)', type: 'select', group: 'laboratory',
      options: [
        { value: '0', label: '0 (Normal)' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5 (Severe)' }
      ]
    },
    {
      key: 'su', label: 'Sugar Level', icon: '🍬', hint: 'Urine sugar level score', type: 'select', group: 'laboratory',
      options: [
        { value: '0', label: '0 (None)' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' }
      ]
    },
    {
      key: 'rbc', label: 'Red Blood Cells', icon: '🔴', hint: 'Presence of RBC in urine panel', type: 'select', group: 'laboratory',
      options: [{ value: 'normal', label: 'Normal' }, { value: 'abnormal', label: 'Abnormal' }]
    },
    {
      key: 'pc', label: 'Pus Cells', icon: '🧫', hint: 'Presence of pus cells in urine panel', type: 'select', group: 'laboratory',
      options: [{ value: 'normal', label: 'Normal' }, { value: 'abnormal', label: 'Abnormal' }]
    },
    {
      key: 'pcc', label: 'Pus Cell Clumps', icon: '🔗', hint: 'Urine pus cell clumps status', type: 'select', group: 'laboratory',
      options: [{ value: 'notpresent', label: 'Not Present' }, { value: 'present', label: 'Present' }]
    },
    {
      key: 'ba', label: 'Bacteria Panel', icon: '🦠', hint: 'Urinary bacteria status', type: 'select', group: 'laboratory',
      options: [{ value: 'notpresent', label: 'Not Present' }, { value: 'present', label: 'Present' }]
    },
    {
      key: 'htn', label: 'Hypertension', icon: '⚠️', hint: 'Does the patient have hypertension?', type: 'select', group: 'laboratory',
      options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]
    },
    {
      key: 'dm', label: 'Diabetes Mellitus', icon: '🍭', hint: 'Is the patient diabetic?', type: 'select', group: 'laboratory',
      options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]
    },
    {
      key: 'cad', label: 'Coronary Artery Disease', icon: '🫀', hint: 'History of coronary artery disease?', type: 'select', group: 'laboratory',
      options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]
    },
    {
      key: 'appet', label: 'Appetite Score', icon: '🍽️', hint: 'Patient appetite rating', type: 'select', group: 'laboratory',
      options: [{ value: 'good', label: 'Good' }, { value: 'poor', label: 'Poor' }]
    },
    {
      key: 'pe', label: 'Pedal Edema', icon: '🦶', hint: 'Presence of swelling in feet/ankles?', type: 'select', group: 'laboratory',
      options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]
    },
    {
      key: 'ane', label: 'Anemia Status', icon: '🥀', hint: 'Does the patient show signs of anemia?', type: 'select', group: 'laboratory',
      options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]
    },
  ]
};

// Generates default state for a disease
const getInitialState = (disease) => {
  const fields = DISEASE_FIELDS[disease] || [];
  const state = {};
  fields.forEach(f => {
    if (f.type === 'select') {
      state[f.key] = f.options[0].value; // Pre-select first option
    } else {
      state[f.key] = '';
    }
  });
  return state;
};

export default function PatientForm({ disease, diseaseInfo, onSubmit, onBack, isLoading }) {
  const toast = useToast();
  const fields = DISEASE_FIELDS[disease] || [];
  
  const [form, setForm] = useState(() => getInitialState(disease));
  const [activeTab, setActiveTab] = useState('clinical'); // Only for kidney disease

  const handleChange = (key, value) => {
    // For text inputs, enforce numeric validation
    const field = fields.find(f => f.key === key);
    if (field && field.type === 'text') {
      if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) return;
    }
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validateTab = (tabName) => {
    const tabFields = fields.filter(f => f.group === tabName);
    for (const field of tabFields) {
      const val = String(form[field.key] || '').trim();
      if (!val) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check all fields
    for (const field of fields) {
      const val = String(form[field.key] || '').trim();
      if (!val) {
        if (disease === 'kidney' && field.group !== activeTab) {
          // Alert user and switch to tab
          setActiveTab(field.group);
          toast.info(`Please complete the ${field.group === 'clinical' ? 'Clinical' : 'Laboratory'} tab.`);
        }
        toast.error(`${field.label} is required.`);
        return;
      }

      if (field.type === 'text') {
        const num = parseFloat(val);
        if (isNaN(num)) {
          toast.error(`${field.label} must be a valid number.`);
          return;
        }
        if (num < 0 && field.key !== 'diabetes_pedigree' && field.key !== 'oldpeak') {
          toast.error(`${field.label} cannot be negative.`);
          return;
        }
      }
    }

    // Specific field boundaries validations
    const age = parseFloat(form.age);
    if (age < 1 || age > 120) {
      toast.error('Please enter a valid age (1-120).');
      return;
    }

    if (disease === 'diabetes') {
      if (parseFloat(form.glucose) > 300) toast.warning('Glucose level seems unusually high. Please verify.');
      if (parseFloat(form.blood_pressure) > 200) toast.warning('Blood pressure seems unusually high. Please verify.');
      if (parseFloat(form.bmi) > 70) toast.warning('BMI seems unusually high. Please verify.');
    } else if (disease === 'heart') {
      if (parseFloat(form.trestbps) > 220) toast.warning('Resting blood pressure is extremely high. Please verify.');
      if (parseFloat(form.chol) > 600) toast.warning('Cholesterol level is extremely high. Please verify.');
      if (parseFloat(form.thalachh) > 220) toast.warning('Maximum heart rate is high. Please verify.');
    } else if (disease === 'kidney') {
      if (parseFloat(form.bp) > 200) toast.warning('Blood pressure seems high. Please verify.');
      if (parseFloat(form.sc) > 40) toast.warning('Serum creatinine seems extremely high. Please verify.');
    }

    // Prepare JSON payload
    const payload = {};
    fields.forEach(field => {
      if (field.type === 'text') {
        payload[field.key] = parseFloat(form[field.key]);
      } else {
        payload[field.key] = form[field.key];
      }
    });

    toast.info('Running clinical ANN prediction...');
    onSubmit(payload);
  };

  // Filter fields if CKD has tabs
  const displayedFields = disease === 'kidney' 
    ? fields.filter(f => f.group === activeTab)
    : fields;

  return (
    <div className="patient-form-page animate-fade-in-up" id="patient-form-page">
      <div className="form-header">
        <div className="form-header__icon" style={{ backgroundColor: `${diseaseInfo.color}15`, color: diseaseInfo.color }}>
          <span className="form-header__emoji-main">{diseaseInfo.icon}</span>
        </div>
        <h2 className="form-header__title">{diseaseInfo.name} Form</h2>
        <p className="form-header__subtitle">
          Submit the patient's medical details. Our system uses clinical-grade deep learning to analyze diagnostic markers.
        </p>
      </div>

      {disease === 'kidney' && (
        <div className="form-tabs" id="kidney-form-tabs">
          <button
            type="button"
            className={`form-tab-btn ${activeTab === 'clinical' ? 'active' : ''}`}
            style={{
              borderColor: activeTab === 'clinical' ? diseaseInfo.color : 'transparent',
              color: activeTab === 'clinical' ? diseaseInfo.color : ''
            }}
            onClick={() => setActiveTab('clinical')}
          >
            📊 Serum & Blood Chemistry
          </button>
          <button
            type="button"
            className={`form-tab-btn ${activeTab === 'laboratory' ? 'active' : ''}`}
            style={{
              borderColor: activeTab === 'laboratory' ? diseaseInfo.color : 'transparent',
              color: activeTab === 'laboratory' ? diseaseInfo.color : ''
            }}
            onClick={() => {
              if (validateTab('clinical')) {
                setActiveTab('laboratory');
              }
            }}
          >
            🧪 Urine & Physical Panels
          </button>
        </div>
      )}

      <form className="patient-form" onSubmit={handleSubmit} id="patient-details-form">
        <div className="patient-form__grid">
          {displayedFields.map(field => (
            <div className="form-field" key={field.key}>
              <label className="form-field__label" htmlFor={`input-${field.key}`}>
                <span className="form-field__emoji">{field.icon}</span>
                {field.label}
              </label>
              
              <div className="form-field__input-wrapper">
                {field.type === 'select' ? (
                  <select
                    id={`input-${field.key}`}
                    className="form-field__select"
                    value={form[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    disabled={isLoading}
                  >
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
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
                    {field.unit && <span className="form-field__unit">{field.unit}</span>}
                  </>
                )}
              </div>
              <span className="form-field__hint">{field.hint}</span>
            </div>
          ))}
        </div>

        <div className="patient-form__actions">
          {disease === 'kidney' && activeTab === 'clinical' ? (
            <button
              type="button"
              className="btn btn--primary btn--lg"
              style={{ backgroundColor: diseaseInfo.color }}
              onClick={() => {
                if (validateTab('clinical')) {
                  setActiveTab('laboratory');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              Continue to Lab Panel
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          ) : (
            <div className="form-actions-group">
              {disease === 'kidney' && (
                <button
                  type="button"
                  className="btn btn--outline btn--lg"
                  style={{ borderColor: diseaseInfo.color, color: diseaseInfo.color }}
                  onClick={() => setActiveTab('clinical')}
                  disabled={isLoading}
                >
                  Back to Blood Panel
                </button>
              )}
              <button
                type="submit"
                className="btn btn--primary btn--lg"
                id="predict-btn"
                style={{ backgroundColor: diseaseInfo.color, boxShadow: `0 4px 14px ${diseaseInfo.color}35` }}
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
          )}
        </div>
      </form>
    </div>
  );
}
