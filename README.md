# 🩺 MediRisk AI (Formerly diabetePred.ai)

> An advanced, multi-disease AI Health Risk Assessment & Clinical Report Generation System. Powered by Deep Learning & Machine Learning...

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python">
  <img src="https://img.shields.io/badge/PyTorch-Neural%20Network-red?style=for-the-badge&logo=pytorch">
  <img src="https://img.shields.io/badge/Flask-Backend-black?style=for-the-badge&logo=flask">
  <img src="https://img.shields.io/badge/HTML5-CSS3-JS-orange?style=for-the-badge&logo=html5">
  <img src="https://img.shields.io/badge/License-GPLv3-blue?style=for-the-badge">
</p>

---

## 📌 Overview

**MediRisk AI** is an end-to-end AI-powered health risk prediction and clinical assistant application. Upgraded from its original version focused solely on diabetes prediction, **MediRisk AI** now assesses risks for **multiple chronic diseases** (including Diabetes, Heart Disease, Kidney Disease, Liver Disease, and Hypertension/Stroke risk).

It analyzes patient health parameters and bio-markers using custom **PyTorch Artificial Neural Networks (ANN)** and ensemble machine learning models. Beyond instant risk calculation, the system generates comprehensive, downloadable **Doctor-Ready Clinical Health Reports** designed to bridge the communication gap between patients and healthcare providers during consultations.

---

## ✨ Features

- 🤖 **Multi-Disease AI Risk Prediction:** Evaluates risk profiles across multiple health conditions (Diabetes, Heart Disease, Liver & Kidney metrics).
- 🧠 **PyTorch Deep Neural Networks:** High-accuracy neural models trained on clinical bio-markers.
- ⚡ **Flask RESTful API:** Lightweight, fast, and secure API backend handling data validation and model inference.
- 🎨 **Responsive Modern UI:** Seamless user experience across mobile, tablet, and desktop interfaces.
- 📊 **Confidence & Risk Scoring:** Real-time percentage risk score with stratification (Low, Moderate, High Risk).
- 📑 **Comprehensive Doctor-Ready Report:** Instant generation of standardized PDF reports to print or present during medical appointments.
- 🔍 **Real-Time Health Risk Analytics:** Instant execution with clear parameter flags (out-of-range indicators).
- 🛡️ **GPL-3.0 Open Source:** Fully open for community contributions and clinical technology research.

---

## 🩺 Clinical Report Generation & Doctor Assistance

A key feature of **MediRisk AI** is its automated **Clinical Health Report System**.

### Why is this report vital?
- **Prevents Memory Gaps:** During short doctor visits, patients often forget to mention critical baseline metrics, family history, or recent bio-marker changes.
- **Saves Doctor's Time:** Doctors frequently don't have enough consultation time to ask every detailed preliminary baseline question.
- **Enables Accurate Prescriptions & Diagnosis:** Having a structured summary of vital metrics allows healthcare providers to quickly evaluate risk factors and prescribe appropriate tests or medications without missing crucial context.

Patients can effortlessly **download and print** their formatted report to share directly with their physician.

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend
- Flask (Python)
- REST APIs

### Machine Learning & Data Science
- PyTorch (Artificial Neural Networks)
- Scikit-learn
- Pandas
- NumPy

---

## 📥 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/MediRisk-AI.git
cd MediRisk-AI
```

---

### 2️⃣ Create a Virtual Environment

#### Windows
```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux / macOS
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Project

### Start the Flask Backend

```bash
cd backend
python app.py
```

The backend server will start at:
```text
http://127.0.0.1:5000
```

---

### Start the Frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be live at:
```text
http://localhost:5173
```

---

## 📊 Input Parameters & Assessed Metrics

Depending on the chosen risk module, the system processes a variety of patient parameters:

- **Diabetes Risk:** Glucose, BMI, Blood Pressure, Insulin, Skin Thickness, Diabetes Pedigree Function, Age, Pregnancies.
- **Cardiovascular / Heart Risk:** Chest Pain Type, Resting Blood Pressure, Serum Cholesterol, Fasting Blood Sugar, Max Heart Rate, Exercise Angina, ST Depression.
- **Renal & Hepatic Indicators:** Serum Creatinine, Urea, SGOT/SGPT levels, Bilirubin, Albumin.
- **Lifestyle & Vitals:** Age, Gender, BMI, Physical Activity, Smoking Status.

---

## 🧠 Model Architecture & Methodology

- **Framework:** PyTorch & Scikit-learn
- **Architecture:** Multi-Layer Perceptron (MLP) / Artificial Neural Networks (ANN) with dense linear layers, Dropout regularization, and Batch Normalization.
- **Activation Functions:** ReLU (Hidden Layers), Sigmoid / Softmax (Output Layer).
- **Optimization & Loss:** Adam Optimizer with Binary / Categorical Cross-Entropy Loss.
- **Inference Pipeline:** Feature scaling via StandardScaler, real-time prediction tensor transformation, and probability mapping.

---

## 🚀 Future Roadmap

- 🔐 **User Authentication & Dashboard:** Secure patient profile management and report history.
- 📈 **Longitudinal Health Tracking:** Visual trend charts over time for recurring metrics.
- 🤖 **Interactive LLM Health Assistant:** Natural language explanation of lab reports and medical terms.
- 📊 **Explainable AI (XAI):** SHAP / LIME integration to show which features contributed most to risk scores.
- 🌙 **Dark Mode Support**
- 🐳 **Docker Containerization**
- ☁️ **Cloud Deployment (AWS / GCP / Vercel)**
- 🩺 **Doctor Mode:** Specialized interface for healthcare professionals to review multiple patient logs.

---

## 🤝 Contributing

Contributions are warmly welcomed! 

If you'd like to improve **MediRisk AI**:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. 

You are free to use, modify, and distribute this software in accordance with the GPL-3.0 terms.

---

## 👨‍💻 Author

### MD Rayyan Akhtar (Full stack developer)

---

## ⭐ Support

If you find this project useful, please consider giving it a ⭐ **Star** on GitHub! Your support drives further development.

---

<p align="center">
Made with ❤️ by <b>MD Rayyan Akhtar</b>
</p>
