'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface EmojiGeneratorProps {
  onNewEmoji: (newEmoji: { id: string; url: string; likes: number }) => void
}

export default function EmojiGenerator({ onNewEmoji }: EmojiGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate emoji')
      }

      const data = await response.json()
      onNewEmoji(data.emoji)
      setPrompt('')
    } catch (error) {
      console.error('Error generating emoji:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt for the emoji"
        className="mb-4"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Emoji'}
      </Button>
    </form>
  )
}
