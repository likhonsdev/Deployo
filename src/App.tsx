import { useState } from 'react'
import { ThemeProvider } from './components/ui/theme-provider'
import { Chat } from './components/chat/Chat'
import { EnhancedChat } from './components/chat/EnhancedChat'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [useCodeExecution, setUseCodeExecution] = useState(true)

  return (
    <ThemeProvider defaultTheme={isDarkMode ? 'dark' : 'light'}>
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto py-4">
          <header className="mb-8 flex items-center justify-between py-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Deployo</h1>
              <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                Python AI Pair-Programmer
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setUseCodeExecution(!useCodeExecution)}
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                {useCodeExecution ? '✓ Code Execution' : '○ Code Execution'}
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-full bg-secondary p-2 text-secondary-foreground"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </header>
          
          {useCodeExecution ? <EnhancedChat /> : <Chat />}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
