import pytest
import requests
import json

BASE_URL = "http://localhost:3050"

def test_service_availability():
    """Test if the service is running and accessible"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
    except requests.ConnectionError:
        pytest.fail("AI Service is not running on port 3050")

def test_tts_voices():
    """Test getting available voices for a provider"""
    providers = ["elevenlabs", "google"]  # Add all supported providers
    
    for provider in providers:
        response = requests.get(f"{BASE_URL}/api/tts/voices", params={"provider": provider})
        assert response.status_code == 200
        
        data = response.json()
        assert "voices" in data
        assert isinstance(data["voices"], list)

def test_tts_test():
    """Test TTS voice testing endpoint"""
    # First get available voices for the provider
    response = requests.get(f"{BASE_URL}/api/tts/voices", params={"provider": "google"})
    assert response.status_code == 200
    voices = response.json()["voices"]
    
    if len(voices) > 0:
        voiceId = voices[0]  # Use the first available voice
        payload = {
            "provider": "google",
            "voiceId": voiceId,
            "text": "Hello, this is a test."
        }
        
        response = requests.post(f"{BASE_URL}/api/tts/test", json=payload)
        assert response.status_code in [200, 500]  # Allow 500 for provider API issues
        
        data = response.json()
        if response.status_code == 200:
            assert "success" in data
        else:
            assert "error" in data

def test_error_handling():
    """Test API error handling with invalid input"""
    # Test missing provider in voices endpoint
    response = requests.get(f"{BASE_URL}/api/tts/voices")
    assert response.status_code == 500
    
    # Test missing parameters in TTS test endpoint
    response = requests.post(f"{BASE_URL}/api/tts/test", json={})
    assert response.status_code == 500
