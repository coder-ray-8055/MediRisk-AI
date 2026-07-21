import { useState } from 'react';
import { useToast } from './Toast';
import './FollowUpForm.css';

// Steps definition per disease
const DISEASE_STEPS = {
  diabetes: [
    { title: 'General Information', icon: '📋', subtitle: 'Basic patient details' },
    { title: 'Symptoms Assessment', icon: '🩺', subtitle: 'Common diabetes symptoms' },
    { title: 'Family History', icon: '👨‍👩‍👧‍👦', subtitle: 'Genetic risk factors' },
    { title: 'Lifestyle', icon: '🏃', subtitle: 'Daily habits and routines' },
  ],
  heart: [
    { title: 'General Information', icon: '📋', subtitle: 'Basic patient details' },
    { title: 'Cardiac Symptoms', icon: '🫀', subtitle: 'Cardiovascular markers and indicators' },
    { title: 'Family History', icon: '👨‍👩‍👧‍👦', subtitle: 'Genetic risk factors' },
    { title: 'Lifestyle & Habits', icon: '🏃', subtitle: 'Cardio lifestyle factors' },
  ],
  kidney: [
    { title: 'General Information', icon: '📋', subtitle: 'Basic patient details' },
    { title: 'Renal Symptoms', icon: '🫘', subtitle: 'Kidney filtration symptoms' },
    { title: 'Family History', icon: '👨‍👩‍👧‍👦', subtitle: 'Genetic risk factors' },
    { title: 'Renal Lifestyle', icon: '💧', subtitle: 'Hydration and drug usage' },
  ]
};

export default function FollowUpForm({ disease, diseaseInfo, onSubmit, onBack }) {
  const toast = useToast();
  const [step, setStep] = useState(0); 

  const steps = DISEASE_STEPS[disease] || DISEASE_STEPS.diabetes;

  // ── States ──────────────────────────────────────────────────────────
  const [general, setGeneral] = useState({
    reason: '',
    gender: '',
    age: '',
    pregnancies: '',
  });

  // Symptoms state (mapped per disease)
  const [symptoms, setSymptoms] = useState(() => {
    if (disease === 'heart') {
      return {
        shortness_of_breath: '',
        dizziness: '',
        palpitations: '',
        chest_heaviness: '',
        easy_fatigue: '',
      };
    } else if (disease === 'kidney') {
      return {
        urination_pain: '',
        foamy_urine: '',
        swollen_ankles: '',
        puffiness_around_eyes: '',
        fatigue: '',
        metallic_taste: '',
      };
    } else {
      return {
        excessive_thirst: '',
        frequent_urination: '',
        sudden_weight_loss: '',
        fatigue: '',
        blurred_vision: '',
        slow_wound_healing: '',
        frequent_infections: '',
        numbness: '',
      };
    }
  });

  // Family History State
  const [family, setFamily] = useState({
    history_count: '',
  });

  // Lifestyle state
  const [lifestyle, setLifestyle] = useState(() => {
    if (disease === 'heart') {
      return {
        exercise_days: '',
        sodium_intake: '',
        stress_level: '',
        smoking: '',
        alcohol: '',
      };
    } else if (disease === 'kidney') {
      return {
        water_intake: '',
        painkillers_usage: '',
        hypertension_history: '',
        smoking: '',
        alcohol: '',
      };
    } else {
      return {
        exercise: '',
        exercise_days: '',
        sugary_food: '',
        smoking: '',
        alcohol: '',
      };
    }
  });

  // ── Validators ──────────────────────────────────────────────────────
  const validateGeneral = () => {
    if (!general.reason.trim()) { toast.error('Please enter the reason for visit.'); return false; }
    if (!general.gender) { toast.error('Please select a gender.'); return false; }
    if (!general.age.trim()) { toast.error('Please enter the age.'); return false; }
    const age = parseInt(general.age);
    if (isNaN(age) || age < 1 || age > 120) { toast.error('Please enter a valid age (1-120).'); return false; }
    if (general.gender === 'female' && disease === 'diabetes' && general.pregnancies.trim() === '') {
      toast.error('Please enter number of pregnancies.');
      return false;
    }
    return true;
  };

  const validateSymptoms = () => {
    for (const [key, val] of Object.entries(symptoms)) {
      if (!val) {
        const label = key.replace(/_/g, ' ');
        toast.error(`Please answer the "${label}" question.`);
        return false;
      }
    }
    return true;
  };

  const validateFamily = () => {
    if (family.history_count.trim() === '') {
      toast.error('Please enter the number of diagnosed family members.');
      return false;
    }
    const num = parseInt(family.history_count);
    if (isNaN(num) || num < 0) {
      toast.error('Please enter a valid number.');
      return false;
    }
    return true;
  };

  const validateLifestyle = () => {
    if (disease === 'diabetes') {
      if (!lifestyle.exercise) { toast.error('Please answer the exercise question.'); return false; }
      if (!lifestyle.exercise_days.trim()) { toast.error('Please enter exercise days per week.'); return false; }
      const days = parseInt(lifestyle.exercise_days);
      if (isNaN(days) || days < 0 || days > 7) { toast.error('Exercise days must be between 0 and 7.'); return false; }
      if (!lifestyle.sugary_food.trim()) { toast.error('Please answer the sugary food question.'); return false; }
      if (!lifestyle.smoking.trim()) { toast.error('Please answer the smoking question.'); return false; }
      if (!lifestyle.alcohol.trim()) { toast.error('Please answer the alcohol question.'); return false; }
    } else if (disease === 'heart') {
      if (!lifestyle.exercise_days.trim()) { toast.error('Please enter exercise days per week.'); return false; }
      const days = parseInt(lifestyle.exercise_days);
      if (isNaN(days) || days < 0 || days > 7) { toast.error('Exercise days must be between 0 and 7.'); return false; }
      if (!lifestyle.sodium_intake.trim()) { toast.error('Please answer the sodium intake question.'); return false; }
      if (!lifestyle.stress_level.trim()) { toast.error('Please answer the stress level question.'); return false; }
      if (!lifestyle.smoking.trim()) { toast.error('Please answer the smoking question.'); return false; }
      if (!lifestyle.alcohol.trim()) { toast.error('Please answer the alcohol question.'); return false; }
    } else if (disease === 'kidney') {
      if (!lifestyle.water_intake.trim()) { toast.error('Please select daily water intake.'); return false; }
      if (!lifestyle.painkillers_usage.trim()) { toast.error('Please answer the NSAID/painkiller usage question.'); return false; }
      if (!lifestyle.hypertension_history.trim()) { toast.error('Please answer the hypertension history question.'); return false; }
      if (!lifestyle.smoking.trim()) { toast.error('Please answer the smoking question.'); return false; }
      if (!lifestyle.alcohol.trim()) { toast.error('Please answer the alcohol question.'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    const validators = [validateGeneral, validateSymptoms, validateFamily, validateLifestyle];
    if (!validators[step]()) return;

    if (step < 3) {
      setStep(step + 1);
      toast.success(`${steps[step].title} completed!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.success('All questions completed!');
      onSubmit({
        disease,
        general: {
          ...general,
          pregnancies: general.gender === 'male' ? '0' : general.pregnancies,
        },
        symptoms,
        family_history_count: family.history_count,
        family_diabetic_count: family.history_count, // backward compatibility
        lifestyle,
      });
    }
  };

  const handleBackNavigation = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  };

  const YesNoField = ({ label, value, onChange, id }) => (
    <div className="yn-field">
      <span className="yn-field__label">{label}</span>
      <div className="yn-field__options">
        <button
          type="button"
          className={`yn-btn ${value === 'yes' ? 'yn-btn--active-yes' : ''}`}
          onClick={() => onChange('yes')}
          id={`${id}-yes`}
        >
          ✓ Yes
        </button>
        <button
          type="button"
          className={`yn-btn ${value === 'no' ? 'yn-btn--active-no' : ''}`}
          onClick={() => onChange('no')}
          id={`${id}-no`}
        >
          ✗ No
        </button>
      </div>
    </div>
  );

  return (
    <div className="followup-page animate-fade-in-up" id="followup-page">
      {/* Progress Bar */}
      <div className="followup-progress">
        {steps.map((s, i) => (
          <div key={i} className={`progress-step ${i === step ? 'progress-step--active' : ''} ${i < step ? 'progress-step--done' : ''}`}>
            <div 
              className="progress-step__circle"
              style={{
                backgroundColor: i === step ? diseaseInfo.color : (i < step ? `${diseaseInfo.color}25` : ''),
                borderColor: i === step || i < step ? diseaseInfo.color : '',
                color: i === step ? '#fff' : (i < step ? diseaseInfo.color : '')
              }}
            >
              {i < step ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="progress-step__label" style={{ color: i === step ? 'var(--color-gray-900)' : '' }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step Header */}
      <div className="followup-header">
        <span className="followup-header__icon">{steps[step].icon}</span>
        <h2 className="followup-header__title">{steps[step].title}</h2>
        <p className="followup-header__subtitle">{steps[step].subtitle}</p>
      </div>

      {/* Step Content */}
      <div className="followup-card" key={step}>
        {/* Step 0: General */}
        {step === 0 && (
          <div className="followup-fields animate-fade-in">
            <div className="form-field">
              <label className="form-field__label" htmlFor="reason-input">What brings you here today?</label>
              <input
                type="text"
                id="reason-input"
                className="form-field__input"
                placeholder="e.g., Routine check-up, concerned about symptoms..."
                value={general.reason}
                onChange={e => setGeneral({...general, reason: e.target.value})}
              />
            </div>

            <div className="form-field">
              <label className="form-field__label">Gender</label>
              <div className="gender-select">
                <button
                  type="button"
                  className={`gender-btn ${general.gender === 'male' ? 'gender-btn--active' : ''}`}
                  style={{
                    borderColor: general.gender === 'male' ? diseaseInfo.color : '',
                    color: general.gender === 'male' ? diseaseInfo.color : '',
                    backgroundColor: general.gender === 'male' ? `${diseaseInfo.color}10` : '',
                  }}
                  onClick={() => setGeneral({...general, gender: 'male', pregnancies: '0'})}
                  id="gender-male-btn"
                >
                  <span>Male</span>
                </button>
                <button
                  type="button"
                  className={`gender-btn ${general.gender === 'female' ? 'gender-btn--active' : ''}`}
                  style={{
                    borderColor: general.gender === 'female' ? diseaseInfo.color : '',
                    color: general.gender === 'female' ? diseaseInfo.color : '',
                    backgroundColor: general.gender === 'female' ? `${diseaseInfo.color}10` : '',
                  }}
                  onClick={() => setGeneral({...general, gender: 'female'})}
                  id="gender-female-btn"
                >
                  <span>Female</span>
                </button>
              </div>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="age-followup-input">Age</label>
              <input
                type="number"
                id="age-followup-input"
                className="form-field__input"
                placeholder="e.g., 35"
                value={general.age}
                onChange={e => setGeneral({...general, age: e.target.value})}
                min="1"
                max="120"
              />
            </div>

            {general.gender === 'female' && disease === 'diabetes' && (
              <div className="form-field animate-fade-in">
                <label className="form-field__label" htmlFor="pregnancies-followup-input">
                  Number of Pregnancies
                </label>
                <input
                  type="number"
                  id="pregnancies-followup-input"
                  className="form-field__input"
                  placeholder="e.g., 2"
                  value={general.pregnancies}
                  onChange={e => setGeneral({...general, pregnancies: e.target.value})}
                  min="0"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 1: Symptoms */}
        {step === 1 && disease === 'diabetes' && (
          <div className="followup-fields animate-fade-in">
            <YesNoField
              label="Do you often feel excessive thirst?"
              value={symptoms.excessive_thirst}
              onChange={v => setSymptoms({...symptoms, excessive_thirst: v})}
              id="sym-thirst"
            />
            <YesNoField
              label="Do you urinate frequently?"
              value={symptoms.frequent_urination}
              onChange={v => setSymptoms({...symptoms, frequent_urination: v})}
              id="sym-urine"
            />
            <YesNoField
              label="Have you experienced sudden weight loss?"
              value={symptoms.sudden_weight_loss}
              onChange={v => setSymptoms({...symptoms, sudden_weight_loss: v})}
              id="sym-weight"
            />
            <YesNoField
              label="Do you feel tired most of the time?"
              value={symptoms.fatigue}
              onChange={v => setSymptoms({...symptoms, fatigue: v})}
              id="sym-fatigue"
            />
            <YesNoField
              label="Do you have blurred vision?"
              value={symptoms.blurred_vision}
              onChange={v => setSymptoms({...symptoms, blurred_vision: v})}
              id="sym-vision"
            />
            <YesNoField
              label="Do your wounds heal slowly?"
              value={symptoms.slow_wound_healing}
              onChange={v => setSymptoms({...symptoms, slow_wound_healing: v})}
              id="sym-heal"
            />
            <YesNoField
              label="Do you experience frequent infections?"
              value={symptoms.frequent_infections}
              onChange={v => setSymptoms({...symptoms, frequent_infections: v})}
              id="sym-infections"
            />
            <YesNoField
              label="Do you feel numbness or tingling in hands or feet?"
              value={symptoms.numbness}
              onChange={v => setSymptoms({...symptoms, numbness: v})}
              id="sym-numbness"
            />
          </div>
        )}

        {step === 1 && disease === 'heart' && (
          <div className="followup-fields animate-fade-in">
            <YesNoField
              label="Do you experience shortness of breath during mild activity?"
              value={symptoms.shortness_of_breath}
              onChange={v => setSymptoms({...symptoms, shortness_of_breath: v})}
              id="sym-breath"
            />
            <YesNoField
              label="Do you experience frequent dizziness or lightheadedness?"
              value={symptoms.dizziness}
              onChange={v => setSymptoms({...symptoms, dizziness: v})}
              id="sym-dizzy"
            />
            <YesNoField
              label="Do you feel irregular heartbeats or palpitations?"
              value={symptoms.palpitations}
              onChange={v => setSymptoms({...symptoms, palpitations: v})}
              id="sym-palp"
            />
            <YesNoField
              label="Do you feel heaviness, squeezing, or pain in your chest?"
              value={symptoms.chest_heaviness}
              onChange={v => setSymptoms({...symptoms, chest_heaviness: v})}
              id="sym-heavy"
            />
            <YesNoField
              label="Do you fatigue easily during ordinary daily activities?"
              value={symptoms.easy_fatigue}
              onChange={v => setSymptoms({...symptoms, easy_fatigue: v})}
              id="sym-fatigue-h"
            />
          </div>
        )}

        {step === 1 && disease === 'kidney' && (
          <div className="followup-fields animate-fade-in">
            <YesNoField
              label="Do you feel pain or difficulty during urination?"
              value={symptoms.urination_pain}
              onChange={v => setSymptoms({...symptoms, urination_pain: v})}
              id="sym-uripain"
            />
            <YesNoField
              label="Have you noticed foamy or bubbly urine?"
              value={symptoms.foamy_urine}
              onChange={v => setSymptoms({...symptoms, foamy_urine: v})}
              id="sym-foam"
            />
            <YesNoField
              label="Do you have swelling in your ankles, feet, or legs?"
              value={symptoms.swollen_ankles}
              onChange={v => setSymptoms({...symptoms, swollen_ankles: v})}
              id="sym-swell"
            />
            <YesNoField
              label="Do you experience puffiness around your eyes, especially in the morning?"
              value={symptoms.puffiness_around_eyes}
              onChange={v => setSymptoms({...symptoms, puffiness_around_eyes: v})}
              id="sym-eyes"
            />
            <YesNoField
              label="Do you experience generalized fatigue or weakness?"
              value={symptoms.fatigue}
              onChange={v => setSymptoms({...symptoms, fatigue: v})}
              id="sym-fatigue-k"
            />
            <YesNoField
              label="Do you have a metallic taste in your mouth or ammonia breath?"
              value={symptoms.metallic_taste}
              onChange={v => setSymptoms({...symptoms, metallic_taste: v})}
              id="sym-taste"
            />
          </div>
        )}

        {/* Step 2: Family */}
        {step === 2 && (
          <div className="followup-fields animate-fade-in">
            <div className="form-field">
              <label className="form-field__label" htmlFor="family-count-input">
                How many immediate family members have been diagnosed with {diseaseInfo.shortName}?
              </label>
              <input
                type="number"
                id="family-count-input"
                className="form-field__input"
                placeholder="e.g., 2"
                value={family.history_count}
                onChange={e => setFamily({...family, history_count: e.target.value})}
                min="0"
              />
              <span className="form-field__hint">Include parents, siblings, grandparents, and close biological relatives.</span>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {step === 3 && disease === 'diabetes' && (
          <div className="followup-fields animate-fade-in">
            <YesNoField
              label="Do you exercise regularly?"
              value={lifestyle.exercise}
              onChange={v => setLifestyle({...lifestyle, exercise: v})}
              id="ls-exercise"
            />

            <div className="form-field">
              <label className="form-field__label" htmlFor="exercise-days-input">
                How many days per week do you exercise?
              </label>
              <input
                type="number"
                id="exercise-days-input"
                className="form-field__input"
                placeholder="e.g., 3"
                value={lifestyle.exercise_days}
                onChange={e => setLifestyle({...lifestyle, exercise_days: e.target.value})}
                min="0"
                max="7"
              />
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="sugary-food-input">
                How often do you eat sugary foods or soft drinks?
              </label>
              <select
                id="sugary-food-input"
                className="form-field__input"
                value={lifestyle.sugary_food}
                onChange={e => setLifestyle({...lifestyle, sugary_food: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="rarely">Rarely</option>
                <option value="sometimes">Sometimes</option>
                <option value="often">Often</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="smoking-input">
                Do you smoke?
              </label>
              <select
                id="smoking-input"
                className="form-field__input"
                value={lifestyle.smoking}
                onChange={e => setLifestyle({...lifestyle, smoking: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="no">No</option>
                <option value="occasionally">Occasionally</option>
                <option value="yes">Yes, regularly</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="alcohol-input">
                Do you drink alcohol?
              </label>
              <select
                id="alcohol-input"
                className="form-field__input"
                value={lifestyle.alcohol}
                onChange={e => setLifestyle({...lifestyle, alcohol: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="no">No</option>
                <option value="occasionally">Occasionally</option>
                <option value="yes">Yes, regularly</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && disease === 'heart' && (
          <div className="followup-fields animate-fade-in">
            <div className="form-field">
              <label className="form-field__label" htmlFor="exercise-days-input-h">
                How many days per week do you engage in physical exercise?
              </label>
              <input
                type="number"
                id="exercise-days-input-h"
                className="form-field__input"
                placeholder="e.g., 3"
                value={lifestyle.exercise_days}
                onChange={e => setLifestyle({...lifestyle, exercise_days: e.target.value})}
                min="0"
                max="7"
              />
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="sodium-input">
                What is your daily sodium/salt intake?
              </label>
              <select
                id="sodium-input"
                className="form-field__input"
                value={lifestyle.sodium_intake}
                onChange={e => setLifestyle({...lifestyle, sodium_intake: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="low">Low (Salt restricted)</option>
                <option value="moderate">Moderate (Standard)</option>
                <option value="high">High (High processed food intake)</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="stress-input">
                How would you rate your typical stress levels?
              </label>
              <select
                id="stress-input"
                className="form-field__input"
                value={lifestyle.stress_level}
                onChange={e => setLifestyle({...lifestyle, stress_level: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="smoking-input-h">
                Do you smoke?
              </label>
              <select
                id="smoking-input-h"
                className="form-field__input"
                value={lifestyle.smoking}
                onChange={e => setLifestyle({...lifestyle, smoking: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="no">No</option>
                <option value="occasionally">Occasionally</option>
                <option value="yes">Yes, regularly</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="alcohol-input-h">
                Do you drink alcohol?
              </label>
              <select
                id="alcohol-input-h"
                className="form-field__input"
                value={lifestyle.alcohol}
                onChange={e => setLifestyle({...lifestyle, alcohol: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="no">No</option>
                <option value="occasionally">Occasionally</option>
                <option value="yes">Yes, regularly</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && disease === 'kidney' && (
          <div className="followup-fields animate-fade-in">
            <div className="form-field">
              <label className="form-field__label" htmlFor="water-input">
                What is your daily water intake?
              </label>
              <select
                id="water-input"
                className="form-field__input"
                value={lifestyle.water_intake}
                onChange={e => setLifestyle({...lifestyle, water_intake: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="insufficient">Insufficient (Less than 1.5 Liters)</option>
                <option value="adequate">Adequate (1.5 - 3 Liters)</option>
                <option value="high">High (More than 3 Liters)</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="nsaid-input">
                How often do you take painkillers / NSAIDs (e.g. Ibuprofen, Naproxen)?
              </label>
              <select
                id="nsaid-input"
                className="form-field__input"
                value={lifestyle.painkillers_usage}
                onChange={e => setLifestyle({...lifestyle, painkillers_usage: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="rarely">Rarely or Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="frequently">Frequently (Multiple times/week)</option>
              </select>
            </div>

            <YesNoField
              label="Do you have a personal history of hypertension?"
              value={lifestyle.hypertension_history}
              onChange={v => setLifestyle({...lifestyle, hypertension_history: v})}
              id="ls-htn"
            />

            <div className="form-field">
              <label className="form-field__label" htmlFor="smoking-input-k">
                Do you smoke?
              </label>
              <select
                id="smoking-input-k"
                className="form-field__input"
                value={lifestyle.smoking}
                onChange={e => setLifestyle({...lifestyle, smoking: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="no">No</option>
                <option value="occasionally">Occasionally</option>
                <option value="yes">Yes, regularly</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="alcohol-input-k">
                Do you drink alcohol?
              </label>
              <select
                id="alcohol-input-k"
                className="form-field__input"
                value={lifestyle.alcohol}
                onChange={e => setLifestyle({...lifestyle, alcohol: e.target.value})}
              >
                <option value="">Select an option</option>
                <option value="no">No</option>
                <option value="occasionally">Occasionally</option>
                <option value="yes">Yes, regularly</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="followup-nav">
        <button className="btn btn--outline btn--md" onClick={handleBackNavigation} id="followup-back-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
          </svg>
          Back
        </button>
        <button 
          className="btn btn--primary btn--md" 
          style={{ backgroundColor: diseaseInfo.color }}
          onClick={handleNext} 
          id="followup-next-btn"
        >
          {step < 3 ? (
            <>
              Next
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
              </svg>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              Generate Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}
