import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import { EnhancedChatMessages, EnhancedMessage } from './EnhancedChatMessages'
import { ChatInput } from './ChatInput'
import { generateChatResponseStream, processStreamingResponse } from '@/services/ai-service-v2'

export function EnhancedChat() {
  const [messages, setMessages] = useState<EnhancedMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Handle streaming response
  const handleStream = useCallback(async (userMessage: string) => {
    try {
      setIsLoading(true)
      
      // Create user message
      const newUserMessage: EnhancedMessage = {
        id: nanoid(),
        role: 'user',
        content: userMessage,
      }
      
      // Create placeholder for assistant response
      const assistantMessage: EnhancedMessage = {
        id: nanoid(),
        role: 'assistant',
        content: '',
        isStreaming: true
      }
      
      setMessages(prev => [...prev, newUserMessage, assistantMessage])
      
      // Generate response stream
      const stream = await generateChatResponseStream(messages, userMessage)
      
      // Process the stream
      await processStreamingResponse(
        stream,
        // Text chunk handler
        (text) => {
          setMessages(prev => {
            const updated = [...prev]
            const assistantMessageIndex = updated.length - 1
            updated[assistantMessageIndex] = {
              ...updated[assistantMessageIndex],
              content: updated[assistantMessageIndex].content + text
            }
            return updated
          })
        },
        // Executable code handler
        (code) => {
          setMessages(prev => {
            const updated = [...prev]
            const assistantMessageIndex = updated.length - 1
            updated[assistantMessageIndex] = {
              ...updated[assistantMessageIndex],
              executableCode: code
            }
            return updated
          })
        },
        // Code execution result handler
        (result) => {
          setMessages(prev => {
            const updated = [...prev]
            const assistantMessageIndex = updated.length - 1
            updated[assistantMessageIndex] = {
              ...updated[assistantMessageIndex],
              codeExecutionResult: result
            }
            return updated
          })
        },
        // Completion handler
        () => {
          setMessages(prev => {
            const updated = [...prev]
            const assistantMessageIndex = updated.length - 1
            updated[assistantMessageIndex] = {
              ...updated[assistantMessageIndex],
              isStreaming: false
            }
            return updated
          })
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error('Error handling AI response:', error)
      setIsLoading(false)
    }
  }, [messages])
  
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      <EnhancedChatMessages messages={messages} isLoading={isLoading} />
      <div className="border-t p-4">
        <ChatInput onSendMessage={handleStream} isLoading={isLoading} />
      </div>
    </div>
  )
}
