from io import BytesIO
import PyPDF2
from fastapi import HTTPException

class PDFParser:
    @staticmethod
    async def extract_text_from_pdf(pdf_file) -> str:
        """Extract text content from PDF file."""
        try:
            pdf_content = await pdf_file.read()
            pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() or ""
            await pdf_file.seek(0)  # Reset file pointer
            return text
        except Exception as e:
            raise HTTPException(
                status_code=422,
                detail=f"PDF parsing failed: {str(e)}"
            )

    @staticmethod
    def validate_pdf_file(pdf_file) -> None:
        """Validate PDF file type and size."""
        if not pdf_file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )
        
        # Note: File size validation might be better handled at the endpoint level
        # since it requires reading the file content