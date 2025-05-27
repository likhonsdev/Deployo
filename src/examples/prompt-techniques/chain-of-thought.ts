/**
 * Chain-of-Thought Prompting Example
 * 
 * Chain-of-Thought (CoT) prompting encourages LLMs to break down complex problems
 * into intermediate steps before arriving at a solution. By asking the model to
 * "think step by step," it can solve more complex reasoning problems
 * with higher accuracy.
 */
export const chainOfThought = {
  title: "Chain-of-Thought Prompting",
  description: "Encouraging step-by-step reasoning to solve complex problems",
  category: "prompting/reasoning",
  difficulty: "intermediate",
  prompt: `Let's solve this step-by-step:

Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": "Let's solve this step-by-step:\\n\\nRoger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?"
    }
  ],
  temperature=0,
  max_tokens=200
)`,
  expectedOutput: `To solve this problem, I'll break it down step by step:

1. Initially, Roger has 5 tennis balls.
2. He buys 2 cans of tennis balls.
3. Each can contains 3 tennis balls.
4. So the 2 cans contain 2 × 3 = a total of 6 tennis balls.
5. Now I need to add the initial number of balls to the new ones: 5 + 6 = 11.

Therefore, Roger has 11 tennis balls in total.`,
  papers: [
    {
      title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
      url: "https://arxiv.org/abs/2201.11903",
      year: "2022"
    }
  ],
  tags: ["reasoning", "mathematics", "problem-solving", "chain-of-thought"]
};

// Python-specific chain-of-thought example
export const pythonChainOfThoughtExample = {
  title: "Python Debugging (Chain-of-Thought)",
  description: "Using step-by-step reasoning to debug Python code",
  category: "prompting/python",
  difficulty: "intermediate",
  prompt: `Let's debug this Python code step by step:

def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)
    
# Example usage
result = calculate_average([10, 20, 30, 40])
print(f"The average is: {result}")

# This causes an error
result = calculate_average([])
print(f"The average is: {result}")

What's causing the error and how can we fix it?`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": """Let's debug this Python code step by step:

def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)
    
# Example usage
result = calculate_average([10, 20, 30, 40])
print(f"The average is: {result}")

# This causes an error
result = calculate_average([])
print(f"The average is: {result}")

What's causing the error and how can we fix it?"""
    }
  ],
  temperature=0,
  max_tokens=300
)`,
  expectedOutput: `Let me trace through this code step by step:

1. The function \`calculate_average\` takes a list of numbers as input.
2. It initializes a variable \`total\` to 0.
3. It loops through each number in the list and adds it to the total.
4. It then returns the total divided by the length of the list.

The first example works correctly:
- Input: [10, 20, 30, 40]
- Total: 10 + 20 + 30 + 40 = 100
- Length: 4
- Output: 100 / 4 = 25.0

The second example fails because:
- Input: []
- Total: 0 (no numbers to add)
- Length: 0
- Output: Attempts to calculate 0 / 0, which causes a ZeroDivisionError

The error is caused by trying to divide by zero when the input list is empty. To fix this, we should add a check for empty lists:

\`\`\`python
def calculate_average(numbers):
    if len(numbers) == 0:
        return 0  # or return None, or raise a custom exception
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)
\`\`\`

This prevents the division by zero by returning a default value when the list is empty.`,
  papers: [],
  tags: ["debugging", "python", "error-handling", "chain-of-thought"]
};
