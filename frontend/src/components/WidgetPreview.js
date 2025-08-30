import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WidgetPreview = ({ widgetData }) => {
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleInputChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = () => {
    // Process form data based on widget logic
    setResults(formData);
  };

  const renderElement = (element) => {
    const elementType = element.type;
    const elementId = element.id;
    const label = element.label;
    const placeholder = element.placeholder;
    const style = element.style || {};
    const options = element.options || [];

    switch (elementType) {
      case 'text':
        return (
          <div
            key={elementId}
            style={{
              fontSize: style.fontSize || '16px',
              fontWeight: style.fontWeight || 'normal',
              color: style.color || '#333',
              marginBottom: '10px',
              textAlign: style.textAlign || 'left'
            }}
          >
            {label}
          </div>
        );

      case 'input':
        return (
          <div key={elementId} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              {label}
            </label>
            <input
              type="text"
              placeholder={placeholder}
              value={formData[elementId] || ''}
              onChange={(e) => handleInputChange(elementId, e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: style.backgroundColor || 'white',
                color: style.color || '#333',
                ...style
              }}
            />
          </div>
        );

      case 'button':
        return (
          <button
            key={elementId}
            onClick={handleSubmit}
            style={{
              backgroundColor: style.backgroundColor || '#3b82f6',
              color: style.color || 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              ...style
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {label}
          </button>
        );

      case 'question':
        return (
          <div key={elementId} style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>
              {label}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {options.map((option, index) => (
                <label
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: formData[elementId] === option ? '#f3f4f6' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = formData[elementId] === option ? '#f3f4f6' : 'white';
                  }}
                >
                  <input
                    type="radio"
                    name={elementId}
                    value={option}
                    checked={formData[elementId] === option}
                    onChange={(e) => handleInputChange(elementId, e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div key={elementId} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              {label}
            </label>
            <textarea
              placeholder={placeholder}
              value={formData[elementId] || ''}
              onChange={(e) => handleInputChange(elementId, e.target.value)}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit',
                ...style
              }}
            />
          </div>
        );

      case 'select':
        return (
          <div key={elementId} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              {label}
            </label>
            <select
              value={formData[elementId] || ''}
              onChange={(e) => handleInputChange(elementId, e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: 'white',
                ...style
              }}
            >
              <option value="">{placeholder || 'Select an option'}</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return (
          <div key={elementId} style={{ marginBottom: '10px', color: '#666' }}>
            Unknown element type: {elementType}
          </div>
        );
    }
  };

  const containerStyle = {
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: widgetData.styling?.primaryColor || '#ffffff',
    fontFamily: widgetData.styling?.fontFamily || 'Inter, system-ui, sans-serif',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <div style={containerStyle}>
        {/* Widget Title */}
        <h2 style={{ 
          marginBottom: '20px', 
          color: '#333', 
          fontSize: '24px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {widgetData.title}
        </h2>

        {/* Widget Description */}
        {widgetData.description && (
          <p style={{ 
            marginBottom: '20px', 
            color: '#666', 
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {widgetData.description}
          </p>
        )}

        {/* Widget Elements */}
        <div>
          {widgetData.elements?.map(renderElement)}
        </div>

        {/* Results Display */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}
          >
            <h3 style={{ marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Results:
            </h3>
            <pre style={{ 
              fontSize: '12px', 
              color: '#666',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {JSON.stringify(results, null, 2)}
            </pre>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WidgetPreview;
