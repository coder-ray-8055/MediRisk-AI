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