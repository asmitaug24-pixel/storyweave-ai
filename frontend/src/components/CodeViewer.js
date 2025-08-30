import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeViewer = ({ reactCode, embedCode }) => {
  const [activeTab, setActiveTab] = useState('react');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'react', label: 'React Component', icon: Code },
    { id: 'embed', label: 'Embed Code', icon: ExternalLink }
  ];

  const getCode = () => {
    return activeTab === 'react' ? reactCode : embedCode;
  };

  const getLanguage = () => {
    return activeTab === 'react' ? 'jsx' : 'html';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Display */}
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => copyToClipboard(getCode())}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md hover:bg-gray-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language={getLanguage()}
            style={tomorrow}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '13px',
              lineHeight: '1.5',
              maxHeight: '400px',
              overflow: 'auto'
            }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {getCode()}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">
          How to use this code:
        </h4>
        {activeTab === 'react' ? (
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Create a new file with a <code>.jsx</code> extension</li>
            <li>Copy and paste the React component code</li>
            <li>Import and use it in your React application</li>
            <li>Customize the styling and functionality as needed</li>
          </ol>
        ) : (
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Copy the embed code</li>
            <li>Paste it into your HTML page where you want the widget</li>
            <li>The widget will automatically load and display</li>
            <li>No additional setup required</li>
          </ol>
        )}
      </div>
    </motion.div>
  );
};

export default CodeViewer;
