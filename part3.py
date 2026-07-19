# creating an ANN using pyTorch

import pandas as pd
import numpy as np
import seaborn as sns
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
import torch.nn.functional as F
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, accuracy_score

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, accuracy_score
from sklearn.metrics import classification_report
import joblib
import torch
import torch.nn as nn
import torch.nn.functional as F


df = pd.read_csv("dataset.csv")
print(df.head())

print(df.isnull().sum())

# df["Outcome"] = np.where(df["Outcome"] == 1, "Diabetic", "No Diabetic")
# print(df.head())

# sns.pairplot(df, hue="Outcome")

X = df.drop("Outcome", axis=1).values
y = df["Outcome"].values

X_train, X_test, y_train, y_test =train_test_split(X, y, test_size=0.2, random_state=0)

X_train = torch.FloatTensor(X_train)
X_test = torch.FloatTensor(X_test)

y_train = torch.LongTensor(y_train)
y_test = torch.LongTensor(y_test)

class ANN_Model(nn.Module):
    def __init__(self, input_features=8, hidden1 = 20, hidden2 = 20, out_features = 2):
        super().__init__()
        self.f_connected1 = nn.Linear(input_features, hidden1)
        self.f_connected2 = nn.Linear(hidden1, hidden2)
        self.out = nn.Linear(hidden2, out_features)
    
    def forward(self, x):
        x = F.relu(self.f_connected1(x))
        x = F.relu(self.f_connected2(x))
        x = self.out(x)
        return x
    

torch.manual_seed(20)
model = ANN_Model()

print(model.parameters())

loss_function = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr = 0.01)

epoch = 500
final_losses = []
for i in range(epoch):
    i = i + 1
    y_pred = model.forward(X_train)
    loss = loss_function(y_pred, y_train)
    final_losses.append(loss.item())
    if i%10== 1:
        print("Epoch number: {} and the loss : {}".format(i,loss.item()))
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()


plt.plot(range(epoch), final_losses)
plt.ylabel("Loss")
plt.xlabel("Epoch")
plt.show()

predictions = []
with torch.no_grad():
    for i, data in enumerate(X_test):
        y_pred = model(data)
        predictions.append(y_pred.argmax().item())
        print(y_pred.argmax().item())

cm = confusion_matrix(y_test, predictions)

score = accuracy_score(y_test, predictions)
print(score)

torch.save(model.state_dict(), "diabetes_state_dict.pt")
model = torch.load("diabetes.pt", weights_only=False)

print(model.eval())

# lst1 = [6.0, 130.0, 72.0, 40.0, 0.0, 25.6, 0.627, 45.0]
# new_data = torch.tensor(lst1)

# with torch.no_grad():
#     print(model(new_data))
#     print(model(new_data).argmax().item())

# ---------------- USER INPUT PREDICTION ----------------

print("\nEnter Patient Details:\n")

print("Enter the patient's medical details carefully.\n")

pregnancies = float(input("How many times has the patient been pregnant? : "))
glucose = float(input("Enter the Glucose Level (mg/dL): "))
blood_pressure = float(input("Enter the Blood Pressure (mm Hg): "))
skin_thickness = float(input("Enter the Skin Thickness (mm): "))
insulin = float(input("Enter the Insulin Level (mu U/ml): "))
bmi = float(input("Enter the Body Mass Index (BMI): "))
diabetes_pedigree = float(input("Enter Family History Score (usually between 0.1 and 2.5): "))
age = float(input("Enter the Age (in years): "))

user_data = [
    pregnancies,
    glucose,
    blood_pressure,
    skin_thickness,
    insulin,
    bmi,
    diabetes_pedigree,
    age
]

new_data = torch.FloatTensor(user_data)

model.eval()

with torch.no_grad():
    prediction = model(new_data)
    predicted_class = prediction.argmax().item()

print("\nPrediction Result")
if predicted_class == 1:
    print("Status : Patient is likely Diabetic.")
    print("Please consult a qualified doctor for medical advice.")
else:
    print("Status : Patient is likely Non-Diabetic.")
    print("Maintain a healthy lifestyle and regular check-ups.")

print("==Follow Up questions==")
print('Hello! I am your AI Health Assistant.\nI will ask you a few questions to estimate your diabetes risk.\nThis is not a medical diagnosis.')

print("===General questions===")
general = input("What brings you here today? ")
gender = input("Are you male or female: ").lower()
age = input("Enter your age: ")

if(gender == "male"):
    pregnancies = 0
else:
    pregnancies = int(input("Have you ever been pregnant? "))

print("===Symptoms based questions===")
thirst = input("Do you often feel excessive thirst(yes/no)? ").lower()
urine = input("Do you urinate frequently(yes/no)? ").lower()
weight = input("Have you experienced sudden weight loss(yes/no)? ").lower()
tired = input("Do you feel tired most of the time(yes/no)? ").lower()
vision = input("Do you have blurred vision(yes/no)? ").lower()
heal = input("Do your wounds heal slowly(yes/no)? ").lower()
infections = input("Do you experience frequent infections(yes/no)? ").lower()
numbness = input("Do you feel numbness in hands or feet(yes/no)? ").lower()

print("===Family based questions===")
family = input("How many in your family been diagnosed with diabetes: ")

print("===Lifestyle based questions===")
exercise = input("Do you exercise regularly(yes/no)? ").lower()
howMuch = int(input("How many days per week: "))
food = input("How often do you eat sugary foods or soft drinks: ")
smoke = input("Do you smoke: ")
alcohol = input("Do you drink alcohol: ")

# Heart disease model 

# df = pd.read_csv("heart.csv")

# df.replace("?", np.nan, inplace=True)

# for col in df.columns:
#     if col != "target":
#         df[col] = pd.to_numeric(df[col], errors="coerce")

# print(df.isnull().sum())

# for col in df.columns:
#     if col != "target":
#         if df[col].isnull().sum() > 0:
#             df[col] = df[col].fillna(df[col].median())

# print(df.isnull().sum())

# X = df.drop("target", axis=1)
# y = df["target"]

# continuous_features = [
#     "age",
#     "trestbps",
#     "chol",
#     "thalachh",
#     "oldpeak"
# ]

# print(X.head())

# X_train, X_test, y_train, y_test = train_test_split(
#     X,
#     y,
#     test_size=0.2,
#     random_state=42,
#     stratify=y
# )

# scaler = StandardScaler()

# X_train[continuous_features] = scaler.fit_transform(X_train[continuous_features])
# X_test[continuous_features] = scaler.transform(X_test[continuous_features])

# X_train_tensor = torch.FloatTensor(X_train.values)
# X_test_tensor = torch.FloatTensor(X_test.values)

# y_train_tensor = torch.LongTensor(y_train.values)
# y_test_tensor = torch.LongTensor(y_test.values)

# class HeartANN(nn.Module):
#     def __init__(self, input_feature=13, hidden1=32, hidden2=16, out_features=2):
#         super().__init__()

#         self.fc1 = nn.Linear(input_feature, hidden1)
#         self.fc2 = nn.Linear(hidden1, hidden2)
#         self.out = nn.Linear(hidden2, out_features)
    
#     def forward(self, x):
#         x = F.relu(self.fc1(x))
#         x = F.relu(self.fc2(x))
#         x = self.out(x)

#         return x
    
# torch.manual_seed(42)

# model = HeartANN()

# print(model)

# loss_function = nn.CrossEntropyLoss()
# optimizer = torch.optim.Adam(model.parameters(), lr = 0.01)

# epoch = 500
# final_losses = []
# for i in range(epoch):
#     i = i + 1
#     y_pred = model(X_train_tensor)
#     loss = loss_function(y_pred, y_train_tensor)
#     final_losses.append(loss.item())
#     if i%10== 1:
#         print("Epoch number: {} and the loss : {}".format(i,loss.item()))
#     optimizer.zero_grad()
#     loss.backward()
#     optimizer.step()


# plt.plot(range(epoch), final_losses)
# plt.ylabel("Loss")
# plt.xlabel("Epoch")
# plt.show()

# predictions = []
# with torch.no_grad():
#     for data in X_test_tensor:
#         y_pred = model(data)
#         predictions.append(y_pred.argmax().item())

# cm = confusion_matrix(y_test, predictions)
# print(cm)

# score = accuracy_score(y_test, predictions)
# print(score)

# print(classification_report(y_test, predictions))

# torch.save(model.state_dict(), "heart_state_dict.pt")
# joblib.dump(scaler, "heart_scaler.pkl")

# model = HeartANN()
# model.load_state_dict(torch.load("heart_state_dict.pt"))
# model.eval()

# scaler = joblib.load("heart_scaler.pkl")

# print("\n========== HEART DISEASE PREDICTION ==========\n")
# print("Please enter the patient's medical details carefully.\n")

# age = int(input("Enter Age (years): "))

# gender = input("Enter Gender (male/female): ").lower()
# if gender == "male":
#     sex = 1
# else:
#     sex = 0

# print("\nChest Pain Type:")
# print("0 = Typical Angina")
# print("1 = Atypical Angina")
# print("2 = Non-anginal Pain")
# print("3 = Asymptomatic")
# cp = int(input("Enter Chest Pain Type (0-3): "))

# trestbps = float(input("Enter Resting Blood Pressure (mm Hg): "))

# chol = float(input("Enter Serum Cholesterol (mg/dL): "))

# fbs = int(input("Is Fasting Blood Sugar > 120 mg/dL? (1 = Yes, 0 = No): "))

# print("\nResting ECG Results:")
# print("0 = Normal")
# print("1 = ST-T Wave Abnormality")
# print("2 = Left Ventricular Hypertrophy")
# restecg = int(input("Enter Resting ECG Result (0-2): "))

# thalachh = float(input("Enter Maximum Heart Rate Achieved: "))

# exang = int(input("Exercise Induced Angina? (1 = Yes, 0 = No): "))

# oldpeak = float(input("Enter ST Depression (Oldpeak): "))

# print("\nSlope of Peak Exercise ST Segment:")
# print("0 = Upsloping")
# print("1 = Flat")
# print("2 = Downsloping")
# slope = int(input("Enter Slope (0-2): "))

# ca = int(input("Enter Number of Major Vessels (0-4): "))

# print("\nThalassemia:")
# print("0 = Unknown")
# print("1 = Normal")
# print("2 = Mild Defect")
# print("3 = Moderate Defect")
# print("6 = Fixed Defect")
# print("7 = Reversible Defect")
# thal = int(input("Enter Thal value: "))

# user_data = [[
#     age, sex, cp, trestbps, chol,
#     fbs, restecg, thalachh,
#     exang, oldpeak, slope,
#     ca, thal
# ]]

# user_df = pd.DataFrame(user_data, columns=X.columns)

# user_df[continuous_features] = scaler.transform(user_df[continuous_features])

# new_data = torch.FloatTensor(user_df.values)
# model.eval()

# with torch.no_grad():
#     prediction = model(new_data)

#     predicted_class = prediction.argmax(dim=1).item()

#     probabilities = torch.softmax(prediction, dim=1)
#     confidence = torch.max(probabilities).item() * 100

# print(f"Confidence: {confidence:.2f}%")

# print("\n========== PREDICTION RESULT ==========\n")

# if predicted_class == 1:
#     print("Heart Disease Risk: HIGH")
#     print("The patient is likely to have Heart Disease.")
#     print("Please consult a qualified cardiologist for further evaluation.")
# else:
#     print("Heart Disease Risk: LOW")
#     print("The patient is unlikely to have Heart Disease.")
#     print("Maintain a healthy lifestyle and regular health check-ups.")

# print("\n========== FOLLOW-UP HEALTH ASSESSMENT ==========\n")
# print("Hello! I am your AI Heart Health Assistant.")
# print("I will ask you a few questions to better understand your heart health.")
# print("These questions are for awareness only and are NOT a medical diagnosis.\n")

# print("=== General Information ===")
# reason = input("What brings you here today? ")
# weight = float(input("Enter your weight (kg): "))
# height = float(input("Enter your height (cm): "))

# print("\n=== Symptoms ===")
# chest_pain = input("Do you often experience chest pain? (yes/no): ").lower()
# breath = input("Do you experience shortness of breath? (yes/no): ").lower()
# fatigue = input("Do you feel unusually tired? (yes/no): ").lower()
# palpitations = input("Do you feel rapid or irregular heartbeats? (yes/no): ").lower()
# dizziness = input("Do you experience dizziness or fainting? (yes/no): ").lower()
# swelling = input("Do you have swelling in your legs or ankles? (yes/no): ").lower()

# print("\n=== Family History ===")
# family_history = input("Has anyone in your immediate family had heart disease? (yes/no): ").lower()

# print("\n=== Lifestyle ===")
# exercise = input("Do you exercise regularly? (yes/no): ").lower()

# if exercise == "yes":
#     days = int(input("How many days per week do you exercise? "))
# else:
#     days = 0

# diet = input("How would you describe your diet? (healthy/average/unhealthy): ").lower()

# smoking = input("Do you smoke? (yes/no): ").lower()

# if smoking == "yes":
#     cigarettes = int(input("How many cigarettes do you smoke per day? "))
# else:
#     cigarettes = 0

# alcohol = input("Do you drink alcohol? (yes/no): ").lower()

# if alcohol == "yes":
#     frequency = input("How often do you drink? (occasionally/weekly/daily): ").lower()

# stress = input("Do you experience high stress in daily life? (yes/no): ").lower()

# sleep = float(input("How many hours do you sleep on average per night? "))

# print("\n=== Medical History ===")
# bp_history = input("Have you ever been diagnosed with high blood pressure? (yes/no): ").lower()
# diabetes_history = input("Do you have diabetes? (yes/no): ").lower()
# cholesterol_history = input("Have you ever been told you have high cholesterol? (yes/no): ").lower()
# medicines = input("Are you currently taking any heart-related medicines? (yes/no): ").lower()

# print("\nThank you for answering the questions.")
# print("Please discuss any concerning symptoms with a qualified healthcare professional.")