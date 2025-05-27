// Export all RAG examples
import { ragFaithfulness } from './rag-faithfulness';

export {
  ragFaithfulness
};

// Group examples by category for UI navigation
export const ragCategories = {
  basics: [
    ragFaithfulness,
    // Future additions: reduceHallucination, inContextRecall, etc.
  ]
};
