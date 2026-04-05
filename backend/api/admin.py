from django.contrib import admin
from .models import ResumeAnalysis  # Changed from 'Analysis' to 'ResumeAnalysis'

@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'created_at')
    search_fields = ('user_email',)