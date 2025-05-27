// Export all prompt techniques
import { zeroShot } from './zero-shot';
import { fewShot } from './few-shot';
import { chainOfThought } from './chain-of-thought';

export {
  zeroShot,
  fewShot,
  chainOfThought
};

// Group techniques by category for UI navigation
export const techniqueCategories = {
  basic: [
    zeroShot,
    fewShot,
  ],
  reasoning: [
    chainOfThought,
    // Future: Add tree of thoughts, self-consistency, etc.
  ]
};
