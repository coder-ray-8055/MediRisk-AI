"""
PDF Report Generator for AI Smart Hospital - Diabetes Health Assessment.
Uses ReportLab to generate a professional, multi-page medical report PDF.
This approach guarantees no empty/blank pages.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.platypus.flowables import Flowable
from io import BytesIO
from datetime import datetime


# ── Color Palette ──────────────────────────────────────────────────────
PRIMARY_RED = HexColor("#C62828")
DARK_RED = HexColor("#8E0000")
LIGHT_RED = HexColor("#FFEBEE")
ACCENT_GRAY = HexColor("#F5F5F5")
BORDER_GRAY = HexColor("#E0E0E0")
TEXT_DARK = HexColor("#333333")
TEXT_MEDIUM = HexColor("#555555")
TEXT_LIGHT = HexColor("#888888")
SUCCESS_GREEN = HexColor("#2E7D32")
WARNING_ORANGE = HexColor("#E65100")


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
        self.canv.roundRect(0, 0, self.box_width, self.box_height, 4, fill=1, stroke=0)
        self.canv.setFillColor(self.text_color)
        self.canv.setFont("Helvetica-Bold", self.font_size)
        self.canv.drawCentredString(
            self.box_width / 2, (self.box_height - self.font_size) / 2 + 1, self.text
        )


def _get_styles():
    """Create and return all paragraph styles used in the report."""
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        textColor=PRIMARY_RED,
        alignment=TA_CENTER,
        spaceAfter=4 * mm,
    ))

    styles.add(ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        textColor=TEXT_MEDIUM,
        alignment=TA_CENTER,
        spaceAfter=8 * mm,
    ))

    styles.add(ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        textColor=PRIMARY_RED,
        spaceBefore=6 * mm,
        spaceAfter=3 * mm,
        borderWidth=0,
        borderPadding=0,
    ))

    styles.add(ParagraphStyle(
        "FieldLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        textColor=TEXT_DARK,
    ))

    styles.add(ParagraphStyle(
        "FieldValue",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=TEXT_MEDIUM,
    ))

    styles.add(ParagraphStyle(
        "BodyText2",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=TEXT_DARK,
        leading=15,
        alignment=TA_JUSTIFY,
    ))

    styles.add(ParagraphStyle(
        "SmallGray",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        textColor=TEXT_LIGHT,
        alignment=TA_CENTER,
    ))

    styles.add(ParagraphStyle(
        "DisclaimerText",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        textColor=TEXT_LIGHT,
        leading=13,
        alignment=TA_JUSTIFY,
        spaceBefore=3 * mm,
    ))

    return styles


def _header_footer(canvas, doc):
    """Draw header and footer on every page."""
    canvas.saveState()
    width, height = A4

    # ── Header bar ──
    canvas.setFillColor(PRIMARY_RED)
    canvas.rect(0, height - 18 * mm, width, 18 * mm, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawCentredString(width / 2, height - 12 * mm, "AI SMART HOSPITAL")
    canvas.setFont("Helvetica", 8)
    canvas.drawCentredString(width / 2, height - 16 * mm, "Diabetes Health Assessment Report")

    # ── Footer ──
    canvas.setStrokeColor(BORDER_GRAY)
    canvas.setLineWidth(0.5)
    canvas.line(20 * mm, 12 * mm, width - 20 * mm, 12 * mm)
    canvas.setFillColor(TEXT_LIGHT)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(20 * mm, 8 * mm, f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}")
    canvas.drawRightString(width - 20 * mm, 8 * mm, f"Page {doc.page}")

    canvas.restoreState()


def _section_divider():
    """Return a horizontal rule flowable."""
    return HRFlowable(
        width="100%", thickness=0.5, color=BORDER_GRAY,
        spaceBefore=3 * mm, spaceAfter=3 * mm
    )


def _info_table(data, col_widths=None):
    """Build a two-column info table with alternating row colors."""
    if col_widths is None:
        col_widths = [55 * mm, 95 * mm]

    table = Table(data, colWidths=col_widths)
    style_commands = [
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (0, -1), TEXT_DARK),
        ("TEXTCOLOR", (1, 0), (1, -1), TEXT_MEDIUM),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
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
    Generate a professional PDF report from the provided patient data.

    Args:
        data: dict containing all patient information, prediction results,
              symptoms, family history, and lifestyle data.

    Returns:
        BytesIO buffer containing the complete PDF.
    """
    buffer = BytesIO()
    styles = _get_styles()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=25 * mm,
        bottomMargin=20 * mm,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        title="AI Smart Hospital - Diabetes Health Assessment Report",
        author="AI Smart Hospital",
    )

    story = []

    # ── Title ──────────────────────────────────────────────────────────
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("AI SMART HOSPITAL", styles["ReportTitle"]))
    story.append(Paragraph("Diabetes Health Assessment Report", styles["ReportSubtitle"]))
    story.append(Paragraph(
        f"Report Date: {datetime.now().strftime('%B %d, %Y  •  %I:%M %p')}",
        styles["SmallGray"]
    ))
    story.append(Spacer(1, 4 * mm))
    story.append(_section_divider())

    # ── Section 1: Patient Information ────────────────────────────────
    story.append(Paragraph("1. Patient Information", styles["SectionHeading"]))
    patient_info = [
        ["Age", str(data.get("age", "N/A"))],
        ["Gender", data.get("gender", "N/A").capitalize()],
        ["Pregnancies", str(data.get("followup_pregnancies", data.get("pregnancies", "N/A")))],
        ["Reason for Visit", data.get("reason_for_visit", "N/A")],
    ]
    story.append(_info_table(patient_info))
    story.append(_section_divider())

    # ── Section 2: ANN Prediction ────────────────────────────────────
    story.append(Paragraph("2. ANN Prediction Result", styles["SectionHeading"]))

    pred_status = data.get("prediction_status", "Unknown")
    is_diabetic = pred_status == "Diabetic"
    status_color = PRIMARY_RED if is_diabetic else SUCCESS_GREEN
    confidence = data.get("confidence", "N/A")

    pred_data = [
        ["Prediction Status", pred_status],
        ["Likelihood", "High Risk" if is_diabetic else "Low Risk"],
        ["Confidence", f"{confidence}%"],
    ]
    story.append(_info_table(pred_data))
    story.append(_section_divider())

    # ── Section 3: Medical Inputs ─────────────────────────────────────
    story.append(Paragraph("3. Medical Inputs", styles["SectionHeading"]))
    medical_inputs = [
        ["Pregnancies", str(data.get("pregnancies", "N/A"))],
        ["Glucose (mg/dL)", str(data.get("glucose", "N/A"))],
        ["Blood Pressure (mm Hg)", str(data.get("blood_pressure", "N/A"))],
        ["Skin Thickness (mm)", str(data.get("skin_thickness", "N/A"))],
        ["Insulin (mu U/ml)", str(data.get("insulin", "N/A"))],
        ["BMI", str(data.get("bmi", "N/A"))],
        ["Diabetes Pedigree Function", str(data.get("diabetes_pedigree", "N/A"))],
        ["Age (years)", str(data.get("age", "N/A"))],
    ]
    story.append(_info_table(medical_inputs))
    story.append(_section_divider())

    # ── Section 4: Patient Symptoms ───────────────────────────────────
    story.append(Paragraph("4. Patient Symptoms", styles["SectionHeading"]))

    symptoms = data.get("symptoms", {})
    symptom_labels = {
        "excessive_thirst": "Excessive Thirst",
        "frequent_urination": "Frequent Urination",
        "sudden_weight_loss": "Sudden Weight Loss",
        "fatigue": "Fatigue",
        "blurred_vision": "Blurred Vision",
        "slow_wound_healing": "Slow Wound Healing",
        "frequent_infections": "Frequent Infections",
        "numbness": "Numbness in Hands/Feet",
    }

    symptom_data = []
    for key, label in symptom_labels.items():
        val = symptoms.get(key, "no")
        icon = "YES" if val == "yes" else "NO"
        symptom_data.append([label, icon])

    story.append(_info_table(symptom_data))
    story.append(_section_divider())

    # ── Section 5: Family History ─────────────────────────────────────
    story.append(Paragraph("5. Family History", styles["SectionHeading"]))
    family_count = data.get("family_diabetic_count", "0")
    family_text = f"{family_count} family member(s) have been diagnosed with diabetes."
    if int(family_count) > 0:
        family_text += " This increases the patient's risk factor."
    story.append(Paragraph(family_text, styles["BodyText2"]))
    story.append(_section_divider())

    # ── Section 6: Lifestyle Assessment ───────────────────────────────
    story.append(Paragraph("6. Lifestyle Assessment", styles["SectionHeading"]))
    lifestyle = data.get("lifestyle", {})
    lifestyle_data = [
        ["Regular Exercise", lifestyle.get("exercise", "N/A").capitalize()],
        ["Exercise Days/Week", str(lifestyle.get("exercise_days", "N/A"))],
        ["Sugary Food Intake", lifestyle.get("sugary_food", "N/A").capitalize()],
        ["Smoking", lifestyle.get("smoking", "N/A").capitalize()],
        ["Alcohol Consumption", lifestyle.get("alcohol", "N/A").capitalize()],
    ]
    story.append(_info_table(lifestyle_data))
    story.append(_section_divider())

    # ── Section 7: Risk Summary ──────────────────────────────────────
    story.append(Paragraph("7. Risk Summary", styles["SectionHeading"]))

    # Build dynamic risk summary
    risk_factors = []
    if is_diabetic:
        risk_factors.append("the ANN model predicted a diabetic outcome")

    symptom_count = sum(1 for v in symptoms.values() if v == "yes")
    if symptom_count >= 4:
        risk_factors.append(f"the patient reports {symptom_count} out of 8 common diabetes symptoms")
    elif symptom_count > 0:
        risk_factors.append(f"the patient reports {symptom_count} diabetes-related symptom(s)")

    if int(family_count) > 0:
        risk_factors.append(f"{family_count} family member(s) have a diabetes diagnosis")

    if lifestyle.get("exercise", "no") == "no":
        risk_factors.append("the patient does not exercise regularly")
    if lifestyle.get("smoking", "no").lower() in ["yes", "y"]:
        risk_factors.append("the patient is a smoker")
    if lifestyle.get("alcohol", "no").lower() in ["yes", "y"]:
        risk_factors.append("the patient consumes alcohol")

    if risk_factors:
        summary = "Based on the provided information, " + ", ".join(risk_factors) + ". "
        summary += "These factors suggest an elevated risk profile that warrants professional medical evaluation."
    else:
        summary = ("Based on the provided information, the patient shows a relatively low-risk profile. "
                    "However, regular health check-ups and a healthy lifestyle are always recommended.")

    story.append(Paragraph(summary, styles["BodyText2"]))
    story.append(_section_divider())

    # ── Section 8: Recommendations ────────────────────────────────────
    story.append(Paragraph("8. Recommendations", styles["SectionHeading"]))
    recommendations = [
        "Maintain a healthy, balanced diet rich in whole grains, vegetables, and lean protein.",
        "Engage in regular physical exercise (at least 150 minutes per week).",
        "Monitor blood sugar levels regularly, especially if risk factors are present.",
        "Consult a qualified healthcare professional if symptoms persist or worsen.",
        "Maintain a healthy weight appropriate for your age and height.",
        "Avoid smoking and limit tobacco usage.",
        "Limit consumption of sugary drinks, processed foods, and refined carbohydrates.",
        "Stay hydrated and ensure adequate sleep (7-9 hours per night).",
    ]
    for i, rec in enumerate(recommendations, 1):
        story.append(Paragraph(f"<b>{i}.</b>  {rec}", styles["BodyText2"]))
        story.append(Spacer(1, 1.5 * mm))

    story.append(_section_divider())

    # ── Section 9: Disclaimer ─────────────────────────────────────────
    story.append(Paragraph("9. Disclaimer", styles["SectionHeading"]))
    disclaimer = (
        "This AI prediction is intended for educational and screening purposes only. "
        "It should not replace professional medical advice, diagnosis, or treatment. "
        "Always seek the advice of a qualified healthcare provider with any questions "
        "regarding a medical condition. Never disregard professional medical advice or "
        "delay in seeking it because of results obtained from this screening tool."
    )
    story.append(Paragraph(disclaimer, styles["DisclaimerText"]))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("— AI Smart Hospital™", styles["SmallGray"]))

    # ── Build PDF ─────────────────────────────────────────────────────
    doc.build(story, onFirstPage=_header_footer, onLaterPages=_header_footer)
    buffer.seek(0)
    return buffer
