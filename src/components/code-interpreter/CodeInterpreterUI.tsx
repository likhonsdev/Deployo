import { useState, useCallback, useRef, useEffect } from 'react'
import { CodeInterpreter, InterpreterCommand, ProgrammingLanguage } from '../../services/code-interpreter-service'
import { exampleCategories, commandExamples } from '../../examples/python-examples'

// Initialize the code interpreter service
const codeInterpreter = new CodeInterpreter()

export function CodeInterpreterUI() {
  const [input, setInput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [messages, setMessages] = useState<Array<{ type: 'input' | 'output', content: string }>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])
  
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])
  
  // Handle code execution
  const executeCode = async (codeToExecute: string) => {
    if (!codeToExecute.trim() || isExecuting) return
    
    // Add code to messages
    setMessages(prev => [...prev, { type: 'input', content: codeToExecute }])
    
    // Execute the code
    setIsExecuting(true)
    try {
      // Check if it's a command
      if (codeToExecute.trim().startsWith('/')) {
        const parts = codeToExecute.trim().split(' ')
        const command = parts[0] as InterpreterCommand
        const args = parts.slice(1).join(' ')
        
        const response = await codeInterpreter.handleCommand(command, args)
        setMessages(prev => [...prev, { type: 'output', content: response }])
      } else {
        // Execute as code
        const result = await codeInterpreter.execute(codeToExecute)
        
        // Format the output
        let outputText = ''
        if (result.error) {
          outputText = `Error: ${result.error.message || 'Unknown error'}`
        } else {
          // Combine stdout and result text
          outputText = [
            ...result.logs.stdout,
            result.text || ''
          ].filter(Boolean).join('\n')
        }
        
        setMessages(prev => [...prev, { type: 'output', content: outputText }])
      }
    } catch (error) {
      // Handle errors
      const errorMessage = error instanceof Error ? error.message : String(error)
      setMessages(prev => [...prev, { type: 'output', content: `Error: ${errorMessage}` }])
    } finally {
      setIsExecuting(false)
      setInput('')
    }
  }
  
  // Handle input submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await executeCode(input)
  }
  
  // Handle example selection
  const handleExampleClick = (code: string) => {
    setInput(code)
  }
  
  // Handle command example selection
  const handleCommandClick = (command: string) => {
    setInput(command)
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
                  isExecuting ? 'opacity-50' : ''
                }`}
                placeholder={isExecuting ? "Executing..." : "Type code or commands..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSubmit(e)
                  }
                }}
                disabled={isExecuting}
              />
              <div className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  <kbd className="px-1 rounded border border-border">Ctrl/Cmd + Enter</kbd> to execute
                </div>
                <button
                  type="submit"
                  disabled={isExecuting || !input.trim()}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isExecuting ? "Executing..." : "Execute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
