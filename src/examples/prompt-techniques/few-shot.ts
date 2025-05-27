/**
 * Few-shot Prompting Example
 * 
 * Few-shot prompting involves providing the LLM with a small number of examples
 * demonstrating the desired task, followed by a new instance to be processed.
 * This helps the model understand the pattern and apply it to new cases.
 */
export const fewShot = {
  title: "Few-shot Prompting",
  description: "Providing examples to guide an LLM's responses",
  category: "prompting/basic",
  difficulty: "beginner",
  prompt: `Classify each text as expressing a positive, negative, or neutral sentiment.

Text: "I was really happy with the gift!"
Sentiment: Positive

Text: "I am unhappy because of the rain."
Sentiment: Negative

Text: "I am excited to eat ice cream on Sunday"
Sentiment: Positive

Text: "The movie was neither good nor bad."
Sentiment: Neutral

Text: "Watching TV makes me happy."
Sentiment:`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": """Classify each text as expressing a positive, negative, or neutral sentiment.

Text: "I was really happy with the gift!"
Sentiment: Positive

Text: "I am unhappy because of the rain."
Sentiment: Negative

Text: "I am excited to eat ice cream on Sunday"
Sentiment: Positive

Text: "The movie was neither good nor bad."
Sentiment: Neutral

Text: "Watching TV makes me happy."
Sentiment:"""
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
  tags: ["classification", "nlp", "sentiment-analysis", "few-shot"]
};

// Python-specific few-shot example
export const pythonFewShotExample = {
  title: "Python Code Generation (Few-shot)",
  description: "Generate Python code by providing examples of similar functions",
  category: "prompting/python",
  difficulty: "intermediate",
  prompt: `# Example 1: A function to find the sum of a list
def sum_list(numbers):
    """Calculate the sum of all numbers in the list."""
    total = 0
    for num in numbers:
        total += num
    return total

# Example 2: A function to find the product of a list
def product_list(numbers):
    """Calculate the product of all numbers in the list."""
    result = 1
    for num in numbers:
        result *= num
    return result

# Example 3: A function to find the average of a list
def average_list(numbers):
    """Calculate the average of all numbers in the list."""
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

# Now write a function to find the maximum value in a list without using built-in functions like max():`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": """# Example 1: A function to find the sum of a list
def sum_list(numbers):
    \"\"\"Calculate the sum of all numbers in the list.\"\"\"
    total = 0
    for num in numbers:
        total += num
    return total

# Example 2: A function to find the product of a list
def product_list(numbers):
    \"\"\"Calculate the product of all numbers in the list.\"\"\"
    result = 1
    for num in numbers:
        result *= num
    return result

# Example 3: A function to find the average of a list
def average_list(numbers):
    \"\"\"Calculate the average of all numbers in the list.\"\"\"
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

# Now write a function to find the maximum value in a list without using built-in functions like max():"""
    }
  ],
  temperature=0,
  max_tokens=200
)`,
  expectedOutput: `def max_list(numbers):
    """Find the maximum value in the list."""
    if not numbers:
        return None
    maximum = numbers[0]
    for num in numbers:
        if num > maximum:
            maximum = num
    return maximum`,
  papers: [],
  tags: ["code-generation", "python", "function", "few-shot"]
};
