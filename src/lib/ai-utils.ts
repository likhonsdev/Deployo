// Import React to use useState and useEffect
import React from 'react';

/**
 * Custom implementation of streaming response handling similar to Vercel's AI SDK
 */

/**
 * A simplified version of StreamingTextResponse that handles streaming text responses
 */
export class StreamingTextResponse extends Response {
  constructor(stream: ReadableStream, init?: ResponseInit) {
    // Set default headers for text streaming
    const customInit = {
      ...init,
      headers: {
        ...(init?.headers || {}),
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    };
    
    super(stream, customInit);
  }
}

/**
 * Options for the useCustomChat hook
 */
interface ChatOptions {
  api: string;
  initialMessages?: Array<{ id: string; role: string; content: string }>;
  onResponse?: (response: Response) => void;
  onFinish?: (message: { content: string; role: string }) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook to replace useChat for client-side chat interactions
 * @param options - Configuration options for the chat API
 */
export function useCustomChat(options: ChatOptions) {
  const { api, initialMessages = [] } = options;
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: initialMessages,
          input
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.text();
      
      if (options.onResponse) {
        options.onResponse(response);
      }
      
      if (options.onFinish) {
        options.onFinish({ content: data, role: 'assistant' });
      }
      
    } catch (error) {
      console.error('Error in chat:', error);
      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error(String(error)));
      }
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };
  
  return {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
}
