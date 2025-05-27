import React, { useState } from 'react';
import LLMAgentFrameworkExample from './llm-agent-framework-example';
import MagicComponentBuilder from './21st-magic-component-builder';
import { motion } from 'framer-motion';
import * as allExamples from '../../examples';
import { CodeExecutionMessage } from '../chat/CodeExecutionMessage';

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

interface CategoryGroup {
  [key: string]: Example[];
}

interface ExamplesLibraryProps {
  onSelectExample?: (example: Example) => void;
}

interface ExampleCategory {
  id: string;
  title: string;
  component: React.ReactNode;
  description: string;
}

const ExamplesLibrary: React.FC<ExamplesLibraryProps> = ({ onSelectExample }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('llmAgentFramework');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  
  // Define example categories including the new LLM agent framework category
  const examples = {
    llmAgentFramework: [
      {
        title: 'LLM Agent Framework Visualization',
        description: 'Interactive visualization of the LLM agent framework architecture showing the core components and their relationships',
        category: 'llm/agent',
        difficulty: 'beginner',
        prompt: 'Visualize the LLM agent framework architecture',
        expectedOutput: '',
        tags: ['LLM', 'agent', 'framework', 'architecture'],
        component: <LLMAgentFrameworkExample />
      }
    ],
    magicComponentBuilder: [
      {
        title: '21st Magic Component Builder',
        description: 'Generate React components using the 21st Magic Component Builder tool',
        category: 'tools/component-builder',
        difficulty: 'intermediate',
        prompt: 'Create a React component using the Magic Component Builder',
        expectedOutput: '',
        tags: ['React', 'components', 'code-generation', 'magic'],
        component: <MagicComponentBuilder />
      }
    ],
    promptTechniques: [
      ...(allExamples.promptTechniques?.techniqueCategories?.basic || []),
      ...(allExamples.promptTechniques?.techniqueCategories?.reasoning || []),
    ],
    codeGeneration: [
      ...(allExamples.codeGeneration?.codeGenerationCategories?.database || []),
      ...(allExamples.codeGeneration?.codeGenerationCategories?.programming || []),
    ],
    rag: [
      ...(allExamples.rag?.ragCategories?.basics || []),
    ],
    pythonExamples: [
      ...Object.values(allExamples.pythonExamples || {}).flatMap(category => 
        Array.isArray(category) ? category.map(item => ({
          ...item,
          title: item.name,
          description: `Python ${item.name} Example`,
          category: 'python/example',
          difficulty: 'beginner',
          prompt: item.code,
          expectedOutput: '',
          tags: ['python']
        })) : []
      )
    ]
  };

  // Filter examples based on search term
  const filteredExamples = examples[selectedCategory as keyof typeof examples]?.filter(example =>
    example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    example.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleExampleSelect = (example: Example) => {
    setSelectedExample(example);
    if (onSelectExample) {
      onSelectExample(example);
    }
  };

  const handleTryExample = () => {
    // This would integrate with the chat interface
    if (selectedExample && onSelectExample) {
      onSelectExample(selectedExample);
    }
  };

  // Category labels for display
  const categoryLabels = {
    llmAgentFramework: 'LLM Agent Framework',
    magicComponentBuilder: '21st Magic Component Builder',
    promptTechniques: 'Prompt Techniques',
    codeGeneration: 'Code Generation',
    rag: 'Retrieval-Augmented Generation',
    pythonExamples: 'Python Examples'
  };

  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-lg border border-border/30">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold mb-2">Prompt Engineering Examples</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search examples..."
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Select category"
              >
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Examples List */}
        <div className="md:col-span-1 border-r border-border">
          <div className="h-[calc(100vh-15rem)] overflow-y-auto p-4">
            <h3 className="font-medium text-muted-foreground mb-2">
              {categoryLabels[selectedCategory as keyof typeof categoryLabels]}
              {filteredExamples.length > 0 && ` (${filteredExamples.length})`}
            </h3>
            
            <div className="space-y-2">
              {filteredExamples.map((example, index) => (
                <motion.div
                  key={`${example.title}-${index}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedExample === example
                      ? 'bg-primary/10 border-l-2 border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleExampleSelect(example)}
                >
                  <div className="font-medium">{example.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{example.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {example.difficulty}
                    </span>
                    {example.tags.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                    {example.tags.length > 2 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        +{example.tags.length - 2}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {filteredExamples.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">
                  <div className="text-3xl mb-2">🔍</div>
                  <p>No examples found. Try a different search term or category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Example Details */}
        <div className="md:col-span-2">
          <div className="h-[calc(100vh-15rem)] overflow-y-auto p-4">
            {selectedExample ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{selectedExample.title}</h2>
                  <button
                    className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                    onClick={handleTryExample}
                  >
                    Try in Chat
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-muted-foreground">{selectedExample.description}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Prompt</h3>
                    <pre className="p-4 rounded-md bg-muted overflow-x-auto text-sm">
                      {selectedExample.prompt}
                    </pre>
                  </div>
                  
                  {selectedExample.expectedOutput && (
                    <div>
                      <h3 className="font-medium mb-2">Expected Output</h3>
                      <pre className="p-4 rounded-md bg-muted overflow-x-auto text-sm">
                        {selectedExample.expectedOutput}
                      </pre>
                    </div>
                  )}
                  
                  {selectedExample.apiExample && (
                    <div>
                      <h3 className="font-medium mb-2">API Example</h3>
                      <pre className="p-4 rounded-md bg-muted overflow-x-auto text-sm">
                        {selectedExample.apiExample}
                      </pre>
                    </div>
                  )}
                  
                  {selectedExample.papers && selectedExample.papers.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Research</h3>
                      <ul className="space-y-2">
                        {selectedExample.papers.map((paper, index) => (
                          <li key={index}>
                            <a
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {paper.title}
                            </a>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({paper.year})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedExample.tags && selectedExample.tags.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedExample.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center p-6">
                <div>
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="text-lg font-medium mb-2">Select an example</h3>
                  <p className="max-w-md">
                    Browse the examples from the left panel to view prompt techniques, code generation patterns, and more.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesLibrary;
