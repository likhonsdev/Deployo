import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { Message } from '../components/chat/ChatMessages'
import { SYSTEM_PROMPT } from './system-prompt'

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

/**
 * Generates a chat response using the Gemini API
 * @param messageHistory Previous messages in the conversation
 * @param userMessage The latest user message
 * @returns AI-generated response
 */
export async function generateChatResponse(
  messageHistory: Message[],
  userMessage: string
): Promise<string> {
  try {
    // Create the message history in the format expected by the API
    const history = messageHistory
      .filter((m) => m.role === 'user') // Only include user messages for context
      .map((m) => ({
        role: 'user',
        parts: [{ text: m.content }],
      }))

    // Configure the model parameters
    const modelConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
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
    const result = await genAI.models.generateContentStream({
      model: 'gemini-1.5-pro-latest',
      contents: [systemInstruction, ...history, message],
      generationConfig: modelConfig,
    })

    // Process the streamed response
    let response = ''
    for await (const chunk of result) {
      const chunkText = chunk.candidates[0]?.content?.parts?.[0]?.text || ''
      response += chunkText
    }

    return response
  } catch (error) {
    console.error('Error generating AI response:', error)
    throw new Error('Failed to generate AI response')
  }
}
