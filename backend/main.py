from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
from dotenv import load_dotenv
import redis
import openai
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize Redis (fallback to in-memory if not available)
try:
    redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
    redis_client.ping()
except:
    redis_client = None
    print("Redis not available, using in-memory cache")

app = FastAPI(title="StoryWeave AI", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://storyweave-ai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class WidgetRequest(BaseModel):
    prompt: str
    user_id: Optional[str] = None

class EditRequest(BaseModel):
    widget_id: str
    edit_prompt: str
    current_widget: Dict[str, Any]

class WidgetResponse(BaseModel):
    widget_id: str
    widget_data: Dict[str, Any]
    react_code: str
    embed_code: str
    timestamp: str

# AI Meta-prompt for widget generation
WIDGET_GENERATION_PROMPT = """
You are an expert web developer and UI designer. Your task is to convert plain-English descriptions into fully functional web widgets.

IMPORTANT: You must respond with ONLY valid JSON that follows this exact schema:

{
  "widgetType": "quiz|calculator|form|timer|todo|custom",
  "title": "Widget Title",
  "description": "Brief description",
  "elements": [
    {
      "type": "text|input|button|question|timer|todo_item|calculation",
      "id": "unique_id",
      "label": "Display text",
      "placeholder": "Placeholder text (if applicable)",
      "options": ["option1", "option2"] (for questions),
      "validation": "required|email|number|optional",
      "defaultValue": "default value",
      "style": {
        "backgroundColor": "color",
        "color": "text color",
        "fontSize": "size",
        "borderRadius": "radius"
      }
    }
  ],
  "logic": {
    "onSubmit": "action description",
    "onChange": "action description",
    "calculations": ["formula1", "formula2"],
    "conditions": [
      {
        "if": "condition",
        "then": "action"
      }
    ]
  },
  "styling": {
    "theme": "light|dark|colorful",
    "primaryColor": "#color",
    "secondaryColor": "#color",
    "fontFamily": "font name"
  }
}

User request: {prompt}

Generate a widget that matches this description. Make it functional, beautiful, and user-friendly.
"""

# AI Meta-prompt for conversational editing
EDIT_PROMPT = """
You are an expert web developer. The user wants to edit an existing widget using natural language.

Current widget JSON:
{current_widget}

User's edit request: {edit_prompt}

Return ONLY the updated JSON with the requested changes applied. Maintain the same structure but update the relevant parts.
"""

def generate_widget_with_ai(prompt: str) -> Dict[str, Any]:
    """Generate widget using OpenAI API"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert web developer and UI designer."},
                {"role": "user", "content": WIDGET_GENERATION_PROMPT.format(prompt=prompt)}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        # Extract JSON from response
        content = response.choices[0].message.content.strip()
        
        # Try to parse JSON
        try:
            widget_data = json.loads(content)
            return widget_data
        except json.JSONDecodeError:
            # If JSON parsing fails, try to extract JSON from the response
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                raise Exception("Failed to generate valid JSON")
                
    except Exception as e:
        print(f"AI generation error: {e}")
        # Fallback to a simple widget
        return {
            "widgetType": "custom",
            "title": "Generated Widget",
            "description": "A widget based on your request",
            "elements": [
                {
                    "type": "text",
                    "id": "title",
                    "label": "Your Widget",
                    "style": {"fontSize": "24px", "fontWeight": "bold"}
                },
                {
                    "type": "input",
                    "id": "input1",
                    "label": "Input Field",
                    "placeholder": "Enter something...",
                    "validation": "optional"
                },
                {
                    "type": "button",
                    "id": "submit",
                    "label": "Submit",
                    "style": {"backgroundColor": "#3b82f6", "color": "white"}
                }
            ],
            "logic": {"onSubmit": "Process the input"},
            "styling": {"theme": "light", "primaryColor": "#3b82f6"}
        }

def edit_widget_with_ai(current_widget: Dict[str, Any], edit_prompt: str) -> Dict[str, Any]:
    """Edit widget using conversational AI"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert web developer."},
                {"role": "user", "content": EDIT_PROMPT.format(
                    current_widget=json.dumps(current_widget, indent=2),
                    edit_prompt=edit_prompt
                )}
            ],
            temperature=0.5,
            max_tokens=2000
        )
        
        content = response.choices[0].message.content.strip()
        
        try:
            updated_widget = json.loads(content)
            return updated_widget
        except json.JSONDecodeError:
            # If parsing fails, return original widget
            return current_widget
            
    except Exception as e:
        print(f"AI editing error: {e}")
        return current_widget

def generate_react_code(widget_data: Dict[str, Any]) -> str:
    """Generate React component code from widget data"""
    widget_type = widget_data.get("widgetType", "custom")
    title = widget_data.get("title", "Widget")
    elements = widget_data.get("elements", [])
    styling = widget_data.get("styling", {})
    
    react_code = f"""import React, {{ useState }} from 'react';

const {title.replace(" ", "")}Widget = () => {{
  const [formData, setFormData] = useState({{}});
  const [results, setResults] = useState(null);

  const handleInputChange = (id, value) => {{
    setFormData(prev => ({{
      ...prev,
      [id]: value
    }}));
  }};

  const handleSubmit = () => {{
    // Process form data based on widget logic
    setResults(formData);
  }};

  return (
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '{styling.get("primaryColor", "#ffffff")}',
      fontFamily: '{styling.get("fontFamily", "Arial, sans-serif")}',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>{title}</h2>
"""
    
    for element in elements:
        element_type = element.get("type", "text")
        element_id = element.get("id", "element")
        label = element.get("label", "")
        placeholder = element.get("placeholder", "")
        style = element.get("style", {})
        
        if element_type == "text":
            react_code += f"""
      <div style={{
        fontSize: '{style.get("fontSize", "16px")}',
        fontWeight: '{style.get("fontWeight", "normal")}',
        marginBottom: '10px'
      }}>
        {label}
      </div>"""
        
        elif element_type == "input":
            react_code += f"""
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>
        <input
          type="text"
          placeholder="{placeholder}"
          value={{formData.{element_id} || ''}}
          onChange={{e => handleInputChange('{element_id}', e.target.value)}}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>"""
        
        elif element_type == "button":
            react_code += f"""
      <button
        onClick={{handleSubmit}}
        style={{
          backgroundColor: '{style.get("backgroundColor", "#3b82f6")}',
          color: '{style.get("color", "white")}',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {label}
      </button>"""
        
        elif element_type == "question":
            options = element.get("options", [])
            react_code += f"""
      <div style={{ marginBottom: '15px' }}>
        <p style={{ marginBottom: '10px' }}>{label}</p>
        {options.map((option, index) => f"""
        <label key={index} style={{ display: 'block', marginBottom: '5px' }}>
          <input
            type="radio"
            name="{element_id}"
            value="{option}"
            onChange={{e => handleInputChange('{element_id}', e.target.value)}}
            style={{ marginRight: '8px' }}
          />
          {option}
        </label>""").join('')}
      </div>"""
    
    react_code += """
      {results && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h3>Results:</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default """ + title.replace(" ", "") + """Widget;
"""
    
    return react_code

def generate_embed_code(widget_data: Dict[str, Any], widget_id: str) -> str:
    """Generate embed code for the widget"""
    return f"""
<div id="storyweave-widget-{widget_id}"></div>
<script>
  // Widget embed code for {widget_data.get("title", "Widget")}
  // This would load the widget from your CDN
  (function() {{
    const script = document.createElement('script');
    script.src = 'https://cdn.storyweave.ai/widgets/{widget_id}.js';
    document.head.appendChild(script);
  }})();
</script>
"""

@app.get("/")
async def root():
    return {"message": "StoryWeave AI API", "version": "1.0.0"}

@app.get("/api/examples")
async def get_examples():
    """Get example prompts for users"""
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
    return {"examples": examples}

@app.post("/api/generate-widget", response_model=WidgetResponse)
async def generate_widget(request: WidgetRequest):
    """Generate a widget from plain-English description"""
    try:
        # Check cache first
        cache_key = f"widget:{hash(request.prompt)}"
        if redis_client:
            cached = redis_client.get(cache_key)
            if cached:
                cached_data = json.loads(cached)
                return WidgetResponse(**cached_data)
        
        # Generate widget with AI
        widget_data = generate_widget_with_ai(request.prompt)
        
        # Generate widget ID
        widget_id = str(uuid.uuid4())
        
        # Generate code
        react_code = generate_react_code(widget_data)
        embed_code = generate_embed_code(widget_data, widget_id)
        
        # Create response
        response = WidgetResponse(
            widget_id=widget_id,
            widget_data=widget_data,
            react_code=react_code,
            embed_code=embed_code,
            timestamp=datetime.now().isoformat()
        )
        
        # Cache the result
        if redis_client:
            redis_client.setex(cache_key, 3600, json.dumps(response.dict()))
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate widget: {str(e)}")

@app.post("/api/edit-widget", response_model=WidgetResponse)
async def edit_widget(request: EditRequest):
    """Edit widget using conversational language"""
    try:
        # Edit widget with AI
        updated_widget_data = edit_widget_with_ai(request.current_widget, request.edit_prompt)
        
        # Generate updated code
        react_code = generate_react_code(updated_widget_data)
        embed_code = generate_embed_code(updated_widget_data, request.widget_id)
        
        return WidgetResponse(
            widget_id=request.widget_id,
            widget_data=updated_widget_data,
            react_code=react_code,
            embed_code=embed_code,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to edit widget: {str(e)}")

@app.post("/api/export-widget")
async def export_widget(widget_response: WidgetResponse):
    """Export widget in various formats"""
    try:
        return {
            "react_code": widget_response.react_code,
            "embed_code": widget_response.embed_code,
            "widget_data": widget_response.widget_data,
            "download_url": f"/api/download/{widget_response.widget_id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export widget: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
