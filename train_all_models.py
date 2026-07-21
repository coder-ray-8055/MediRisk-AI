import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import torch
import torch.nn as nn
import torch.nn.functional as F
import joblib

# Ensure backend directory exists
os.makedirs("backend", exist_ok=True)

# 1. DIABETES MODEL
print("Training Diabetes model...")
df_diab = pd.read_csv("dataset.csv")
X_diab = df_diab.drop("Outcome", axis=1).values
y_diab = df_diab["Outcome"].values

X_train_diab, _, y_train_diab, _ = train_test_split(X_diab, y_diab, test_size=0.2, random_state=0)
X_train_diab = torch.FloatTensor(X_train_diab)
y_train_diab = torch.LongTensor(y_train_diab)

class DiabetesANN(nn.Module):
    def __init__(self, input_features=8, hidden1=20, hidden2=20, out_features=2):
        super().__init__()
        self.f_connected1 = nn.Linear(input_features, hidden1)
        self.f_connected2 = nn.Linear(hidden1, hidden2)
        self.out = nn.Linear(hidden2, out_features)
    
    def forward(self, x):
        x = F.relu(self.f_connected1(x))
        x = F.relu(self.f_connected2(x))
        return self.out(x)

torch.manual_seed(20)
model_diab = DiabetesANN()
loss_fn = nn.CrossEntropyLoss()
opt_diab = torch.optim.Adam(model_diab.parameters(), lr=0.01)

for epoch in range(500):
    y_pred = model_diab(X_train_diab)
    loss = loss_fn(y_pred, y_train_diab)
    opt_diab.zero_grad()
    loss.backward()
    opt_diab.step()

torch.save(model_diab.state_dict(), "backend/diabetes_state_dict.pt")
print("Diabetes model trained and saved.")


# 2. HEART DISEASE MODEL
print("\nTraining Heart Disease model...")
df_heart = pd.read_csv("heart.csv")
df_heart.replace("?", np.nan, inplace=True)
for col in df_heart.columns:
    if col != "target":
        df_heart[col] = pd.to_numeric(df_heart[col], errors="coerce")
        if df_heart[col].isnull().sum() > 0:
            df_heart[col] = df_heart[col].fillna(df_heart[col].median())

X_heart = df_heart.drop("target", axis=1)
y_heart = df_heart["target"]
continuous_features_heart = ["age", "trestbps", "chol", "thalachh", "oldpeak"]

X_train_h, X_test_h, y_train_h, y_test_h = train_test_split(
    X_heart, y_heart, test_size=0.2, random_state=42, stratify=y_heart
)

scaler_heart = StandardScaler()
X_train_h_scaled = X_train_h.copy()
X_train_h_scaled[continuous_features_heart] = scaler_heart.fit_transform(X_train_h[continuous_features_heart])

X_train_h_tensor = torch.FloatTensor(X_train_h_scaled.values)
y_train_h_tensor = torch.LongTensor(y_train_h.values)

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

torch.manual_seed(42)
model_heart = HeartANN()
opt_heart = torch.optim.Adam(model_heart.parameters(), lr=0.01)

for epoch in range(500):
    y_pred = model_heart(X_train_h_tensor)
    loss = loss_fn(y_pred, y_train_h_tensor)
    opt_heart.zero_grad()
    loss.backward()
    opt_heart.step()

torch.save(model_heart.state_dict(), "backend/heart_state_dict.pt")
joblib.dump(scaler_heart, "backend/heart_scaler.pkl")
print("Heart model trained and saved.")


# 3. CHRONIC KIDNEY DISEASE MODEL
print("\nTraining Chronic Kidney Disease model...")
df_kidney = pd.read_csv("kidney.csv")

corrupted_numeric_cols = ['rc', 'wc', 'pcv']  # 'ba' is categorical, keeping it out of numeric conversion!
for col in corrupted_numeric_cols:
    if col in df_kidney.columns:
        df_kidney[col] = pd.to_numeric(df_kidney[col], errors='coerce')

ignore_cols = ["id", "classification"]
cat_features = []
cont_features = []

for col in df_kidney.columns:
    if col not in ignore_cols:
        # Check string types correctly for newer pandas versions
        if df_kidney[col].dtype == "O" or pd.api.types.is_string_dtype(df_kidney[col]):
            cat_features.append(col)
        else:
            cont_features.append(col)

# Ensure 'ba' is classified as categorical
if 'ba' not in cat_features and 'ba' in df_kidney.columns:
    cat_features.append('ba')
if 'ba' in cont_features:
    cont_features.remove('ba')

for feature in cat_features:
    df_kidney[feature] = df_kidney[feature].fillna("missing")

for feature in cont_features:
    df_kidney[feature] = df_kidney[feature].fillna(df_kidney[feature].median())

scaler_kidney = StandardScaler()
df_kidney_scaled = df_kidney.copy()
df_kidney_scaled[cont_features] = scaler_kidney.fit_transform(df_kidney[cont_features])

label_encoders = {}
for col in cat_features:
    le = LabelEncoder()
    # Fit with 'missing' option included in classes
    unique_vals = list(df_kidney[col].astype(str).unique())
    if 'missing' not in unique_vals:
        unique_vals.append('missing')
    le.fit(unique_vals)
    df_kidney_scaled[col] = le.transform(df_kidney[col].astype(str))
    label_encoders[col] = le

if 'classification' in df_kidney_scaled.columns:
    df_kidney_scaled['classification'] = df_kidney_scaled['classification'].astype(str).str.replace(r'\t', '', regex=True).str.strip()
    df_kidney_scaled['classification'] = df_kidney_scaled['classification'].map({'ckd': 1, 'notckd': 0})
    df_kidney_scaled['classification'] = df_kidney_scaled['classification'].fillna(0).astype(int)

feature_order = cont_features + cat_features
X_kidney = df_kidney_scaled[feature_order].values
y_kidney = df_kidney_scaled["classification"].values

X_train_k, _, y_train_k, _ = train_test_split(X_kidney, y_kidney, test_size=0.2, random_state=42)
X_train_k_tensor = torch.FloatTensor(X_train_k)
y_train_k_tensor = torch.LongTensor(y_train_k).squeeze()

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

torch.manual_seed(42)
model_kidney = KidneyANN(input_feature=len(feature_order))
opt_kidney = torch.optim.Adam(model_kidney.parameters(), lr=0.01)

for epoch in range(500):
    y_pred = model_kidney(X_train_k_tensor)
    loss = loss_fn(y_pred, y_train_k_tensor)
    opt_kidney.zero_grad()
    loss.backward()
    opt_kidney.step()

torch.save(model_kidney.state_dict(), "backend/kidney_state_dict.pt")
joblib.dump(scaler_kidney, "backend/kidney_scaler.pkl")
joblib.dump(label_encoders, "backend/kidney_label_encoders.pkl")
print("Kidney model trained and saved.")

# Save feature lists for reference
with open("backend/kidney_features.txt", "w") as f:
    f.write(",".join(feature_order))

print("\nAll models trained successfully!")
