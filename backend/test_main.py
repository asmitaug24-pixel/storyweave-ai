import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "StoryWeave AI API", "version": "1.0.0"}

def test_examples():
    """Test the examples endpoint"""
    response = client.get("/api/examples")
    assert response.status_code == 200
    assert "examples" in response.json()
    assert len(response.json()["examples"]) > 0

def test_generate_widget():
    """Test widget generation"""
    response = client.post("/api/generate-widget", json={
        "prompt": "Make me a simple quiz"
    })
    assert response.status_code == 200
    data = response.json()
    assert "widget_id" in data
    assert "widget_data" in data
    assert "react_code" in data
    assert "embed_code" in data

def test_generate_widget_empty_prompt():
    """Test widget generation with empty prompt"""
    response = client.post("/api/generate-widget", json={
        "prompt": ""
    })
    # Should still work with fallback widget
    assert response.status_code == 200

if __name__ == "__main__":
    pytest.main([__file__])
