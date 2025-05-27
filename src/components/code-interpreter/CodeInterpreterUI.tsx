import { useState, useCallback, useRef, useEffect } from 'react'
import { CodeInterpreterService } from '../../services/code-interpreter-service'

// Initialize the code interpreter service
const codeInterpreter = new CodeInterpreterService()

export function CodeInterpreterUI() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [messages, setMessages] = useState<Array<{ type: 'input' | 'output', content: string }>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])
  
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])
  
  // Handle input submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isExecuting) return
    
    // Add user input to messages
    setMessages(prev => [...prev, { type: 'input', content: input }])
    
    // Process the input with the interpreter
    setIsExecuting(true)
    try {
      const result = await codeInterpreter.processMessage(input)
      
      let outputText = result.response || ''
      
      // Add execution results if available
      if (result.executionResult) {
        if (outputText) {
          outputText += '\n\n'
        }
        outputText += `Execution result (${result.executionResult.language}):\n${result.executionResult.output}`
      }
      
      // Add output to messages
      setMessages(prev => [...prev, { type: 'output', content: outputText }])
    } catch (error) {
      // Handle errors
      const errorMessage = error instanceof Error ? error.message : String(error)
      setMessages(prev => [...prev, { type: 'output', content: `Error: ${errorMessage}` }])
    } finally {
      setIsExecuting(false)
      setInput('')
    }
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
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md">
              <h3 className="text-lg font-medium mb-2">Welcome to Code Interpreter</h3>
              <p className="text-sm text-muted-foreground">
                Start by typing a command like <code className="bg-muted px-1 rounded">/help</code> or write some code in a code block using triple backticks:
              </p>
              <div className="my-4 p-3 bg-muted rounded-md text-sm font-mono">
                ```python<br />
                print("Hello, world!")<br />
                ```
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
  )
}
