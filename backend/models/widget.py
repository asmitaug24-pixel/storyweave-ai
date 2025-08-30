from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class WidgetElement(BaseModel):
    type: str
    id: str
    label: str
    placeholder: Optional[str] = None
    options: Optional[List[str]] = None
    validation: Optional[str] = "optional"
    defaultValue: Optional[str] = None
    style: Optional[Dict[str, str]] = None

class WidgetLogic(BaseModel):
    onSubmit: Optional[str] = None
    onChange: Optional[str] = None
    calculations: Optional[List[str]] = None
    conditions: Optional[List[Dict[str, str]]] = None

class WidgetStyling(BaseModel):
    theme: str = "light"
    primaryColor: str = "#3b82f6"
    secondaryColor: str = "#6b7280"
    fontFamily: str = "Arial, sans-serif"

class WidgetData(BaseModel):
    widgetType: str
    title: str
    description: Optional[str] = None
    elements: List[WidgetElement]
    logic: Optional[WidgetLogic] = None
    styling: Optional[WidgetStyling] = None

class WidgetCreate(BaseModel):
    prompt: str
    user_id: Optional[str] = None

class WidgetEdit(BaseModel):
    widget_id: str
    edit_prompt: str
    current_widget: Dict[str, Any]

class WidgetResponse(BaseModel):
    widget_id: str
    widget_data: Dict[str, Any]
    react_code: str
    embed_code: str
    timestamp: str

class WidgetExport(BaseModel):
    react_code: str
    embed_code: str
    widget_data: Dict[str, Any]
    download_url: str
