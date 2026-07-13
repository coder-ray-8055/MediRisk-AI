"""
ANN Model Definition for Diabetes Prediction.
This must exactly match the architecture used during training (part3.py)
so that PyTorch can deserialize diabetes.pt correctly.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class ANN_Model(nn.Module):
    def __init__(self, input_features=8, hidden1=20, hidden2=20, out_features=2):
        super().__init__()
        self.f_connected1 = nn.Linear(input_features, hidden1)
        self.f_connected2 = nn.Linear(hidden1, hidden2)
        self.out = nn.Linear(hidden2, out_features)

    def forward(self, x):
        x = F.relu(self.f_connected1(x))
        x = F.relu(self.f_connected2(x))
        x = self.out(x)
        return x


def load_model(model_path="diabetes_state_dict.pt"):
    model = ANN_Model()
    model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
    model.eval()
    return model


def predict(model, input_data):
    """
    Run prediction on the given input data.
    input_data: list of 8 floats [pregnancies, glucose, bp, skin, insulin, bmi, pedigree, age]
    Returns: dict with predicted_class (0 or 1), status string, and raw scores
    """
    tensor_data = torch.FloatTensor(input_data)

    with torch.no_grad():
        output = model(tensor_data)
        predicted_class = output.argmax().item()

        # Apply softmax to get confidence percentages
        probabilities = torch.softmax(output, dim=0)
        confidence = probabilities[predicted_class].item() * 100

    if predicted_class == 1:
        status = "Diabetic"
        message = "Patient is likely Diabetic. Please consult a qualified doctor for medical advice."
    else:
        status = "Non-Diabetic"
        message = "Patient is likely Non-Diabetic. Maintain a healthy lifestyle and regular check-ups."

    return {
        "predicted_class": predicted_class,
        "status": status,
        "message": message,
        "confidence": round(confidence, 2),
        "raw_scores": output.tolist()
    }
