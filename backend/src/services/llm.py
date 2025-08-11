from typing import Optional
import logging
import google.generativeai as genai
import os
from prompt import get_pdf_analysis_prompt, get_qa_prompt

class LLMSummarizer:
    # Class-level initialization with Gemini API key
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Get from environment variable
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    
    genai.configure(api_key=GEMINI_API_KEY)
    MODEL_NAME = "gemini-2.0-flash"  # Default model
    
    def __init__(self):
        self.llm = self._initialize_llm()
    
    def _initialize_llm(self):
        """Initialize Gemini LLM connection."""
        try:
            return genai.GenerativeModel(self.MODEL_NAME)
        except Exception as e:
            logging.error(f"Failed to initialize Gemini: {str(e)}")
            raise
    
    async def answer_with_context(self, query: str, context_docs: str) -> str:
        try:
            prompt = get_qa_prompt(context_docs,query)

            response = await self.llm.generate_content_async(prompt)
            return response.text.strip()
        except Exception as e:
            logging.error(f"LLM query failed: {str(e)}")
            raise

    async def summarize(self, text: str, max_length: Optional[int] = 500) -> str:
        """Generate summary of text using Gemini."""
        try:
            prompt =  get_pdf_analysis_prompt(text)
            
            response = await self.llm.generate_content_async(prompt)
            return response.text
        
    
        except Exception as e:
            logging.error(f"Summarization failed: {str(e)}")
            raise
    
    