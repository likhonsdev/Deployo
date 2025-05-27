import {
  GoogleGenAI,
  GenerativeModel,
  GenerateContentStreamResult,
  Part
} from '@google/generative-ai'
import { Message } from '../components/chat/ChatMessages'
import { SYSTEM_PROMPT } from './system-prompt'
import mime from 'mime'

// Define a type for the content part with code execution properties
interface ContentPartWithExecution extends Part {
  executableCode?: string;
  codeExecutionResult?: string;
}

// Type assertion helper
function hasExecutableCode(part: Part): part is ContentPartWithExecution {
  return (part as ContentPartWithExecution).executableCode !== undefined;
}

function hasCodeExecutionResult(part: Part): part is ContentPartWithExecution {
  return (part as ContentPartWithExecution).codeExecutionResult !== undefined;
}

// Initialize the Google Generative AI
const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY || '')

// Define tools configuration
const tools = [
  { codeExecution: {} },
]

/**
 * Generates a chat response using the Gemini API with code execution capability
 * @param messageHistory Previous messages in the conversation
 * @param userMessage The latest user message
 * @returns Stream of AI-generated response chunks
 */
export async function generateChatResponseStream(
  messageHistory: Message[],
  userMessage: string
): Promise<GenerateContentStreamResult> {
  try {
    // Create the message history in the format expected by the API
    const history = messageHistory
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model', // API expects 'model' for assistant messages
        parts: [{ text: m.content }],
      }))

    // Configure the model parameters for code execution
    const modelConfig = {
      temperature: 2,
      topP: 0.3,
      topK: 64,
      tools,
      responseMimeType: 'text/plain',
      maxOutputTokens: 8192,
    }

    // Create the user message
    const message = {
      role: 'user',
      parts: [{ text: userMessage }],
    }

    // Prepare the system instructions
    const systemInstruction = {
      role: 'system',
      parts: [{ text: SYSTEM_PROMPT }],
    }

    // Generate the response
    return await genAI.models.generateContentStream({
      model: 'gemini-2.5-pro-preview-05-06',
      contents: [systemInstruction, ...history, message],
      generationConfig: modelConfig,
    })
  } catch (error) {
    console.error('Error generating AI response:', error)
    throw new Error('Failed to generate AI response')
  }
}

/**
 * Processes a streaming response and calls the callback for each chunk
 * @param stream The response stream from Gemini API
 * @param onChunk Callback for each chunk
 * @param onComplete Callback when streaming is complete
 */
export async function processStreamingResponse(
  stream: GenerateContentStreamResult,
  onChunk: (text: string) => void,
  onCodeExecution?: (code: string) => void,
  onCodeResult?: (result: string) => void,
  onComplete?: () => void
): Promise<void> {
  let fullResponse = ''
  
  try {
    for await (const chunk of stream) {
      if (!chunk.candidates || !chunk.candidates[0]?.content) {
        continue
      }

      const contentPart = chunk.candidates[0].content.parts[0] as any
      
      // Handle text content
      if (contentPart.text) {
        onChunk(contentPart.text)
        fullResponse += contentPart.text
      }
      
      // Handle executable code
      if (contentPart.executableCode && onCodeExecution) {
        onCodeExecution(contentPart.executableCode)
      }
      
      // Handle code execution result
      if (contentPart.codeExecutionResult && onCodeResult) {
        onCodeResult(contentPart.codeExecutionResult)
      }
    }
    
    if (onComplete) {
      onComplete()
    }
  } catch (error) {
    console.error('Error processing streaming response:', error)
    throw new Error('Failed to process streaming response')
  }
}

/**
 * Helper function to generate a complete response (non-streaming)
 * @param messageHistory Previous messages in the conversation
 * @param userMessage The latest user message
 * @returns Complete AI-generated response
 */
export async function generateChatResponseComplete(
  messageHistory: Message[],
  userMessage: string
): Promise<string> {
  const stream = await generateChatResponseStream(messageHistory, userMessage)
  let fullResponse = ''
  
  for await (const chunk of stream) {
    if (!chunk.candidates || !chunk.candidates[0]?.content?.parts) {
      continue
    }
    
    const contentPart = chunk.candidates[0].content.parts[0]
    if (contentPart.text) {
      fullResponse += contentPart.text
    }
  }
  
  return fullResponse
}
