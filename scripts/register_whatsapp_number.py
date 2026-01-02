#!/usr/bin/env python3
"""
WhatsApp Cloud API Phone Number Registration Script

One-time script to register a WhatsApp Business phone number with Meta's Cloud API.
This script reads credentials from environment variables only - never hardcodes secrets.

Usage:
    export WHATSAPP_ACCESS_TOKEN="your_token"
    export WHATSAPP_PHONE_NUMBER_ID="958423034009998"
    export WHATSAPP_PIN="123456"
    export WHATSAPP_CERTIFICATE="your_certificate_string"
    python scripts/register_whatsapp_number.py

Security:
    - Never commits secrets to git
    - Never logs full tokens/certificates
    - Masks sensitive values in output
"""

import os
import sys
import httpx
import json
from typing import Optional


def mask_secret(value: str, show_chars: int = 6) -> str:
    """Mask a secret value, showing only first N characters"""
    if not value or len(value) <= show_chars:
        return "***"
    return f"{value[:show_chars]}..."


def get_env_var(name: str, default: Optional[str] = None, required: bool = True) -> str:
    """Get environment variable with validation"""
    value = os.environ.get(name, default or "")
    value = value.strip()
    
    if required and not value:
        print(f"❌ Error: {name} environment variable is required but not set")
        print(f"   Set it with: export {name}=\"your_value\"")
        sys.exit(1)
    
    return value


def validate_pin(pin: str) -> bool:
    """Validate PIN is exactly 6 digits"""
    return pin.isdigit() and len(pin) == 6


def validate_certificate(cert: str) -> bool:
    """Validate certificate has minimum required length"""
    return len(cert) > 50


def register_whatsapp_number():
    """Register WhatsApp phone number with Meta Cloud API"""
    
    print("=" * 60)
    print("WhatsApp Cloud API Phone Registration")
    print("=" * 60)
    print()
    
    # Read environment variables
    access_token = get_env_var("WHATSAPP_ACCESS_TOKEN", required=True)
    phone_number_id = get_env_var("WHATSAPP_PHONE_NUMBER_ID", default="958423034009998", required=False)
    pin = get_env_var("WHATSAPP_PIN", required=True)
    certificate = get_env_var("WHATSAPP_CERTIFICATE", required=True)
    graph_version = get_env_var("WHATSAPP_GRAPH_VERSION", default="v21.0", required=False)
    
    # Validate inputs
    print("Validating inputs...")
    
    if not validate_pin(pin):
        print(f"❌ Error: WHATSAPP_PIN must be exactly 6 digits, got: {len(pin)} characters")
        print(f"   Received: {mask_secret(pin, 0)}")
        sys.exit(1)
    
    if not validate_certificate(certificate):
        print(f"❌ Error: WHATSAPP_CERTIFICATE appears too short (length: {len(certificate)})")
        print("   Certificate should be a long string from WhatsApp Manager")
        sys.exit(1)
    
    if not access_token:
        print("❌ Error: WHATSAPP_ACCESS_TOKEN is empty")
        sys.exit(1)
    
    print(f"✅ PIN: {mask_secret(pin, 0)} (6 digits)")
    print(f"✅ Certificate: {len(certificate)} characters")
    print(f"✅ Phone Number ID: {phone_number_id}")
    print(f"✅ Graph Version: {graph_version}")
    print(f"✅ Access Token: {mask_secret(access_token)}")
    print()
    
    # Prepare API request
    url = f"https://graph.facebook.com/{graph_version}/{phone_number_id}/register"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "pin": pin,
        "certificate": certificate
    }
    
    print(f"📤 Sending registration request to: {url}")
    print(f"   Phone Number ID: {phone_number_id}")
    print()
    
    # Send request
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            
            # Check for success
            if result.get("success") is True:
                print("=" * 60)
                print("✅ Registered successfully")
                print("=" * 60)
                print()
                print("Response keys:", list(result.keys()))
                print()
                print("Next steps:")
                print("1. Test by sending a WhatsApp message to your business number")
                print("2. Verify webhook receives the message at:")
                print("   https://byonco-fastapi-backend.onrender.com/api/whatsapp/webhook")
                print("3. Check that your backend responds with the appropriate message")
                return 0
            else:
                print("=" * 60)
                print("⚠️  Registration response received but success != true")
                print("=" * 60)
                print("Response:", json.dumps(result, indent=2))
                return 1
    
    except httpx.HTTPStatusError as e:
        print("=" * 60)
        print(f"❌ Registration failed: HTTP {e.response.status_code}")
        print("=" * 60)
        print()
        
        try:
            error_data = e.response.json()
            error_info = error_data.get("error", {})
            error_code = error_info.get("code")
            error_message = error_info.get("message", "Unknown error")
            error_type = error_info.get("type", "Unknown")
            
            print(f"Error Code: {error_code}")
            print(f"Error Type: {error_type}")
            print(f"Error Message: {error_message}")
            print()
            
            # Provide troubleshooting guidance
            if error_code == 133010:
                print("💡 Troubleshooting: Account not registered")
                print("   This usually means registration was not completed.")
                print("   - Verify you're using the correct Phone Number ID")
                print("   - Ensure the phone number is eligible for WhatsApp Business API")
                print("   - Check that you have admin access to the Meta Business account")
            elif "OAuth" in error_type or "token" in error_message.lower():
                print("💡 Troubleshooting: Token/authentication error")
                print("   - Your access token may be expired or invalid")
                print("   - Verify the token has required permissions (whatsapp_business_messaging)")
                print("   - Generate a new System User token if needed")
            elif "pin" in error_message.lower() or "incorrect" in error_message.lower():
                print("💡 Troubleshooting: PIN error")
                print("   - Verify the PIN is exactly 6 digits")
                print("   - The PIN is from your 2-step verification setup")
                print("   - If PIN is incorrect, reset 2-step verification and try again")
            elif "certificate" in error_message.lower():
                print("💡 Troubleshooting: Certificate error")
                print("   - Verify the certificate string is complete (no truncation)")
                print("   - Re-download the certificate from WhatsApp Manager")
                print("   - Ensure no extra whitespace or newlines in the certificate")
            else:
                print("💡 Check Meta's API documentation for error code:", error_code)
                print("   https://developers.facebook.com/docs/whatsapp/cloud-api/guides/register-phone-number")
        
        except:
            print("Raw response:", e.response.text[:500])
        
        return 1
    
    except httpx.RequestError as e:
        print("=" * 60)
        print("❌ Network error during registration")
        print("=" * 60)
        print(f"Error: {str(e)}")
        print()
        print("💡 Troubleshooting:")
        print("   - Check your internet connection")
        print("   - Verify the Graph API endpoint is accessible")
        print("   - Try again in a few moments")
        return 1
    
    except Exception as e:
        print("=" * 60)
        print("❌ Unexpected error")
        print("=" * 60)
        print(f"Error: {str(e)}")
        return 1


if __name__ == "__main__":
    exit_code = register_whatsapp_number()
    sys.exit(exit_code)

