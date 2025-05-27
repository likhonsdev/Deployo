// Export all code generation examples
import { sqlGeneration } from './sql-generation';
import { codeSnippetGeneration } from './code-snippet';

export {
  sqlGeneration,
  codeSnippetGeneration
};

// Group examples by category for UI navigation
export const codeGenerationCategories = {
  database: [
    sqlGeneration,
  ],
  programming: [
    codeSnippetGeneration,
  ]
};
