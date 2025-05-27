import { StreamingTextResponse } from '@/lib/ai-utils'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SYSTEM_PROMPT } from '@/services/system-prompt'

// Define request type since we're not using Next.js types
type Request = {
  json: () => Promise<any>;
}

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

// Configure the API Handler
export async function POST(req: Request) {
  try {
    // Extract messages from the request
    const { messages } = await req.json()
    
    // Create the formatted messages array
    const formattedMessages = []
    
    // Add the system message
    formattedMessages.push({
      role: 'system',
      parts: [{ text: SYSTEM_PROMPT }]
    })
    
    // Add user and assistant messages
    for (const message of messages) {
      if (message.role !== 'system') {
        formattedMessages.push({
          role: message.role,
          parts: [{ text: message.content }]
        })
      }
    }
    
    // Configure the model parameters
    const modelConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      stream: true
    }
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' })
    
    // Generate the streaming response
    const result = await model.generateContentStream({
      contents: formattedMessages,
      generationConfig: modelConfig,
    })
    
    // Get the response stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          // Handle the response chunks
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      }
    });
    
    // Return a streaming response
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Error generating AI response:', error)
    return new Response('Error generating AI response', { status: 500 })
  }
}
