from django.db import models

class ResumeAnalysis(models.Model):
    user_email = models.EmailField()
    resume_text = models.TextField()
    analysis_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis for {self.user_email} on {self.created_at.date()}"