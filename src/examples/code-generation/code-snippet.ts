/**
 * Code Snippet Generation Example
 * 
 * This example demonstrates how to prompt LLMs to generate code snippets
 * from natural language descriptions or comments.
 */
export const codeSnippetGeneration = {
  title: "Generate Code Snippet",
  description: "Generate code from comments or requirements",
  category: "code-generation/programming",
  difficulty: "beginner",
  prompt: `/* 
 * 1. Create a list of movies
 * 2. Create a list of ratings for these movies
 * 3. Combine them to make a json object of 10 movies with their ratings.
 */`,
  apiExample: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {
      "role": "user",
      "content": "/*\\n * 1. Create a list of movies\\n * 2. Create a list of ratings for these movies\\n * 3. Combine them to make a json object of 10 movies with their ratings.\\n */"
    }
  ],
  temperature=0,
  max_tokens=300
)`,
  expectedOutput: `import json

# 1. Create a list of movies
movies = ["The Shawshank Redemption", "The Godfather", "The Dark Knight", 
          "Schindler's List", "Pulp Fiction", "The Lord of the Rings: The Return of the King", 
          "Forrest Gump", "Star Wars: Episode V - The Empire Strikes Back", 
          "Inception", "The Silence of the Lambs"]

# 2. Create a list of ratings for these movies
ratings = [9.3, 9.2, 9.0, 8.9, 8.9, 8.9, 8.8, 8.7, 8.7, 8.6]

# 3. Combine them to make a json object of 10 movies with their ratings
movie_ratings = {}

for i in range(len(movies)):
    movie_ratings[movies[i]] = ratings[i]

json_object = json.dumps(movie_ratings, indent=4)
print(json_object)`,
  papers: [],
  tags: ["code-generation", "python", "json", "comment-to-code"]
};
