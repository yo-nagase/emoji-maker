'use client'

import { Card } from './ui/card'
import { Download, Heart } from 'lucide-react'

interface Emoji {
  id: string
  url: string
  likes: number
}

interface EmojiGridProps {
  emojis: Emoji[]
  setEmojis: React.Dispatch<React.SetStateAction<Emoji[]>>
}

export default function EmojiGrid({ emojis, setEmojis }: EmojiGridProps) {
  const handleLike = async (id: string) => {
    try {
      await fetch(`/api/emojis/${id}/like`, { method: 'POST' })
      setEmojis(prevEmojis =>
        prevEmojis.map(emoji =>
          emoji.id === id ? { ...emoji, likes: emoji.likes + 1 } : emoji
        )
      )
    } catch (error) {
      console.error('Error liking emoji:', error)
    }
  }

  const handleDownload = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji) => (
        <Card key={emoji.id} className="p-4 relative group">
          <img src={emoji.url} alt="Emoji" className="w-full h-auto" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleDownload(emoji.url)}
              className="p-2 bg-white rounded-full mr-2"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleLike(emoji.id)}
              className="p-2 bg-white rounded-full"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-center">{emoji.likes} likes</div>
        </Card>
      ))}
    </div>
  )
}
