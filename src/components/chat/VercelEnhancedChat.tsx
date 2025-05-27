import { useState, useEffect, useRef } from 'react'
import { nanoid } from 'nanoid'
import { motion, AnimatePresence } from '@/lib/animation-utils'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { Message } from './ChatMessages'
import { useCustomChat } from '@/lib/ai-utils'
import { convertToVercelMessages } from '@/services/ai-service-vercel'

export function VercelEnhancedChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Use our custom chat hook as a replacement for Vercel AI SDK's useChat
  const { 
    input, 
    handleInputChange, 
    handleSubmit,
    isLoading,
    setInput
  } = useCustomChat({
    api: '/api/chat', // API endpoint
    onResponse: (response: Response) => {
      // You can add custom handling here
      console.log('Chat response received', response)
    },
    onError: (error: Error) => {
      console.error('Error in chat:', error)
    },
    onFinish: (message: { content: string; role: string }) => {
      // Add the assistant's message to our state
      const newMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: message.content,
      }
      
      setMessages(prev => [...prev, newMessage])
    },
  })
  
  // Custom submit handler to add the user message to our state
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return
    
    // Add the user message to our state
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: input,
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // Call the Vercel AI SDK's submit handler
    handleSubmit(e)
  }
  
  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] bg-background rounded-xl overflow-hidden shadow-lg border border-border/30">
      <div className="flex-1 overflow-y-auto p-3 md:p-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full text-center p-4"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-3 text-foreground">
                Welcome to Deployo
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-md">
                Your AI pair-programmer for Python development. Ask anything about Python, web development, or AI integration.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col space-y-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ChatMessage message={message} />
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 self-start"
                >
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
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="border-t border-border p-3 md:p-4 bg-card/30 backdrop-blur-sm">
        <form onSubmit={handleChatSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <textarea
              className="flex-1 min-h-20 max-h-60 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={isLoading ? "Thinking..." : "Ask me anything about Python..."}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleChatSubmit(e)
                }
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>
              <kbd className="rounded border border-border px-1">Enter</kbd> to send,{" "}
              <kbd className="rounded border border-border px-1">Shift + Enter</kbd> for new line
            </div>
            <div className="hidden sm:block">
              Powered by <span className="font-semibold">Vercel AI SDK</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
