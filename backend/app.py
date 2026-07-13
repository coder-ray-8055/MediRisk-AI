"""
Flask API Server for AI Smart Hospital - Diabetes Prediction System.
Endpoints:
  POST /api/predict         - Run ANN prediction on patient medical inputs
  POST /api/generate_report - Generate and download the PDF report
"""

import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from model import load_model, predict
from report_generator import generate_report

app = Flask(__name__)
CORS(app)

# ── Load model at startup ──────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "diabetes_state_dict.pt")

model = None
try:
    model = load_model(MODEL_PATH)
    print(f"[✓] Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"[✗] Could not load model: {e}")
    print("    Make sure diabetes.pt is placed in the backend/ folder.")


@app.route("/api/predict", methods=["POST"])
def api_predict():
    """
    Expects JSON body:
    {
        "pregnancies": float,
        "glucose": float,
        "blood_pressure": float,
        "skin_thickness": float,
        "insulin": float,
        "bmi": float,
        "diabetes_pedigree": float,
        "age": float
    }
    """
    if model is None:
        return jsonify({"error": "Model not loaded. Place diabetes.pt in the backend folder."}), 500

    try:
        data = request.get_json()

        required_fields = [
            "pregnancies", "glucose", "blood_pressure", "skin_thickness",
            "insulin", "bmi", "diabetes_pedigree", "age"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        input_data = [
            float(data["pregnancies"]),
            float(data["glucose"]),
            float(data["blood_pressure"]),
            float(data["skin_thickness"]),
            float(data["insulin"]),
            float(data["bmi"]),
            float(data["diabetes_pedigree"]),
            float(data["age"]),
        ]

        result = predict(model, input_data)
        return jsonify(result)

    except ValueError as e:
        return jsonify({"error": f"Invalid input value: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


@app.route("/api/generate_report", methods=["POST"])
def api_generate_report():
    """
    Expects JSON body with all patient data, prediction results,
    symptoms, family history, and lifestyle information.
    Returns a PDF file.
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        pdf_buffer = generate_report(data)

        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name="AI_Smart_Hospital_Diabetes_Report.pdf"
        )

    except Exception as e:
        return jsonify({"error": f"Report generation failed: {str(e)}"}), 500


@app.route("/api/health", methods=["GET"])
def health_check():
    """Simple health check endpoint."""
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
