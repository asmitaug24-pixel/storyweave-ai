import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  MessageSquare, 
  Download, 
  Copy, 
  Check, 
  ArrowRight,
  Loader2,
  Code,
  Palette,
  Settings
} from 'lucide-react';
import axios from 'axios';
import WidgetPreview from './components/WidgetPreview';
import ChatEditor from './components/ChatEditor';
import CodeViewer from './components/CodeViewer';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [widgetData, setWidgetData] = useState(null);
  const [examples, setExamples] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    // Load example prompts
    loadExamples();
  }, []);

  const loadExamples = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/examples`);
      setExamples(response.data.examples);
    } catch (error) {
      console.error('Failed to load examples:', error);
      // Fallback examples
      setExamples([
        "Make me a quiz for my friends",
        "A BMI calculator",
        "A feedback form with branching logic",
        "A countdown timer",
        "A todo list with categories"
      ]);
    }
  };

  const generateWidget = async (inputPrompt) => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-widget`, {
        prompt: inputPrompt
      });
      
      setWidgetData(response.data);
      setCurrentView('widget');
      setChatHistory([{
        type: 'user',
        message: inputPrompt,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to generate widget:', error);
      alert('Failed to generate widget. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateWidget(prompt);
    }
  };

  const handleEdit = async (editPrompt) => {
    if (!widgetData) return;

    const newChatEntry = {
      type: 'user',
      message: editPrompt,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newChatEntry]);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/edit-widget`, {
        widget_id: widgetData.widget_id,
        edit_prompt: editPrompt,
        current_widget: widgetData.widget_data
      });

      setWidgetData(response.data);
      
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        message: `Updated the widget based on your request: "${editPrompt}"`,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to edit widget:', error);
      setChatHistory(prev => [...prev, {
        type: 'error',
        message: 'Failed to apply changes. Please try again.',
        timestamp: new Date()
      }]);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
    generateWidget(example);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadCode = () => {
    if (!widgetData) return;
    
    const blob = new Blob([widgetData.react_code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${widgetData.widget_data.title.replace(/\s+/g, '')}Widget.jsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold gradient-text">StoryWeave AI</h1>
            </div>
            
            {currentView !== 'landing' && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('landing')}
                  className="btn-secondary text-sm"
                >
                  New Widget
                </button>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="btn-secondary text-sm"
                >
                  {showCode ? <Palette className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                  {showCode ? 'Preview' : 'Code'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            {/* Hero Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <Sparkles className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              </motion.div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                From Idea to Widget in{' '}
                <span className="gradient-text">Seconds</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Turn any plain-English idea into a fully functional, interactive web widget instantly. 
                No coding, no drag-and-drop. Just describe what you want.
              </p>
            </div>

            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card max-w-2xl mx-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    What are we creating today?
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Make me a quiz for my friends' or 'A BMI calculator'"
                    className="input-field h-32 resize-none"
                    disabled={isGenerating}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating your widget...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5" />
                      <span>Create Widget</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Examples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                Try these examples
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {examples.map((example, index) => (
                  <motion.button
                    key={example}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    onClick={() => handleExampleClick(example)}
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
                        {example}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Generation</h3>
                <p className="text-gray-600">Get your widget in under 30 seconds</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversational Editing</h3>
                <p className="text-gray-600">Just ask for changes in plain English</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Use</h3>
                <p className="text-gray-600">Export React code or embed directly</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {currentView === 'widget' && widgetData && (
          <motion.div
            key="widget"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Widget Preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Widget Preview</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadCode}
                      className="btn-secondary text-sm flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(widgetData.embed_code)}
                      className="btn-secondary text-sm flex items-center space-x-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Embed</span>
                    </button>
                  </div>
                </div>
                
                {showCode ? (
                  <CodeViewer 
                    reactCode={widgetData.react_code}
                    embedCode={widgetData.embed_code}
                  />
                ) : (
                  <WidgetPreview widgetData={widgetData.widget_data} />
                )}
              </div>

              {/* Chat Editor */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Your Widget</h2>
                <ChatEditor
                  chatHistory={chatHistory}
                  onEdit={handleEdit}
                  widgetTitle={widgetData.widget_data.title}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
