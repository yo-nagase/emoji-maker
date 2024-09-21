'use client'

import React from 'react';
import { useState, useEffect, useImperativeHandle } from 'react'
import { Card } from './ui/card'

interface Emoji {
  id: string
  url: string
  likes: number
}

interface EmojiListProps {
  // Add any other props here
}

interface EmojiListRef {
  fetchEmojis: () => Promise<void>;
}

const EmojiList = React.forwardRef<EmojiListRef, EmojiListProps>((props, ref) => {
  const [emojis, setEmojis] = useState<Emoji[]>([])

  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/emojis')
      if (!response.ok) {
        throw new Error('絵文字の取得に失敗しました')
      }
      const data = await response.json()
      setEmojis(data)
    } catch (error) {
      console.error('絵文字の取得中にエラーが発生しました:', error)
    }
  }

  useImperativeHandle(ref, () => ({
    fetchEmojis
  }))

  useEffect(() => {
    fetchEmojis()
  }, [])

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">生成された絵文字</h2>
      <div className="grid grid-cols-4 gap-4">
        {emojis.map((emoji) => (
          <div key={emoji.id} className="flex flex-col items-center">
            <img src={emoji.url} alt="生成された絵文字" className="w-16 h-16" />
            <span>いいね: {emoji.likes}</span>
          </div>
        ))}
      </div>
    </Card>
  )
})

EmojiList.displayName = 'EmojiList'

export default EmojiList