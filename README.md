# Deployo - Python AI Pair-Programmer with Code Execution

Deployo is your always-on pair-programmer for Python development. It provides a generative chat interface with in-depth knowledge of modern Python technologies, offers technical guidance, generates production-ready code, executes Python code directly in chat, and assists with debugging and deployment workflows.

## Features

- **Python Code Execution**: Run Python code directly in the chat and see the results in real-time
- **Streaming Responses**: Get real-time streaming responses as the AI thinks and generates content
- **Advanced Gemini Model**: Uses Google's Gemini 2.5 Pro model for high-quality code generation

- **XML-based Response Structure**: Clear separation between the AI's thinking process and the final response
- **Enhanced Code Blocks**: Rich metadata for code snippets including project, file, description, and environment
- **MDX Component Integration**: Includes LinearProcessFlow, Quiz, math expressions, and complexity analysis
- **Python-exclusive Focus**: Deep expertise in the Python ecosystem and related technologies
- **Project Structure Inference**: Intelligent inference of project structure from code snippets
- **LangChain Debugging**: Specialized support for AI/ML pipelines
- **Deployment Workflows**: Guidance from development to production

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Model**: Google's Gemini API
- **Code Execution**: Sandpack for in-browser code execution
- **Storage**: All data is ephemeral (no persistence)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- A Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/deployo.git
   cd deployo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key to the `.env` file

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Type your Python-related question in the chat input
2. Deployo will respond with a detailed answer, including:
   - Its thinking process (hidden by default, can be shown)
   - The final response with formatted code blocks
   - Interactive components where applicable

## Example Queries

- "Create a FastAPI application with SQLAlchemy models and Pydantic schemas"
- "Explain how to implement authentication in a Django app"
- "Debug my LangChain pipeline that's giving unexpected results"
- "Help me optimize this slow database query"
- "Generate and run a Python function that solves [problem]"
- "Write a data processing script with pandas and show the execution results"

## Code Execution

Deployo now supports direct code execution capabilities:

1. The AI generates Python code based on your requirements
2. The code is executed in a secure environment
3. Execution results are displayed directly in the chat
4. You can iterate on the solution by asking for improvements

This feature is enabled by default but can be toggled off using the "Code Execution" button in the header.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google's Gemini API for the generative AI capabilities
- Google's Gemini 2.5 Pro model for advanced code execution features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
