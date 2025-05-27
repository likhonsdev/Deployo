import { useState } from 'react'
import { Message } from './ChatMessages'
import { cn } from '@/lib/utils'
import { CodeBlock } from '../ui/code-block'
import { XmlParser } from '../ui/xml-parser'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
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
            
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="mt-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {showThinking ? 'Hide thinking' : 'Show thinking'}
            </button>
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
