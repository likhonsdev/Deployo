import { useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'
import { CodeExecutionMessage } from './CodeExecutionMessage'
import { Message } from './ChatMessages'

export interface EnhancedMessage extends Message {
  executableCode?: string;
  codeExecutionResult?: string;
  isStreaming?: boolean;
}

interface EnhancedChatMessagesProps {
  messages: EnhancedMessage[];
  isLoading: boolean;
}

export function EnhancedChatMessages({ messages, isLoading }: EnhancedChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4">
      <div className="flex flex-col gap-6">
        {messages.map((message) => (
          message.executableCode || message.codeExecutionResult ? (
            <CodeExecutionMessage key={message.id} message={message} />
          ) : (
            <ChatMessage key={message.id} message={message} />
          )
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 self-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              D
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0.0s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
