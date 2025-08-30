#!/usr/bin/env python3
"""
StoryWeave AI Demo Script
This script demonstrates the core functionality of StoryWeave AI
"""

import requests
import json
import time

# Configuration
API_BASE_URL = "http://localhost:8000"

def test_widget_generation():
    """Test widget generation with various prompts"""
    print("🚀 StoryWeave AI Demo")
    print("=" * 50)
    
    test_prompts = [
        "Make me a quiz for my friends",
        "A BMI calculator",
        "A feedback form with branching logic",
        "A countdown timer"
    ]
    
    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n{i}. Testing: '{prompt}'")
        print("-" * 30)
        
        try:
            # Generate widget
            response = requests.post(f"{API_BASE_URL}/api/generate-widget", json={
                "prompt": prompt
            })
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Widget generated successfully!")
                print(f"   Title: {data['widget_data']['title']}")
                print(f"   Type: {data['widget_data']['widgetType']}")
                print(f"   Elements: {len(data['widget_data']['elements'])}")
                
                # Test conversational editing
                edit_prompt = "Make the button green"
                print(f"\n   Testing edit: '{edit_prompt}'")
                
                edit_response = requests.post(f"{API_BASE_URL}/api/edit-widget", json={
                    "widget_id": data['widget_id'],
                    "edit_prompt": edit_prompt,
                    "current_widget": data['widget_data']
                })
                
                if edit_response.status_code == 200:
                    print(f"   ✅ Edit applied successfully!")
                else:
                    print(f"   ❌ Edit failed: {edit_response.status_code}")
                    
            else:
                print(f"❌ Failed to generate widget: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Could not connect to the API. Make sure the backend is running.")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
        
        time.sleep(1)  # Small delay between requests

def test_api_endpoints():
    """Test all API endpoints"""
    print("\n🔧 Testing API Endpoints")
    print("=" * 30)
    
    endpoints = [
        ("GET", "/", "Root endpoint"),
        ("GET", "/api/examples", "Examples endpoint"),
    ]
    
    for method, endpoint, description in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{API_BASE_URL}{endpoint}")
            else:
                response = requests.post(f"{API_BASE_URL}{endpoint}")
                
            if response.status_code == 200:
                print(f"✅ {description}: OK")
            else:
                print(f"❌ {description}: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ {description}: Connection failed")
        except Exception as e:
            print(f"❌ {description}: Error - {e}")

def show_widget_examples():
    """Show example widget prompts"""
    print("\n📝 Example Widget Prompts")
    print("=" * 30)
    
    examples = [
        "Make me a quiz for my friends",
        "A BMI calculator", 
        "A feedback form with branching logic",
        "A countdown timer",
        "A todo list with categories",
        "A contact form",
        "A simple calculator",
        "A survey with multiple choice questions"
    ]
    
    for i, example in enumerate(examples, 1):
        print(f"{i:2d}. {example}")

def main():
    """Main demo function"""
    print("🎯 StoryWeave AI - From Idea to Widget in Seconds")
    print("=" * 60)
    
    # Show examples
    show_widget_examples()
    
    # Test API endpoints
    test_api_endpoints()
    
    # Test widget generation
    test_widget_generation()
    
    print("\n" + "=" * 60)
    print("🎉 Demo completed!")
    print("\nTo run the full application:")
    print("1. Start the backend: cd backend && python main.py")
    print("2. Start the frontend: cd frontend && npm start")
    print("3. Open http://localhost:3000 in your browser")
    print("\nOr use the startup scripts:")
    print("- Windows: start.bat")
    print("- macOS/Linux: pwsh start.ps1")

if __name__ == "__main__":
    main()
