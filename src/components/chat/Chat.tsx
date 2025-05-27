import { useState } from 'react'
import { ChatInput } from './ChatInput'
import { ChatMessages, Message } from './ChatMessages'
import { generateChatResponse } from '@/services/ai-service'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `
<thinking>
I'm introducing myself as Deployo, the Python AI pair-programmer. I'll provide a friendly welcome message and outline my capabilities.
</thinking>

<response>
# 👋 Welcome to Deployo!

I'm your Python AI pair-programmer, specialized in:

- Generating production-ready Python code
- Debugging and optimizing existing code
- Guiding you through development workflows
- Explaining Python concepts and best practices

How can I assist with your Python project today?
</response>
      `,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    }
    
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Get AI response
      const response = await generateChatResponse(messages, content)
      
      // Add AI message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
        },
      ])
    } catch (error) {
      console.error('Error generating chat response:', error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `
<thinking>
There was an error generating a response. I'll provide a helpful error message.
</thinking>

<response>
I apologize, but I encountered an error while processing your request. Please try again or rephrase your question.
</response>
          `,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col rounded-lg border border-border bg-card shadow-sm">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}
