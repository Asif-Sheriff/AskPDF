# utils/pdf_processor.py
from PyPDF2 import PdfReader
from io import BytesIO

async def extract_text_from_pdf(file: bytes) -> str:
    try:
        pdf = PdfReader(BytesIO(file))
        text = "\n".join([page.extract_text() for page in pdf.pages])
        return text
    except Exception as e:
        raise ValueError(f"PDF processing failed: {str(e)}")