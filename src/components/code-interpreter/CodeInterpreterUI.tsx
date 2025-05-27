'use client'; // Mark as Client Component

import { useState, useCallback, useRef, useEffect } from 'react';
import { CodeInterpreter, InterpreterCommand } from '../../services/code-interpreter-service';
import { exampleCategories, commandExamples } from '../../examples/python-examples';
import { usePython } from 'react-py'; // Import usePython hook

// Initialize the mock code interpreter service (keeping mock for commands for now)
const codeInterpreter = new CodeInterpreter();

export function CodeInterpreterUI() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'input' | 'output', content: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the usePython hook for execution
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Effect to update messages when stdout or stderr changes
  useEffect(() => {
    if (stdout) {
      setMessages(prev => [...prev, { type: 'output', content: stdout }]);
    }
  }, [stdout]);

  useEffect(() => {
    if (stderr) {
      setMessages(prev => [...prev, { type: 'output', content: `Error: ${stderr}` }]);
    }
  }, [stderr]);


  // Handle code execution
  const executeCode = useCallback(async (codeToExecute: string) => {
    if (!codeToExecute.trim() || isRunning) return; // Use isRunning from usePython

    // Add code to messages
    setMessages(prev => [...prev, { type: 'input', content: codeToExecute }]);

    // Execute the code
    try {
      // Check if it's a command
      if (codeToExecute.trim().startsWith('/')) {
        const parts = codeToExecute.trim().split(' ');
        const command = parts[0] as InterpreterCommand;
        const args = parts.slice(1).join(' ');

        // Use the mock interpreter for commands for now
        const response = await codeInterpreter.handleCommand(command, args);
        setMessages(prev => [...prev, { type: 'output', content: response }]);
        setInput('');
      } else {
        // Execute as code using react-py
        runPython(codeToExecute);
        // Output will be handled by the useEffect hooks for stdout and stderr
      }
    } catch (error) {
      // Handle errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessages(prev => [...prev, { type: 'output', content: `Error: ${errorMessage}` }]);
      setInput('');
    }
  }, [isRunning, runPython]); // Include runPython in dependencies

  // Handle input submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await executeCode(input);
  }, [input, executeCode]);

  // Handle example selection
  const handleExampleClick = useCallback((code: string) => {
    setInput(code);
  }, []);

  // Handle command example selection
  const handleCommandClick = useCallback((command: string) => {
    setInput(command);
  }, []);

  // Show loading state while Pyodide is loading
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background rounded-xl overflow-hidden shadow-lg border border-border/30 items-center justify-center">
        <div className="text-xl font-semibold">Loading Code Interpreter...</div>
        <div className="mt-2">Please wait. This may take a moment.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-xl overflow-hidden shadow-lg border border-border/30">
      <div className="p-3 bg-card text-card-foreground border-b border-border">
        <h2 className="text-xl font-semibold">Code Interpreter</h2>
        <p className="text-sm text-muted-foreground">
          Execute code, install packages, and run shell commands.
          Type <code className="bg-muted px-1 rounded">/help</code> to see available commands.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 h-full">
        {/* Examples sidebar */}
        <div className="hidden md:block border-r border-border p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2">Commands</h3>
              <div className="space-y-1">
                {commandExamples.map((example, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-2 py-1 rounded text-xs hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleCommandClick(example.command)}
                    title={example.description}
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-2">Basic Examples</h3>
              <div className="space-y-1">
                {exampleCategories.basic.map((example, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-2 py-1 rounded text-xs hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleExampleClick(example.code)}
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-2">Intermediate Examples</h3>
              <div className="space-y-1">
                {exampleCategories.intermediate.map((example, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-2 py-1 rounded text-xs hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleExampleClick(example.code)}
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-2">Advanced Examples</h3>
              <div className="space-y-1">
                {exampleCategories.advanced.map((example, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-2 py-1 rounded text-xs hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleExampleClick(example.code)}
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-1 md:col-span-3 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="max-w-md">
                  <h3 className="text-lg font-medium mb-2">Welcome to Code Interpreter</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by typing a command like <code className="bg-muted px-1 rounded">/help</code> or select an example from the sidebar.
                  </p>
                  <div className="my-4 p-3 bg-muted rounded-md text-sm font-mono">
                    # Try Python code like this:<br />
                    print("Hello, world!")
                  </div>
                  <div className="md:hidden mt-4">
                    <h4 className="text-sm font-medium mb-2">Quick Examples:</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 rounded"
                        onClick={() => handleExampleClick(exampleCategories.basic[0].code)}
                      >
                        Hello World
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 rounded"
                        onClick={() => handleCommandClick('/help')}
                      >
                        Help
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md ${
                      message.type === 'input'
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-xs text-muted-foreground uppercase mb-1">
                      {message.type === 'input' ? 'Input' : 'Output'}
                    </div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-sm">
                      {message.content}
                    </pre>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border bg-card/30 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <textarea
                className={`w-full min-h-20 p-2 rounded-md border border-input bg-background resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isRunning ? 'opacity-50' : '' // Use isRunning
                }`}
                placeholder={isRunning ? "Executing..." : "Type code or commands..."} // Use isRunning
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSubmit(e);
                  }
                }}
                disabled={isRunning || isLoading} // Disable while loading or running
              />
              <div className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  <kbd className="px-1 rounded border border-border">Ctrl/Cmd + Enter</kbd> to execute
                </div>
                <button
                  type="submit"
                  disabled={isRunning || isLoading || !input.trim()} // Disable while loading, running, or input is empty
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isRunning ? "Executing..." : "Execute"} // Use isRunning
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Note: SandpackListener and SandpackProvider are removed as react-py is used instead.
