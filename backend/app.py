import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from model import load_all_models, predict_diabetes, predict_heart, predict_kidney
from report_generator import generate_report

app = Flask(__name__)
CORS(app)

# Load all models at server startup
load_all_models()

@app.route("/api/predict/diabetes", methods=["POST"])
@app.route("/api/predict", methods=["POST"])  # Alias for backward compatibility
def api_predict_diabetes():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = [
            "pregnancies", "glucose", "blood_pressure", "skin_thickness",
            "insulin", "bmi", "diabetes_pedigree", "age"
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
                
        result = predict_diabetes(data)
        return jsonify(result)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/api/predict/heart", methods=["POST"])
def api_predict_heart():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = [
            "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", 
            "thalachh", "exang", "oldpeak", "slope", "ca", "thal"
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
                
        result = predict_heart(data)
        return jsonify(result)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/api/predict/kidney", methods=["POST"])
def api_predict_kidney():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = [
            "age", "bp", "sg", "al", "su", "bgr", "bu", "sc", "sod", "pot", 
            "hemo", "pcv", "wc", "rc", "rbc", "pc", "pcc", "ba", "htn", "dm", 
            "cad", "appet", "pe", "ane"
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
                
        result = predict_kidney(data)
        return jsonify(result)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/api/generate_report", methods=["POST"])
def api_generate_report():
    """
    Expects JSON body with:
    {
      "disease": "diabetes" | "heart" | "kidney",
      "medicalInputs": { ... },
      "prediction": { ... },
      "followup": { ... }
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        disease = data.get("disease", "diabetes")
        pdf_buffer = generate_report(data)
        
        filename = f"DiabetePred_{disease.capitalize()}_Risk_Report.pdf"
        
        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Report generation failed: {str(e)}"}), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    from model import _models
    return jsonify({
        "status": "ok",
        "loaded_models": list(_models.keys())
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
