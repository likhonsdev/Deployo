import { Message } from '../components/chat/ChatMessages'
import { SYSTEM_PROMPT } from './system-prompt'
import { StreamingTextResponse } from '../lib/ai-utils'
import { nanoid } from 'nanoid'
import { CodeInterpreterService } from './code-interpreter-service'

// Interface for Vercel AI SDK-compatible message
export interface VercelAIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Initialize our code interpreter service
const codeInterpreter = new CodeInterpreterService()

/**
 * Converts our internal message format to the format expected by Vercel AI
 * @param messages Array of internal messages
 * @returns Array of messages in Vercel AI SDK format
 */
export function convertToVercelMessages(
  messages: Message[]
): VercelAIMessage[] {
  // Start with the system message
  const vercelMessages: VercelAIMessage[] = [
    {
      id: nanoid(),
      role: 'system',
      content: SYSTEM_PROMPT,
    },
  ]

  // Convert and add the rest of the messages
  messages.forEach((message) => {
    vercelMessages.push({
      id: message.id,
      role: message.role as 'user' | 'assistant' | 'system',
      content: message.content,
    })
  })

  return vercelMessages
}

/**
 * Creates a streaming response using Vercel AI SDK
 * @param messages Previous messages in the conversation
 * @param userMessage The latest user message
 * @returns Streaming response for the client
 */
export async function generateVercelAIStream(
  messages: Message[],
  userMessage: string
): Promise<Response> {
  // Process the message with our code interpreter
  const interpreterResult = await codeInterpreter.processMessage(userMessage)
  
  // If the message was handled by the interpreter (either as a command or code block)
  if (interpreterResult.response || interpreterResult.executionResult) {
    try {
      // Format the response content
      let content = interpreterResult.response
      
      // Add execution results if available
      if (interpreterResult.executionResult) {
        content += `\n\nCode execution result:\n\`\`\`${interpreterResult.executionResult.language}\n${interpreterResult.executionResult.output}\n\`\`\``
      }
      
      // Create response message
      const resultMessage = {
        id: nanoid(),
        role: 'assistant' as const,
        content
      }
      
      // Return result as streaming response
      return new StreamingTextResponse(new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder()
          controller.enqueue(encoder.encode(resultMessage.content))
          controller.close()
        }
      }))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return new Response(`Error processing interpreter message: ${errorMessage}`, { status: 500 })
    }
  }

  // Convert messages to Vercel AI format
  const vercelMessages = convertToVercelMessages(messages)
  
  // Add the new user message
  vercelMessages.push({
    id: nanoid(),
    role: 'user',
    content: userMessage,
  })

  // Prepare API request options
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gemini-1.5-pro-latest',
      messages: vercelMessages,
      stream: true,
    }),
  }

  try {
    // Make request to the Gemini API
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent',
      requestOptions
    )

    // Check if the response is ok
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} ${errorText}`)
    }

    // Create streaming response
    const stream = response.body
    
    // Return a streaming response using Vercel AI SDK
    return new StreamingTextResponse(stream as ReadableStream)
  } catch (error: unknown) {
    console.error('Error generating AI response:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`Error generating AI response: ${errorMessage}`, { status: 500 })
  }
}
