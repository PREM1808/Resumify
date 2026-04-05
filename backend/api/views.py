import os
import pdfplumber
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from google import genai 

# Import your new utility and model
from .models import ResumeAnalysis
from .utils import verify_firebase_token

class AnalyzeResumeView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        # 1. Authentication Check using utils.py
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'No authentication token provided'}, status=401)

        id_token = auth_header.split('Bearer ')[1]
        
        # Call the helper function from utils.py
        decoded_token = verify_firebase_token(id_token)
        
        if not decoded_token:
            return Response({'error': 'Invalid or expired token'}, status=401)

        email = decoded_token.get('email')
        
        # 2. File Handling
        resume_file = request.FILES.get('resume')
        if not resume_file:
            return Response({'error': 'No resume file uploaded'}, status=400)

        # 3. Extract Text
        try:
            with pdfplumber.open(resume_file) as pdf:
                full_text = " ".join([page.extract_text() for page in pdf.pages if page.extract_text()])

            if not full_text.strip():
                return Response({'error': 'PDF text extraction failed.'}, status=400)
        except Exception as e:
            return Response({'error': f'Failed to process PDF: {str(e)}'}, status=400)

        # 4. AI Analysis Configuration
        api_key = os.getenv('GEMINI_API_KEY')
        client = genai.Client(
            api_key=api_key,
            vertexai=False,
            http_options={'api_version': 'v1beta'}
        )

        prompt = f"""
        You are an expert career consultant. Analyze the following resume:

        {full_text}

        Please provide the response in the following format:
        # ATS Score: [Score]/100
        ## 🎯 Executive Summary
        [Brief overview]
        ## ✅ Strengths
        * Item 1
        ## 🛠️ Areas for Improvement
        * Item 1
        ## 🔑 Recommended Keywords
        `Keyword 1`, `Keyword 2`
        """

        try:
            # Generate content using Gemini
            response = client.models.generate_content(
                model="gemini-flash-latest", 
                contents=prompt
            )
            analysis_text = response.text
            print(f"✅ AI Analysis successful for {email}")

            # 5. Save to Database
            try:
                ResumeAnalysis.objects.create(
                    user_email=email,
                    resume_text=full_text,
                    analysis_content=analysis_text
                )
                print(f"💾 Record saved to MySQL for {email}")
            except Exception as db_err:
                # Log but don't fail the request
                print(f"⚠️ Database save failed: {str(db_err)}")

            return Response({
                "status": "success",
                "analysis": analysis_text,
                "preview": full_text[:100] + "..."
            })

        except Exception as e:
            print(f"❌ Gemini AI Error: {str(e)}")
            return Response({'error': 'AI Analysis service unavailable'}, status=503)