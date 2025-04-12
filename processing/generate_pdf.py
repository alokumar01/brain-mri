import sys
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_pdf(output_path, data):
    doc = SimpleDocTemplate(output_path, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=18, textColor=colors.white, spaceAfter=12)
    label_style = ParagraphStyle('Label', parent=styles['Normal'], fontSize=12, textColor=colors.darkblue, fontName='Helvetica-Bold')
    value_style = ParagraphStyle('Value', parent=styles['Normal'], fontSize=12)
    
    story = []

    # Header with background
    header_data = [['MRI Report']]
    header_table = Table(header_data, colWidths=[6.5*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 18),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 0.2*inch))

    # Patient Details
    details_data = [
        [Paragraph('Patient ID:', label_style), Paragraph(data['pat_id'], value_style)],
        [Paragraph('Scan Date:', label_style), Paragraph(data['scan_date'], value_style)],
        [Paragraph('Description:', label_style), Paragraph(data['description'], value_style)],
        [Paragraph('Doctor ID:', label_style), Paragraph(data.get('doc_id', 'N/A'), value_style)],
    ]
    details_table = Table(details_data, colWidths=[1.5*inch, 5*inch])
    details_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (-1, -1), colors.lightgrey),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(details_table)
    story.append(Spacer(1, 0.2*inch))

    # Analysis Section
    analysis_data = [
        [Paragraph('Tumor Size:', label_style), Paragraph(f"{data['tumor_size']} mm", value_style)],
        [Paragraph('Risk Level:', label_style), Paragraph(data['risk'], value_style)],
    ]
    analysis_table = Table(analysis_data, colWidths=[1.5*inch, 5*inch])
    analysis_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (-1, -1), colors.whitesmoke),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(Paragraph('Analysis', styles['Heading2']))
    story.append(analysis_table)
    story.append(Spacer(1, 0.2*inch))

    # MRI Image (if provided)
    if 'image_path' in data and data['image_path']:
        try:
            img = Image(data['image_path'], width=4*inch, height=3*inch)
            story.append(Paragraph('MRI Scan', styles['Heading2']))
            story.append(img)
        except Exception as e:
            story.append(Paragraph(f"Could not load image: {str(e)}", styles['Normal']))

    doc.build(story)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_pdf.py <output_path> <json_file_path>")
        sys.exit(1)
    
    output_path = sys.argv[1]
    json_file_path = sys.argv[2]
    
    try:
        with open(json_file_path, 'r') as f:
            json_data = json.load(f)
        generate_pdf(output_path, json_data)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)