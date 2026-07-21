"""
PDF Report Generator for AI Smart Hospital - Multi-Disease Risk Assessment.
Uses ReportLab to generate a professional, multi-page medical report PDF.
Supports Diabetes, Heart Disease, and Chronic Kidney Disease dynamically.
This approach guarantees no empty/blank pages.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.platypus.flowables import Flowable
from io import BytesIO
from datetime import datetime

# ── Color Palette Definitions ─────────────────────────────────────────
ACCENT_GRAY = HexColor("#F8FAFC")
BORDER_GRAY = HexColor("#E2E8F0")
TEXT_DARK = HexColor("#1E293B")
TEXT_MEDIUM = HexColor("#475569")
TEXT_LIGHT = HexColor("#64748B")

# Disease Specific Branding Colors
DISEASE_THEMES = {
    "diabetes": {
        "primary": HexColor("#0F6FFF"),       # Clinical Blue
        "secondary": HexColor("#EAF2FF"),
        "title": "Diabetes Health Assessment Report"
    },
    "heart": {
        "primary": HexColor("#E03E3E"),         # Crimson Red
        "secondary": HexColor("#FFEBEB"),
        "title": "Heart Disease Risk Assessment Report"
    },
    "kidney": {
        "primary": HexColor("#0D9488"),        # Teal
        "secondary": HexColor("#E6F7F5"),
        "title": "Chronic Kidney Disease Assessment Report"
    }
}

# Field Mappings for Medical Inputs
FIELD_LABELS = {
    "diabetes": {
        "pregnancies": "Pregnancies",
        "glucose": "Glucose (mg/dL)",
        "blood_pressure": "Blood Pressure (mm Hg)",
        "skin_thickness": "Skin Thickness (mm)",
        "insulin": "Insulin (mu U/ml)",
        "bmi": "BMI (Body Mass Index)",
        "diabetes_pedigree": "Diabetes Pedigree Function",
        "age": "Age (years)"
    },
    "heart": {
        "age": "Age (years)",
        "sex": "Gender (1 = Male, 0 = Female)",
        "cp": "Chest Pain Type (0 = Typical, 1 = Atypical, 2 = Non-anginal, 3 = Asymptomatic)",
        "trestbps": "Resting Blood Pressure (mm Hg)",
        "chol": "Serum Cholestoral (mg/dL)",
        "fbs": "Fasting Blood Sugar > 120 mg/dL (1 = True, 0 = False)",
        "restecg": "Resting Electrocardiographic Results (0-2)",
        "thalachh": "Maximum Heart Rate Achieved",
        "exang": "Exercise Induced Angina (1 = Yes, 0 = No)",
        "oldpeak": "ST Depression Induced by Exercise",
        "slope": "Slope of the Peak Exercise ST Segment (0-2)",
        "ca": "Number of Major Vessels Coloured by Fluoroscopy (0-3)",
        "thal": "Thalassemia Type (1 = Normal, 2 = Fixed Defect, 3 = Reversable Defect)"
    },
    "kidney": {
        "age": "Age (years)",
        "bp": "Blood Pressure (mm Hg)",
        "sg": "Specific Gravity (1.005 - 1.025)",
        "al": "Albumin (0-5)",
        "su": "Sugar (0-5)",
        "bgr": "Blood Glucose Random (mg/dL)",
        "bu": "Blood Urea (mg/dL)",
        "sc": "Serum Creatinine (mg/dL)",
        "sod": "Sodium (mEq/L)",
        "pot": "Potassium (mEq/L)",
        "hemo": "Hemoglobin (g/dL)",
        "pcv": "Packed Cell Volume (%)",
        "wc": "White Blood Cell Count (cells/cumm)",
        "rc": "Red Blood Cell Count (million/cmm)",
        "rbc": "Red Blood Cells (Normal / Abnormal)",
        "pc": "Pus Cell (Normal / Abnormal)",
        "pcc": "Pus Cell Clumps (Present / Not Present)",
        "ba": "Bacteria (Present / Not Present)",
        "htn": "Hypertension (Yes / No)",
        "dm": "Diabetes Mellitus (Yes / No)",
        "cad": "Coronary Artery Disease (Yes / No)",
        "appet": "Appetite (Good / Poor)",
        "pe": "Pedal Edema (Yes / No)",
        "ane": "Anemia (Yes / No)"
    }
}

class ColoredBox(Flowable):
    """A custom flowable that draws a colored rounded rectangle behind text."""
    def __init__(self, text, bg_color, text_color, width, height=28, font_size=14):
        Flowable.__init__(self)
        self.text = text
        self.bg_color = bg_color
        self.text_color = text_color
        self.box_width = width
        self.box_height = height
        self.font_size = font_size
        self.width = width
        self.height = height

    def draw(self):
        self.canv.setFillColor(self.bg_color)
        self.canv.roundRect(0, 0, self.box_width, self.box_height, 6, fill=1, stroke=0)
        self.canv.setFillColor(self.text_color)
        self.canv.setFont("Helvetica-Bold", self.font_size)
        self.canv.drawCentredString(
            self.box_width / 2, (self.box_height - self.font_size) / 2 + 1, self.text
        )

def _get_styles(theme_color):
    """Create and return all paragraph styles used in the report."""
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        textColor=theme_color,
        alignment=TA_CENTER,
        spaceAfter=3 * mm,
    ))

    styles.add(ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        textColor=TEXT_MEDIUM,
        alignment=TA_CENTER,
        spaceAfter=6 * mm,
    ))

    styles.add(ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        textColor=theme_color,
        spaceBefore=5 * mm,
        spaceAfter=2.5 * mm,
        borderWidth=0,
        borderPadding=0,
    ))

    styles.add(ParagraphStyle(
        "FieldLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        textColor=TEXT_DARK,
    ))

    styles.add(ParagraphStyle(
        "FieldValue",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        textColor=TEXT_MEDIUM,
    ))

    styles.add(ParagraphStyle(
        "BodyText2",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        textColor=TEXT_DARK,
        leading=13.5,
        alignment=TA_JUSTIFY,
    ))

    styles.add(ParagraphStyle(
        "SmallGray",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        textColor=TEXT_LIGHT,
        alignment=TA_CENTER,
    ))

    styles.add(ParagraphStyle(
        "DisclaimerText",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=8,
        textColor=TEXT_LIGHT,
        leading=11.5,
        alignment=TA_JUSTIFY,
        spaceBefore=2.5 * mm,
    ))

    return styles

def _section_divider():
    """Return a horizontal rule flowable."""
    return HRFlowable(
        width="100%", thickness=0.5, color=BORDER_GRAY,
        spaceBefore=2.5 * mm, spaceAfter=2.5 * mm
    )

def _info_table(data, col_widths=None):
    """Build a two-column info table with alternating row colors."""
    if col_widths is None:
        col_widths = [65 * mm, 105 * mm]

    # Convert all content to Paragraphs to enable auto-wrap
    style_label = ParagraphStyle("TLabel", fontName="Helvetica-Bold", fontSize=9, textColor=TEXT_DARK)
    style_val = ParagraphStyle("TVal", fontName="Helvetica", fontSize=9, textColor=TEXT_MEDIUM, leading=11)
    
    formatted_data = []
    for row in data:
        label_p = Paragraph(str(row[0]), style_label)
        val_p = Paragraph(str(row[1]), style_val)
        formatted_data.append([label_p, val_p])

    table = Table(formatted_data, colWidths=col_widths)
    style_commands = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -2), 0.3, BORDER_GRAY),
    ]
    # Alternating row backgrounds
    for i in range(len(data)):
        if i % 2 == 0:
            style_commands.append(("BACKGROUND", (0, i), (-1, i), ACCENT_GRAY))

    table.setStyle(TableStyle(style_commands))
    return table

def generate_report(data):
    """
    Generate a professional PDF report from the provided patient and prediction data.
    """
    # ── Normalize Data Structure ──
    # Supports both flat structure (legacy compatibility) and new nested structure
    disease = data.get("disease", "diabetes").lower()
    if disease not in DISEASE_THEMES:
        disease = "diabetes"
        
    theme = DISEASE_THEMES[disease]
    theme_color = theme["primary"]
    
    # Extract sections
    medical_inputs = data.get("medicalInputs", {})
    prediction = data.get("prediction", {})
    followup = data.get("followup", {})
    
    # Fallback to flat dictionary if nested objects are empty
    if not medical_inputs:
        medical_inputs = data
    if not prediction:
        pred_status = data.get("prediction_status", "Unknown")
        prediction = {
            "status": pred_status,
            "confidence": data.get("confidence", 0.0),
            "message": data.get("message", "")
        }
    if not followup:
        followup = {
            "symptoms": data.get("symptoms", {}),
            "lifestyle": data.get("lifestyle", {}),
            "family_diabetic_count": data.get("family_diabetic_count", "0"),
            "medical_history": data.get("medical_history", "")
        }

    buffer = BytesIO()
    styles = _get_styles(theme_color)

    # Margins and layout configs
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=22 * mm,
        bottomMargin=18 * mm,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        title=f"AI Smart Hospital - {theme['title']}",
        author="AI Smart Hospital",
    )

    story = []

    # Dynamic Header / Footer callback
    def header_footer_callback(canvas, doc):
        canvas.saveState()
        width, height = A4

        # Header bar
        canvas.setFillColor(theme_color)
        canvas.rect(0, height - 16 * mm, width, 16 * mm, fill=1, stroke=0)
        canvas.setFillColor(white)
        canvas.setFont("Helvetica-Bold", 11)
        canvas.drawCentredString(width / 2, height - 10 * mm, "AI SMART HOSPITAL")
        canvas.setFont("Helvetica", 7.5)
        canvas.drawCentredString(width / 2, height - 13.5 * mm, theme['title'])

        # Footer
        canvas.setStrokeColor(BORDER_GRAY)
        canvas.setLineWidth(0.5)
        canvas.line(18 * mm, 12 * mm, width - 18 * mm, 12 * mm)
        canvas.setFillColor(TEXT_LIGHT)
        canvas.setFont("Helvetica", 7)
        canvas.drawString(18 * mm, 8 * mm, f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}")
        canvas.drawRightString(width - 18 * mm, 8 * mm, f"Page {doc.page}")

        canvas.restoreState()

    # ── Title ──────────────────────────────────────────────────────────
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("AI SMART HOSPITAL", styles["ReportTitle"]))
    story.append(Paragraph(theme['title'], styles["ReportSubtitle"]))
    story.append(Paragraph(
        f"Assessment Date: {datetime.now().strftime('%B %d, %Y  •  %I:%M %p')}",
        styles["SmallGray"]
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(_section_divider())

    # ── Section 1: Patient Profile ────────────────────────────────────
    story.append(Paragraph("1. Patient Profile", styles["SectionHeading"]))
    age = medical_inputs.get("age", followup.get("age", followup.get("lifestyle", {}).get("age", "N/A")))
    gender_val = medical_inputs.get("sex", followup.get("gender", "N/A"))
    
    # Map sex code to string
    if str(gender_val) == "1" or str(gender_val).lower() == "male":
        gender = "Male"
    elif str(gender_val) == "0" or str(gender_val).lower() == "female":
        gender = "Female"
    else:
        gender = "N/A"
        
    patient_info = [
        ["Age Profile", f"{age} years"],
        ["Biological Sex", gender],
        ["Target Assessment", disease.capitalize() + " Risk Profile"],
    ]
    story.append(_info_table(patient_info))
    story.append(_section_divider())

    # ── Section 2: AI Predictive Analysis ─────────────────────────────
    story.append(Paragraph("2. AI Predictive Analysis", styles["SectionHeading"]))
    pred_status = prediction.get("status", "Unknown")
    confidence = prediction.get("confidence", "0.0")
    pred_msg = prediction.get("message", "N/A")
    
    # Determine severity colors
    is_high_risk = pred_status.lower() in ["diabetic", "high risk", "positive", "ckd"]
    status_label = "HIGH RISK WARNING" if is_high_risk else "LOW RISK/NORMAL"
    box_bg = HexColor("#FEE2E2") if is_high_risk else HexColor("#DCFCE7")
    box_fg = HexColor("#991B1B") if is_high_risk else HexColor("#166534")

    pred_table_data = [
        ["Model Prediction Class", f"<b>{pred_status}</b>"],
        ["AI Risk Status", status_label],
        ["Prediction Confidence", f"{confidence}%"],
        ["Clinical Guidance Note", pred_msg],
    ]
    story.append(_info_table(pred_table_data))
    story.append(Spacer(1, 3 * mm))
    
    # Floating Colored Alert Box
    alert_box_width = A4[0] - 36 * mm
    alert_msg = f"STATUS: {pred_status} ({confidence}% CONFIDENCE)"
    story.append(ColoredBox(alert_msg, box_bg, box_fg, alert_box_width, height=24, font_size=10))
    story.append(_section_divider())

    # ── Section 3: Diagnostic Input Parameters ────────────────────────
    story.append(Paragraph("3. Clinical / Diagnostic Inputs Evaluated", styles["SectionHeading"]))
    
    # Build list of medical inputs dynamically based on the disease mappings
    mappings = FIELD_LABELS.get(disease, {})
    inputs_data = []
    for key, label in mappings.items():
        val = medical_inputs.get(key, "N/A")
        # Format values cleanly
        if isinstance(val, float):
            val = round(val, 3)
        inputs_data.append([label, str(val)])
        
    story.append(_info_table(inputs_data))
    story.append(_section_divider())

    # ── Section 4: Follow-up & Lifestyle Indicators ───────────────────
    story.append(Paragraph("4. Follow-up & Lifestyle Assessment", styles["SectionHeading"]))
    
    followup_data = []
    
    # Symptoms
    symptoms = followup.get("symptoms", {})
    if symptoms:
        symptom_strs = []
        for sym_key, sym_val in symptoms.items():
            if str(sym_val).lower() == "yes" or sym_val is True:
                symptom_strs.append(sym_key.replace("_", " ").capitalize())
        
        symptoms_summary = ", ".join(symptom_strs) if symptom_strs else "No severe symptoms reported."
        followup_data.append(["Reported Symptoms", symptoms_summary])
        
    # Lifestyle
    lifestyle = followup.get("lifestyle", {})
    if lifestyle:
        l_details = []
        for l_key, l_val in lifestyle.items():
            # Skip age/gender if present in lifestyle
            if l_key in ["age", "gender", "sex"]:
                continue
            l_details.append(f"{l_key.replace('_', ' ').capitalize()}: {str(l_val).capitalize()}")
        if l_details:
            followup_data.append(["Lifestyle Indicators", "; ".join(l_details)])

    # Family history or background count
    fam_count = followup.get("family_diabetic_count", followup.get("family_history_count", "0"))
    if str(fam_count) != "0" and fam_count:
        followup_data.append(["Family Genetic Background", f"{fam_count} family member(s) diagnosed with related illnesses."])

    # General Medical History
    history = followup.get("medical_history", "")
    if history:
        followup_data.append(["Past Medical History", history])

    if not followup_data:
        followup_data.append(["Evaluation Parameters", "No optional lifestyle parameters or symptoms logged."])
        
    story.append(_info_table(followup_data))
    story.append(_section_divider())

    # ── Section 5: Risk Recommendations & Prevention ─────────────────
    story.append(Paragraph("5. AI Preventive Recommendations", styles["SectionHeading"]))
    
    # Disease-specific recommendations
    disease_recs = {
        "diabetes": [
            "Maintain a low glycemic, balanced diet high in fiber and green vegetables.",
            "Engage in regular physical activity (minimum of 30 minutes of aerobic exercise, 5 days a week).",
            "Monitor fasting and postprandial blood glucose levels regularly.",
            "Limit the intake of sugary foods, carbohydrates, and highly processed items.",
            "Maintain a healthy BMI index suitable for your age and height range."
        ],
        "heart": [
            "Maintain a heart-healthy diet low in saturated fats, trans fats, and sodium.",
            "Perform regular cardiovascular exercise (brisk walking, cycling, or swimming) to strengthen heart muscles.",
            "Consistently monitor resting blood pressure and lipid profile levels.",
            "Avoid active and passive smoking to preserve endothelial blood vessel linings.",
            "Practice stress-management techniques such as mindfulness or yoga."
        ],
        "kidney": [
            "Stay adequately hydrated; support filtration by drinking sufficient water daily.",
            "Strictly monitor serum creatinine, blood urea nitrogen (BUN), and glomerular filtration rate (GFR).",
            "Avoid overuse of over-the-counter NSAIDs (painkillers), which can cause acute kidney injury.",
            "Control and manage blood pressure and blood sugar, as they are primary drivers of renal strain.",
            "Maintain a low-sodium and moderately controlled protein diet to reduce renal workload."
        ]
    }
    
    recs = disease_recs.get(disease, [
        "Consult a clinical healthcare specialist for regular diagnostic screenings.",
        "Eat a highly balanced diet rich in leafy greens, whole grains, and lean proteins.",
        "Establish an active lifestyle with regular daily exercise.",
        "Avoid smoking, excessive alcohol intake, and consumption of processed foods."
    ])
    
    for i, rec in enumerate(recs, 1):
        story.append(Paragraph(f"<b>{i}.</b>  {rec}", styles["BodyText2"]))
        story.append(Spacer(1, 1 * mm))

    story.append(_section_divider())

    # ── Section 6: Medical Disclaimer ─────────────────────────────────
    story.append(Paragraph("6. Professional Clinical Disclaimer", styles["SectionHeading"]))
    disclaimer = (
        "This automated screening assessment and its outputs are powered by trained artificial neural networks "
        "and are intended strictly for educational and preliminary diagnostic evaluation purposes. "
        "It should NOT be utilized as a substitute for professional medical consultation, diagnosis, prognosis, "
        "or clinical prescription. Always contact a registered physician or health specialist with any queries "
        "pertaining to any severe medical conditions or symptoms."
    )
    story.append(Paragraph(disclaimer, styles["DisclaimerText"]))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("— AI Smart Hospital™ Security Protocol", styles["SmallGray"]))

    # ── Build PDF Document ──
    doc.build(story, onFirstPage=header_footer_callback, onLaterPages=header_footer_callback)
    buffer.seek(0)
    return buffer
