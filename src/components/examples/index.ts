// Export all example-related components
export { default as ExamplesLibrary } from './ExamplesLibrary';
export { default as ExamplesPage } from './ExamplesPage';
export { default as MagicComponentBuilder } from './21st-magic-component-builder';

// Export the Example interface for type sharing
export interface Example {
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
