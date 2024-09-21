import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
console.log("Emoji取得", id)
  try {
    // First, get the current likes count
    const { data: currentEmoji, error: fetchError } = await supabase
      .from('emojis')
      .select('likes')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    if (!currentEmoji) {
      return NextResponse.json({ error: 'Emoji not found' }, { status: 404 })
    }

    // Increment the likes count
    const newLikesCount = (currentEmoji.likes || 0) + 1

    // Update the emoji with the new likes count
    const { data, error } = await supabase
      .from('emojis')
      .update({ likes: newLikesCount })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error liking emoji:', error)
    return NextResponse.json({ error: 'Failed to like emoji' }, { status: 500 })
  }
}
