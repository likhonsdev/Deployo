import { useState, useEffect } from 'react'
import { Message } from './ChatMessages'
import { cn } from '@/lib/utils'
import { CodeBlock } from '../ui/code-block'
import { XmlParser } from '../ui/xml-parser'

interface CodeExecutionMessageProps {
  message: Message & {
    executableCode?: string;
    codeExecutionResult?: string;
    isStreaming?: boolean;
  }
}

export function CodeExecutionMessage({ message }: CodeExecutionMessageProps) {
  const [showThinking, setShowThinking] = useState(false)
  const isUser = message.role === 'user'
  
  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'self-end' : 'self-start'
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          D
        </div>
      )}

      <div
        className={cn(
          'max-w-[85%] rounded-lg p-3',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div>
            <XmlParser content={message.content} showThinking={showThinking} />
            
            {message.executableCode && (
              <div className="mt-4">
                <h4 className="text-sm font-medium">Executable Code</h4>
                <CodeBlock 
                  code={message.executableCode} 
                  language="python"
                  fileName="code.py" 
                />
              </div>
            )}
            
            {message.codeExecutionResult && (
              <div className="mt-4">
                <h4 className="text-sm font-medium">Execution Result</h4>
                <div className="mt-1 whitespace-pre-wrap rounded bg-black/10 p-2 text-sm font-mono">
                  {message.codeExecutionResult}
                </div>
              </div>
            )}
            
            {message.isStreaming ? (
              <div className="mt-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0.0s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0.4s]"></div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowThinking(!showThinking)}
                className="mt-2 text-xs text-muted-foreground hover:text-foreground"
              >
                {showThinking ? 'Hide thinking' : 'Show thinking'}
              </button>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          You
        </div>
      )}
    </div>
  )
}
