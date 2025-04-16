import os
import random
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

output_dir = "admin_uploads"
os.makedirs(output_dir, exist_ok=True)

profile_types = ['Flat', 'I', 'T', 'Round']
alloys = ['6060', '6061', '6063']
treatments = ['Anodized', 'MillFinish']

def generate_mock_quote(index):
    profile = random.choice(profile_types)
    alloy = random.choice(alloys)
    weight = round(random.uniform(0.8, 2.5), 2)
    length = random.randint(100, 2000)
    treatment = random.choice(treatments)
    machining = random.randint(1, 5)
    final_price = random.randint(10000, 60000)

    content = f"""
    Quote #{index}

    ProfileType: {profile}
    Alloy: {alloy}
    Weight_per_meter: {weight} kg
    Total_length: {length} mm
    SurfaceTreatment: {treatment}
    MachiningComplexity: {machining}
    FinalPrice: {final_price} SEK
    """

    filename = os.path.join(output_dir, f"mock_quote_{index}.pdf")
    c = canvas.Canvas(filename, pagesize=A4)
    c.setFont("Helvetica", 12)
    for i, line in enumerate(content.strip().split('\n')):
        c.drawString(50, 800 - (i * 20), line.strip())
    c.save()

for i in range(1, 151):
    generate_mock_quote(i)

print(" Generated 150 mock quote PDFs in admin_uploads/")

