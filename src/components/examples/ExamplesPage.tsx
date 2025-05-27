import React from 'react';
import { motion } from 'framer-motion';
import ExamplesLibrary from './ExamplesLibrary';

interface Example {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  prompt: string;
  apiExample?: string;
  expectedOutput: string;
  papers?: Array<{
    title: string;
    url: string;
    year: string;
  }>;
  tags: string[];
}

interface ExamplesPageProps {
  onSelectExampleForChat?: (example: Example) => void;
}

const ExamplesPage: React.FC<ExamplesPageProps> = ({ onSelectExampleForChat }) => {
  const handleExampleSelection = (example: Example) => {
    if (onSelectExampleForChat) {
      onSelectExampleForChat(example);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Prompt Engineering Techniques
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore different prompt techniques, code generation patterns, and LLM capabilities. 
          Browse examples, view implementation details, and try them in your chat interface.
        </p>
      </div>
      
      <ExamplesLibrary onSelectExample={handleExampleSelection} />
    </motion.div>
  );
};

export default ExamplesPage;
