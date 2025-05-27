import { useState } from 'react'
import { ThemeProvider } from './components/ui/theme-provider'
import { Chat } from './components/chat/Chat'
import { EnhancedChat } from './components/chat/EnhancedChat'
import { VercelEnhancedChat } from './components/chat/VercelEnhancedChat'
import { CodeInterpreterUI } from './components/code-interpreter/CodeInterpreterUI'
import { motion } from 'framer-motion'
import ExamplesPage from './components/examples/ExamplesPage'
import { Fireworks } from 'https://esm.run/fireworks-js';

let container = document.querySelector('.container');

let options = {
  gravity: 1.4,
  opacity: 0.4,
  autoresize: true,
  acceleration: 1.00,
};

let fireworks = new Fireworks(container, options);

fireworks.start();
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [chatMode, setChatMode] = useState<'basic' | 'enhanced' | 'vercel' | 'interpreter' | 'examples'>('vercel')
  
  // Handle selecting an example to try in chat
  const handleSelectExampleForChat = (example: any) => {
    // Set chat mode to the appropriate chat interface
    setChatMode('vercel');
    // In a real implementation, you would also populate the chat input with the example prompt
    console.log('Selected example for chat:', example.prompt);
  }

  return (
    <ThemeProvider defaultTheme={isDarkMode ? 'dark' : 'light'}>
      <div className="min-h-screen bg-background text-foreground antialiased">
        <main className="container mx-auto px-4 py-6">
          <motion.header 
            className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Deployo
              </h1>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                Python AI Pair-Programmer
              </span>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <label htmlFor="chat-mode-select" className="sr-only">
                  Select Chat Mode
                </label>
                <select 
                  id="chat-mode-select"
                  value={chatMode}
                  onChange={(e) => setChatMode(e.target.value as 'basic' | 'enhanced' | 'vercel' | 'interpreter' | 'examples')}
                  className="rounded-lg bg-background border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Select Chat Mode"
                >
                  <option value="basic">Basic Chat</option>
                  <option value="enhanced">Enhanced Chat</option>
                  <option value="vercel">Vercel AI SDK</option>
                  <option value="interpreter">Code Interpreter</option>
                  <option value="examples">Prompt Examples</option>
                </select>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-full bg-secondary p-2 text-secondary-foreground hover:bg-secondary/80 transition-colors"
                aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </motion.header>
          
          {chatMode === 'basic' && <Chat />}
          {chatMode === 'enhanced' && <EnhancedChat />}
          {chatMode === 'vercel' && <VercelEnhancedChat />}
          {chatMode === 'interpreter' && <CodeInterpreterUI />}
          {chatMode === 'examples' && <ExamplesPage onSelectExampleForChat={handleSelectExampleForChat} />}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
