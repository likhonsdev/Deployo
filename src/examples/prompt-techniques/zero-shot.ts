/**
 * Zero-shot Prompting Example
 * 
 * Zero-shot prompting refers to the capability of LLMs to perform tasks without
 * specific examples or demonstrations. The model is simply given a task description
 * and expected to produce the correct output based on its pre-existing knowledge.
 */
export const zeroShot = {
  title: "Zero-shot Prompting",
  description: "Asking an LLM to perform a task without providing examples",
  category: "prompting/basic",
  difficulty: "beginner",
  prompt: `Classify the following text as expressing a positive, negative, or neutral sentiment:

"I had a wonderful time at the restaurant last night. The food was delicious and the service was excellent."`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": "Classify the following text as expressing a positive, negative, or neutral sentiment:\\n\\n\\"I had a wonderful time at the restaurant last night. The food was delicious and the service was excellent.\\""
    }
  ],
  temperature=0,
  max_tokens=50
)`,
  expectedOutput: `Positive`,
  papers: [
    {
      title: "Language Models are Few-Shot Learners",
      url: "https://arxiv.org/abs/2005.14165",
      year: "2020"
    }
  ],
  tags: ["classification", "nlp", "sentiment-analysis", "zero-shot"]
};

// Python-specific zero-shot example
export const pythonZeroShotExample = {
  title: "Python Code Generation (Zero-shot)",
  description: "Generate Python code without examples by describing the task",
  category: "prompting/python",
  difficulty: "beginner",
  prompt: `Write a Python function to calculate the factorial of a number using recursion.`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": "Write a Python function to calculate the factorial of a number using recursion."
    }
  ],
  temperature=0,
  max_tokens=200
)`,
  expectedOutput: `def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n-1)`,
  papers: [],
  tags: ["code-generation", "python", "recursion", "zero-shot"]
};
