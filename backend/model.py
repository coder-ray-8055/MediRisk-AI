import os
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.nn.functional as F
import joblib

# ── DIABETES MODEL DEFINITION ─────────────────────────────────────────
class ANN_Model(nn.Module):
    def __init__(self, input_features=8, hidden1=20, hidden2=20, out_features=2):
        super().__init__()
        self.f_connected1 = nn.Linear(input_features, hidden1)
        self.f_connected2 = nn.Linear(hidden1, hidden2)
        self.out = nn.Linear(hidden2, out_features)

    def forward(self, x):
        x = F.relu(self.f_connected1(x))
        x = F.relu(self.f_connected2(x))
        return self.out(x)

# ── HEART DISEASE MODEL DEFINITION ────────────────────────────────────
class HeartANN(nn.Module):
    def __init__(self, input_feature=13, hidden1=32, hidden2=16, out_features=2):
        super().__init__()
        self.fc1 = nn.Linear(input_feature, hidden1)
        self.fc2 = nn.Linear(hidden1, hidden2)
        self.out = nn.Linear(hidden2, out_features)
    
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        return self.out(x)

# ── CHRONIC KIDNEY DISEASE MODEL DEFINITION ───────────────────────────
class KidneyANN(nn.Module):
    def __init__(self, input_feature=24, hidden1=32, hidden2=16, out_feature=2):
        super().__init__()
        self.fc1 = nn.Linear(input_feature, hidden1)
        self.fc2 = nn.Linear(hidden1, hidden2)
        self.out = nn.Linear(hidden2, out_feature)
    
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        return self.out(x)

# ── GLOBAL MODEL REGISTRY & LOADERS ───────────────────────────────────
_models = {}
_scalers = {}
_encoders = {}

def get_base_dir():
    return os.path.dirname(__file__)

def load_all_models():
    base_dir = get_base_dir()
    
    # 1. Load Diabetes
    diag_path = os.path.join(base_dir, "diabetes_state_dict.pt")
    if os.path.exists(diag_path):
        try:
            m = ANN_Model()
            m.load_state_dict(torch.load(diag_path, map_location=torch.device("cpu")))
            m.eval()
            _models['diabetes'] = m
            print("Successfully loaded Diabetes model.")
        except Exception as e:
            print(f"Error loading Diabetes model: {e}")
            
    # 2. Load Heart
    heart_path = os.path.join(base_dir, "heart_state_dict.pt")
    scaler_heart_path = os.path.join(base_dir, "heart_scaler.pkl")
    if os.path.exists(heart_path) and os.path.exists(scaler_heart_path):
        try:
            m = HeartANN()
            m.load_state_dict(torch.load(heart_path, map_location=torch.device("cpu")))
            m.eval()
            _models['heart'] = m
            _scalers['heart'] = joblib.load(scaler_heart_path)
            print("Successfully loaded Heart model and scaler.")
        except Exception as e:
            print(f"Error loading Heart model: {e}")
            
    # 3. Load Kidney
    kidney_path = os.path.join(base_dir, "kidney_state_dict.pt")
    scaler_kidney_path = os.path.join(base_dir, "kidney_scaler.pkl")
    encoder_kidney_path = os.path.join(base_dir, "kidney_label_encoders.pkl")
    if os.path.exists(kidney_path) and os.path.exists(scaler_kidney_path) and os.path.exists(encoder_kidney_path):
        try:
            m = KidneyANN()
            m.load_state_dict(torch.load(kidney_path, map_location=torch.device("cpu")))
            m.eval()
            _models['kidney'] = m
            _scalers['kidney'] = joblib.load(scaler_kidney_path)
            _encoders['kidney'] = joblib.load(encoder_kidney_path)
            print("Successfully loaded Kidney model, scaler, and encoders.")
        except Exception as e:
            print(f"Error loading Kidney model: {e}")

# ── PREDICTION FUNCTIONS ──────────────────────────────────────────────
def predict_diabetes(input_data):
    """
    input_data: dict of fields matching Frontend PatientForm
    """
    model = _models.get('diabetes')
    if not model:
        raise RuntimeError("Diabetes model is not loaded.")
        
    features = [
        float(input_data['pregnancies']),
        float(input_data['glucose']),
        float(input_data['blood_pressure']),
        float(input_data['skin_thickness']),
        float(input_data['insulin']),
        float(input_data['bmi']),
        float(input_data['diabetes_pedigree']),
        float(input_data['age'])
    ]
    
    tensor_data = torch.FloatTensor(features)
    with torch.no_grad():
        output = model(tensor_data)
        predicted_class = output.argmax().item()
        probabilities = torch.softmax(output, dim=0)
        confidence = probabilities[predicted_class].item() * 100
        
    status = "Diabetic" if predicted_class == 1 else "Non-Diabetic"
    message = (
        "Patient is likely Diabetic. Please consult a qualified doctor for medical advice." 
        if predicted_class == 1 else 
        "Patient is likely Non-Diabetic. Maintain a healthy lifestyle and regular check-ups."
    )
    
    return {
        "predicted_class": predicted_class,
        "status": status,
        "message": message,
        "confidence": round(confidence, 2),
        "raw_scores": output.tolist()
    }

def predict_heart(input_data):
    """
    input_data: dict of fields matching Frontend PatientForm
    """
    model = _models.get('heart')
    scaler = _scalers.get('heart')
    if not model or not scaler:
        raise RuntimeError("Heart model or scaler is not loaded.")
        
    # Order: age, sex, cp, trestbps, chol, fbs, restecg, thalachh, exang, oldpeak, slope, ca, thal
    cols = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalachh", "exang", "oldpeak", "slope", "ca", "thal"]
    
    raw_values = {
        "age": float(input_data['age']),
        "sex": float(input_data['sex']),
        "cp": float(input_data['cp']),
        "trestbps": float(input_data['trestbps']),
        "chol": float(input_data['chol']),
        "fbs": float(input_data['fbs']),
        "restecg": float(input_data['restecg']),
        "thalachh": float(input_data['thalachh']),
        "exang": float(input_data['exang']),
        "oldpeak": float(input_data['oldpeak']),
        "slope": float(input_data['slope']),
        "ca": float(input_data['ca']),
        "thal": float(input_data['thal'])
    }
    
    # Scale continuous features
    continuous_features = ["age", "trestbps", "chol", "thalachh", "oldpeak"]
    df = pd.DataFrame([raw_values])[cols]
    df[continuous_features] = scaler.transform(df[continuous_features])
    
    tensor_data = torch.FloatTensor(df.values)
    with torch.no_grad():
        output = model(tensor_data)
        predicted_class = output.argmax(dim=1).item()
        probabilities = torch.softmax(output, dim=1)
        confidence = probabilities[0][predicted_class].item() * 100
        
    status = "High Risk" if predicted_class == 1 else "Low Risk"
    message = (
        "High Risk. The patient is likely to have Heart Disease. Please consult a qualified cardiologist."
        if predicted_class == 1 else
        "Low Risk. The patient is unlikely to have Heart Disease. Maintain a healthy lifestyle."
    )
    
    return {
        "predicted_class": predicted_class,
        "status": status,
        "message": message,
        "confidence": round(confidence, 2),
        "raw_scores": output.tolist()[0]
    }

def predict_kidney(input_data):
    """
    input_data: dict of fields matching Frontend PatientForm
    """
    model = _models.get('kidney')
    scaler = _scalers.get('kidney')
    encoders = _encoders.get('kidney')
    if not model or not scaler or not encoders:
        raise RuntimeError("Kidney model, scaler, or encoders are not loaded.")
        
    # Feature list & ordering
    cont_features = ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc']
    cat_features = ['rbc', 'pc', 'pcc', 'ba', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane']
    
    # Pre-process continuous values
    user_cont = {}
    for col in cont_features:
        user_cont[col] = float(input_data[col])
        
    user_cont_df = pd.DataFrame([user_cont])[cont_features]
    scaled_cont = scaler.transform(user_cont_df)[0]
    
    # Pre-process categorical values
    encoded_cat = []
    for col in cat_features:
        val = str(input_data[col]).strip().lower()
        le = encoders[col]
        # Fallback to 'missing' if unseen
        if val not in le.classes_:
            val = 'missing'
        encoded_cat.append(le.transform([val])[0])
        
    final_features = np.concatenate([scaled_cont, encoded_cat]).reshape(1, -1)
    tensor_data = torch.FloatTensor(final_features)
    
    with torch.no_grad():
        output = model(tensor_data)
        predicted_class = output.argmax(dim=1).item()
        probabilities = torch.softmax(output, dim=1)
        confidence = probabilities[0][predicted_class].item() * 100
        
    status = "High Risk" if predicted_class == 1 else "Low Risk"
    message = (
        "High Risk. The patient is likely to have Chronic Kidney Disease (CKD). Please consult a Nephrologist."
        if predicted_class == 1 else
        "Low Risk. The patient is unlikely to have Chronic Kidney Disease. Keep up with healthy hydration."
    )
    
    return {
        "predicted_class": predicted_class,
        "status": status,
        "message": message,
        "confidence": round(confidence, 2),
        "raw_scores": output.tolist()[0]
    }
