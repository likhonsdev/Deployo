import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MagicComponentBuilderProps {
  // Add any props your component needs
}

const MagicComponentBuilder: React.FC<MagicComponentBuilderProps> = () => {
  const [componentCode, setComponentCode] = useState<string>('');
  const [componentName, setComponentName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // This is a placeholder function that would be replaced with actual implementation
  // that communicates with the @21st-dev/magic MCP server
  const generateComponent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This is where you would call your actual API or service
      // For now, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sampleCode = `
// This is a sample generated component
import React from 'react';

interface ${componentName}Props {
  title: string;
  description: string;
  onClick?: () => void;
}

const ${componentName}: React.FC<${componentName}Props> = ({ 
  title, 
  description, 
  onClick 
}) => {
  return (
    <div className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
      {onClick && (
        <button
          onClick={onClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Learn More
        </button>
      )}
    </div>
  );
};

export default ${componentName};
      `;
      
      setComponentCode(sampleCode);
      setResult('Component generated successfully!');
    } catch (err) {
      setError('Failed to generate component. Please try again.');
      console.error('Error generating component:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">21st Magic Component Builder</h2>
        <p className="text-muted-foreground">
          Generate React components with the 21st Magic Component Builder.
          This tool uses AI to create high-quality, customized components based on your specifications.
        </p>
      </div>

      <div className="space-y-4 p-4 border rounded-md bg-background">
        <div>
          <label htmlFor="componentName" className="block text-sm font-medium mb-1">
            Component Name
          </label>
          <input
            id="componentName"
            type="text"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            placeholder="MyAwesomeComponent"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <button
            onClick={generateComponent}
            disabled={!componentName || isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              !componentName || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isLoading ? 'Generating...' : 'Generate Component'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="p-4 border border-green-300 bg-green-50 text-green-800 rounded-md">
          {result}
        </div>
      )}

      {componentCode && (
        <div className="space-y-2">
          <h3 className="font-medium">Generated Component</h3>
          <pre className="p-4 bg-gray-800 text-gray-100 rounded-md overflow-x-auto text-sm">
            {componentCode}
          </pre>
          <div className="flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(componentCode);
                alert('Code copied to clipboard!');
              }}
              className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MagicComponentBuilder;
