import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerateContentStreamResult,
  Part
} from '@google/generative-ai'
import { Message } from '../components/chat/ChatMessages'
import { SYSTEM_PROMPT } from './system-prompt'
import mime from 'mime'

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

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
    const modelParams = {
      model: 'gemini-2.5-pro-preview-05-06',
      tools: tools, // tools should be part of modelParams
    }

    const generationConfig = {
      temperature: 2,
      topP: 0.3,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain', // responseMimeType should be part of generationConfig
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
    // Get the model instance
    const model = genAI.getGenerativeModel(modelConfig.model);

    // Generate the response
    return await model.generateContentStream({
      contents: [systemInstruction, ...history, message],
      generationConfig: { // Pass generationConfig
        temperature: modelConfig.temperature,
        topP: modelConfig.topP,
        topK: modelConfig.topK,
        maxOutputTokens: modelConfig.maxOutputTokens,
      },
      tools: modelConfig.tools, // Pass tools as a top-level property
      responseMimeType: modelConfig.responseMimeType, // Pass responseMimeType as a top-level property
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
    for await (const chunk of stream.stream) {
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
  
  for await (const chunk of stream.stream) {
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
