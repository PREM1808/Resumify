from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
import pdfplumber
import io

class AnalyzeResumeView(APIView):
    # Parser tells Django to expect a File Upload
    parser_classes = [MultiPartParser]

    def post(self, request):
        try:
            # 1. Grab the file and the Job Description from the request
            resume_file = request.FILES.get('resume')
            jd_text = request.data.get('jd_text', 'No JD provided')

            # 2. Extract text from the PDF
            with pdfplumber.open(resume_file) as pdf:
                full_text = " ".join([page.extract_text() for page in pdf.pages])

            # 3. Humanized Response (For now, we just echo back)
            return Response({
                "status": "success",
                "message": "File received!",
                "resume_length": len(full_text),
                "preview": full_text[:100] + "..."
            })

        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)