import { useState, FormEvent } from 'react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    onSendMessage(input)
    setInput('')
  }

  return (
    <div className="border-t border-border p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          className={cn(
            "flex-1 min-h-[60px] max-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none"
          )}
          placeholder={isLoading ? "Thinking..." : "Ask me anything about Python..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={cn(
            "px-4 py-2 rounded-md bg-primary text-primary-foreground",
            "hover:bg-primary/90",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">
        Press <kbd className="rounded border border-border px-1">Enter</kbd> to send,{" "}
        <kbd className="rounded border border-border px-1">Shift + Enter</kbd> for new line
      </p>
    </div>
  )
}
