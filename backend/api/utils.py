import os
import firebase_admin
from firebase_admin import auth, credentials

# 1. Setup the credentials using the path from .env
service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')

# 2. Initialize the app ONLY if it hasn't been initialized yet
if service_account_path and not firebase_admin._apps:
    try:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized in utils.py")
    except Exception as e:
        print(f"❌ Firebase initialization failed: {e}")

def verify_firebase_token(token):
    """
    Decodes the token and checks if it's expired or fake.
    Returns the decoded token dictionary or None if invalid.
    """
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Token verification error: {e}")
        return None