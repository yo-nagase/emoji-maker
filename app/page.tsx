'use client'

import { useState, useEffect } from 'react'
import EmojiGenerator from '@/components/emoji-generator'
import EmojiGrid from '@/components/emoji-grid'

interface Emoji {
  id: string
  url: string
  likes: number
}

export default function Home() {
  const [emojis, setEmojis] = useState<Emoji[]>([])

  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/emojis')
      const data = await response.json()
      setEmojis(data)
    } catch (error) {
      console.error('Error fetching emojis:', error)
    }
  }

  useEffect(() => {
    fetchEmojis()
  }, [])

  const handleNewEmoji = (newEmoji: Emoji) => {
    setEmojis(prevEmojis => [newEmoji, ...prevEmojis])
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Emoji Generator</h1>
      <EmojiGenerator onNewEmoji={handleNewEmoji} />
      <EmojiGrid emojis={emojis} setEmojis={setEmojis} />
    </main>
  )
}
